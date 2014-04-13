/**
 * 
 */
package org.mmarini.leibnitz.parser;

import java.util.ArrayDeque;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Queue;

import org.mmarini.leibnitz.commands.Command;

/**
 * @author US00852
 * 
 */
public class ExpressionInterpreter implements InterpreterContext {

	private static final int INDEX_STACK_SIZE = 20;

	private String token;
	private char[] data;
	private int idx;
	private int start;
	private int end;
	private boolean number;
	private boolean integer;
	private final int[] index;
	private final Queue<Command> stack;
	private int indexStack;
	private final Map<String, Command> symbolTable;
	private boolean identifier;

	/**
	 * 
	 */
	public ExpressionInterpreter() {
		symbolTable = new HashMap<String, Command>();
		stack = Collections.asLifoQueue(new ArrayDeque<Command>());
		index = new int[INDEX_STACK_SIZE];
		indexStack = -1;
	}

	/**
	 * Clean the symbol table
	 */
	public void clear() {
		symbolTable.clear();
	}

	/**
	 * @see org.mmarini.leibnitz.parser.InterpreterContext#generateParseException
	 *      (org.mmarini.leibnitz.parser.AbstractExpression)
	 */
	@Override
	public void generateParseException(final AbstractExpression expression)
			throws FunctionParserException {
		generateParseException("syntax rule " + expression.getName());
	}

	/**
	 * @see org.mmarini.leibnitz.parser.InterpreterContext#generateParseException
	 *      (java.lang.String)
	 */
	@Override
	public void generateParseException(final String name)
			throws FunctionParserException {
		final StringBuilder message = new StringBuilder();
		message.append("Error at \"");
		retrieveBuffer(message).append("\": ").append(name);
		throw new FunctionParserException(message.toString());
	}

	/**
	 * @see org.mmarini.leibnitz.parser.InterpreterContext#getFunction(java.lang.
	 *      String)
	 */
	@Override
	public Command getFunction(final String id) {
		return symbolTable.get(id);
	}

	/**
	 * @see org.mmarini.leibnitz.parser.InterpreterContext#getToken()
	 */
	@Override
	public String getToken() {
		return token;
	}

	/**
	 * @param text
	 * @throws FunctionParserException
	 */
	protected void init(final String text) throws FunctionParserException {
		data = text.toCharArray();
		idx = 0;
		start = 0;
		end = 0;
		nextToken();
	}

	/**
	 * 
	 * @return
	 */
	@Override
	public boolean isIdentifier() {
		return identifier;
	}

	/**
	 * 
	 * @return
	 */
	protected boolean isInteger() {
		return integer;
	}

	/**
	 * @see org.mmarini.leibnitz.parser.InterpreterContext#isNumber()
	 */
	@Override
	public boolean isNumber() {
		return number;
	}

	/**
	 * @see org.mmarini.leibnitz.parser.InterpreterContext#nextToken()
	 */
	@Override
	public void nextToken() throws FunctionParserException {
		skipBlanks();
		start = idx;
		final int n = data.length;
		token = null;
		integer = false;
		number = false;
		identifier = false;
		if (idx >= n)
			return;
		end = idx;
		final char ch = data[idx];
		if (Character.isDigit(ch))
			parseNumber();
		else if (ch == '.')
			parseFract();
		else if (Character.isJavaIdentifierStart(ch))
			parseIdentifer();
		else {
			token = new String(data, idx, 1);
			++idx;
		}
		end = idx;
	}

	/**
	 * 
	 * @param text
	 * @param syntax
	 * @return
	 * @throws FunctionParserException
	 */
	public Command parse(final String text, final AbstractExpression syntax)
			throws FunctionParserException {
		init(text);
		syntax.interpret(this);
		return pool();
	}

	/**
	 * @throws FunctionParserException
	 * 
	 */
	private void parseFract() throws FunctionParserException {
		end = idx + 1;
		if (end < data.length && Character.isDigit(data[end])) {
			number = true;
			skipInteger();
			skipExponent();
		}
		token = new String(data, idx, end - idx);
		idx = end;
	}

	/**
	 *
	 */
	private void parseIdentifer() {
		int i = idx;
		final char[] data = this.data;
		final int n = data.length;
		while (i < n && Character.isJavaIdentifierPart(data[i]))
			++i;
		token = new String(data, idx, i - idx);
		idx = i;
		identifier = true;
	}

	/**
	 * @throws FunctionParserException
	 * 
	 */
	private void parseNumber() throws FunctionParserException {
		number = true;
		integer = true;
		skipInteger();
		skipFract();
		token = new String(data, idx, end - idx);
		idx = end;
	}

	/**
	 * @see org.mmarini.leibnitz.parser.InterpreterContext#peek()
	 */
	@Override
	public Command peek() {
		return stack.peek();
	}

	/**
	 * @see org.mmarini.leibnitz.parser.InterpreterContext#pool()
	 */
	@Override
	public Command pool() {
		return stack.poll();
	}

	/**
	 * @return the index
	 */
	public int poolInteger() {
		return index[indexStack--];
	}

	/**
	 * @see org.mmarini.leibnitz.parser.InterpreterContext#push(org.mmarini.leibnitz
	 *      .commands.Command)
	 */
	@Override
	public void push(final Command command) {
		stack.offer(command);
	}

	/**
	 * @param index
	 *            the index to set
	 */
	public void push(final int index) {
		this.index[++indexStack] = index;
	}

	/**
	 * 
	 * @param id
	 * @param definition
	 */
	public void put(final String id, final Command definition) {
		symbolTable.put(id, definition);
	}

	/**
	 * 
	 * @param message
	 * @return
	 */
	private StringBuilder retrieveBuffer(final StringBuilder message) {
		if (start >= 10) {
			message.append("...").append(data, start - 10, 10);
		} else if (data.length > 0) {
			message.append(data, 0, start);
		}

		message.append("[");

		if (start >= data.length)
			message.append("<eof>");
		else
			message.append(data, start, end - start);

		message.append("]");
		if (end < data.length) {
			final int len = data.length - end;
			if (len <= 10)
				message.append(data, end, len);
			else {
				message.append(data, end, 10).append("...");
			}
		}
		return message;
	}

	/**
	 *
	 */
	private void skipBlanks() {
		int i = idx;
		final char[] data = this.data;
		final int n = data.length;
		while (i < n && Character.isWhitespace(data[i]))
			++i;
		idx = i;
	}

	/**
	 * 
	 * @throws FunctionParserException
	 */
	private void skipExponent() throws FunctionParserException {
		final char[] data = this.data;
		final int n = data.length;
		if (end >= n || Character.toUpperCase(data[end]) != 'E')
			return;
		++end;
		if (end >= n)
			generateParseException("Invalid literal number");

		integer = false;
		final char ch = data[end];
		if (ch == '+' || ch == '-')
			++end;
		if (end >= n || !Character.isDigit(data[end]))
			generateParseException("Invalid literal number");
		skipInteger();
	}

	/**
	 * @throws FunctionParserException
	 * 
	 */
	private void skipFract() throws FunctionParserException {
		final char[] data = this.data;
		final int n = data.length;
		if (end < n && data[end] == '.') {
			integer = false;
			++end;
			skipInteger();
		}
		skipExponent();
	}

	/**
	 *
	 */
	private void skipInteger() {
		int i = end;
		final char[] data = this.data;
		final int n = data.length;
		while (i < n && Character.isDigit(data[i]))
			++i;
		end = i;
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		final StringBuilder bfr = new StringBuilder();
		bfr.append("InterpreterContext [");
		return retrieveBuffer(bfr).append("]").toString();
	}
}
