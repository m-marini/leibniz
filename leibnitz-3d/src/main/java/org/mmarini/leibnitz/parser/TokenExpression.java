/**
 * 
 */
package org.mmarini.leibnitz.parser;

/**
 * @author US00852
 * 
 */
public class TokenExpression extends AbstractExpression {

	private final String token;
	private final boolean mandatory;

	/**
	 * 
	 */
	public TokenExpression(final String token) {
		this(token, true);
	}

	/**
	 * 
	 * @param ch
	 * @param mandatory
	 */
	public TokenExpression(final String token, final boolean mandatory) {
		super("\"" + token + "\"");
		this.token = token;
		this.mandatory = mandatory;
	}

	/**
	 * @see org.mmarini.leibnitz.diff.Expression#interpret(org.mmarini.leibnitz.diff
	 *      .IterpreterContext)
	 */
	@Override
	public boolean interpret(final InterpreterContext context)
			throws FunctionParserException {
		if (token.equals(context.getToken())) {
			context.nextToken();
			return true;
		}
		if (mandatory)
			context.generateParseException(this);
		return false;
	}
}
