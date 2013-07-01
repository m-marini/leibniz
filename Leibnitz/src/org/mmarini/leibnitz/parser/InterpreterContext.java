/**
 * 
 */
package org.mmarini.leibnitz.parser;

import java.util.ArrayDeque;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Queue;

/**
 * @author US00852
 * 
 */
public class InterpreterContext {

	private static final int INDEX_STACK_SIZE = 20;

	private String token;
	private char[] data;
	private int idx;
	private int start;
	private int end;
	private boolean number;
	private boolean integer;
	private int order;
	private int dimension;
	private int[] index;
	private Queue<FunctionDefinition> stack;
	private int indexStack;
	private Map<String, FunctionDefinition> varTable;

	private boolean identifier;

	/**
	 * 
	 */
	public InterpreterContext() {
		varTable = new HashMap<>();
		stack = Collections.asLifoQueue(new ArrayDeque<FunctionDefinition>());
		index = new int[INDEX_STACK_SIZE];
		indexStack = -1;
	}

	/**
	 *
	 */
	public void clear() {
		varTable.clear();
	}

	/**
	 * 
	 * @param expression
	 * @return
	 */
	protected FunctionParserException generateParseException(
			AbstractExpression expression) {
		return generateParseException("syntax rule " + expression.getName());
	}

	/**
	 * 
	 * @param name
	 * @return
	 */
	protected FunctionParserException generateParseException(String name) {
		StringBuilder message = new StringBuilder();
		message.append("Error at \"");
		retrieveBuffer(message).append("\": ").append(name);
		return new FunctionParserException(message.toString());
	}

	/**
	 * @return the dimension
	 */
	public int getDimension() {
		return dimension;
	}

	/**
	 * @return the order
	 */
	protected int getOrder() {
		return order;
	}

	/**
	 * 
	 * @return
	 */
	protected String getToken() {
		return token;
	}

	/**
	 * 
	 * @param id
	 * @return
	 */
	public FunctionDefinition getVariable(String id) {
		return varTable.get(id);
	}

	/**
	 * @param text
	 * @throws FunctionParserException
	 */
	protected void init(String text) throws FunctionParserException {
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
	 * 
	 * @return
	 */
	protected boolean isNumber() {
		return number;
	}

	/**
	 * @throws FunctionParserException
	 * 
	 */
	protected void nextToken() throws FunctionParserException {
		skipBlanks();
		start = idx;
		int n = data.length;
		token = null;
		integer = false;
		number = false;
		identifier = false;
		if (idx >= n)
			return;
		end = idx;
		char ch = data[idx];
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
	public FunctionDefinition parse(String text, AbstractExpression syntax)
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
		char[] data = this.data;
		int n = data.length;
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
	 * 
	 * @return
	 */
	protected FunctionDefinition peek() {
		return stack.peek();
	}

	/**
	 * 
	 * @return
	 */
	protected FunctionDefinition pool() {
		return stack.poll();
	}

	/**
	 * @return the index
	 */
	public int poolInteger() {
		return index[indexStack--];
	}

	/**
	 * 
	 * @param functionResult
	 */
	protected void push(FunctionDefinition functionResult) {
		stack.offer(functionResult);
	}

	/**
	 * @param index
	 *            the index to set
	 */
	public void push(int index) {
		this.index[++indexStack] = index;
	}

	/**
	 * 
	 * @param id
	 * @param definition
	 */
	public void put(String id, FunctionDefinition definition) {
		varTable.put(id, definition);
	}

	/**
	 * 
	 * @param message
	 * @return
	 */
	private StringBuilder retrieveBuffer(StringBuilder message) {
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
			int len = data.length - end;
			if (len <= 10)
				message.append(data, end, len);
			else {
				message.append(data, end, 10).append("...");
			}
		}
		return message;
	}

	/**
	 * @param dimension
	 *            the dimension to set
	 */
	public void setDimension(int dimension) {
		this.dimension = dimension;
	}

	/**
	 * @param order
	 *            the order to set
	 */
	public void setOrder(int order) {
		this.order = order;
	}

	/**
	 *
	 */
	private void skipBlanks() {
		int i = idx;
		char[] data = this.data;
		int n = data.length;
		while (i < n && Character.isWhitespace(data[i]))
			++i;
		idx = i;
	}

	/**
	 * 
	 * @throws FunctionParserException
	 */
	private void skipExponent() throws FunctionParserException {
		char[] data = this.data;
		int n = data.length;
		if (end >= n || Character.toUpperCase(data[end]) != 'E')
			return;
		++end;
		if (end >= n)
			throw generateParseException("Invalid literal number");

		integer = false;
		char ch = data[end];
		if (ch == '+' || ch == '-')
			++end;
		if (end >= n || !Character.isDigit(data[end]))
			throw generateParseException("Invalid literal number");
		skipInteger();
	}

	/**
	 * @throws FunctionParserException
	 * 
	 */
	private void skipFract() throws FunctionParserException {
		char[] data = this.data;
		int n = data.length;
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
		char[] data = this.data;
		int n = data.length;
		while (i < n && Character.isDigit(data[i]))
			++i;
		end = i;
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		StringBuilder bfr = new StringBuilder();
		bfr.append("InterpreterContext [");
		return retrieveBuffer(bfr).append("]").toString();
	}
}
