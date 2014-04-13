/**
 * 
 */
package org.mmarini.leibnitz.parser;

/**
 * @author US00852
 * 
 */
public class IndexedIdentifier extends AbstractExpression {
	private int index;
	private final String prefix;

	/**
	 * @param name
	 */
	public IndexedIdentifier(final String name, final String prefix) {
		super(name);
		this.prefix = prefix;
	}

	/**
	 * @return the index
	 */
	protected int getIndex() {
		return index;
	}

	/**
	 * @see org.mmarini.leibnitz.parser.AbstractExpression#interpret(org.mmarini.
	 *      leibnitz.parser.InterpreterContext)
	 */
	@Override
	public boolean interpret(final InterpreterContext context)
			throws FunctionParserException {
		if (!context.isIdentifier())
			return false;
		final String token = context.getToken();
		if (!token.startsWith(prefix))
			return false;
		index = parseForIndex(token, prefix.length());
		if (index < 0)
			return false;
		context.nextToken();
		return true;
	}

	/**
	 * 
	 * @param token
	 * @param start
	 * @return
	 */
	private int parseForIndex(final String token, final int start) {
		final char[] bf = token.toCharArray();
		if (start >= bf.length || !Character.isDigit(bf[start]))
			return -1;
		for (int i = start + 1; i < bf.length; ++i)
			if (!Character.isDigit(bf[i]))
				return -1;
		return Integer.parseInt(token.substring(start));
	}
}
