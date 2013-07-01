/**
 * 
 */
package org.mmarini.leibnitz.parser;

/**
 * @author US00852
 * 
 */
public class TokenExpression extends AbstractExpression {

	private String token;
	private boolean mandatory;

	/**
	 * 
	 */
	public TokenExpression(String token) {
		this(token, true);
	}

	/**
	 * 
	 * @param ch
	 * @param mandatory
	 */
	public TokenExpression(String token, boolean mandatory) {
		super("\"" + token + "\"");
		this.token = token;
		this.mandatory = mandatory;
	}

	/**
	 * @see org.mmarini.leibnitz.diff.Expression#interpret(org.mmarini.leibnitz.diff
	 *      .IterpreterContext)
	 */
	@Override
	public boolean interpret(InterpreterContext context)
			throws FunctionParserException {
		if (token.equals(context.getToken())) {
			context.nextToken();
			return true;
		}
		if (mandatory)
			throw context.generateParseException(this);
		return false;
	}
}
