/**
 * 
 */
package org.mmarini.leibnitz.parser;

/**
 * @author US00852
 * 
 */
public abstract class AbstractExpression {

	private final String name;

	/**
	 * 
	 * @param name
	 */
	protected AbstractExpression(final String name) {
		this.name = name;
	}

	/**
	 * 
	 */
	public String getName() {
		return name;
	}

	/**
	 * 
	 * @param context
	 * @return
	 * @throws FunctionParserException
	 */
	public abstract boolean interpret(InterpreterContext context)
			throws FunctionParserException;

	/**
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return String.valueOf(name);
	}
}
