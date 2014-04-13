/**
 * 
 */
package org.mmarini.leibnitz.parser;

import org.mmarini.leibnitz.commands.Command;

/**
 * @author US00852
 * 
 */
public interface InterpreterContext {

	/**
	 * 
	 * @param expression
	 * @throws FunctionParserException
	 */
	public abstract void generateParseException(AbstractExpression expression)
			throws FunctionParserException;

	/**
	 * 
	 * @param name
	 * @throws FunctionParserException
	 */
	public abstract void generateParseException(String name)
			throws FunctionParserException;

	/**
	 * 
	 * @param token
	 * @return
	 */
	public abstract Command getFunction(String token);

	/**
	 * 
	 * @return
	 */
	public abstract String getToken();

	/**
	 * 
	 * @return
	 */
	public abstract boolean isIdentifier();

	/**
	 * 
	 * @return
	 */
	public abstract boolean isNumber();

	/**
	 * @throws FunctionParserException
	 * 
	 */
	public abstract void nextToken() throws FunctionParserException;

	/**
	 * 
	 * @return
	 */
	public abstract Command peek();

	/**
	 * 
	 * @return
	 */
	public abstract Command pool();

	/**
	 * 
	 * @param command
	 */
	public abstract void push(Command command);
}