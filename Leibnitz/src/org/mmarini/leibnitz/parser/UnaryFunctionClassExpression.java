/**
 * 
 */
package org.mmarini.leibnitz.parser;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.mmarini.leibnitz.commands.AbstractUnaryCommand;
import org.mmarini.leibnitz.commands.Command;

/**
 * @author US00852
 * 
 */
public class UnaryFunctionClassExpression extends AbstractExpression {
	private static Log log = LogFactory
			.getLog(UnaryFunctionClassExpression.class);
	private Class<?> clazz;

	/**
	 * 
	 * @param name
	 * @param clazz
	 */
	public UnaryFunctionClassExpression(String name, Class<?> clazz) {
		super(name);
		this.clazz = clazz;
	}

	/**
	 * @see org.mmarini.leibnitz.parser.AbstractExpression#interpret(org.mmarini.
	 *      leibnitz.parser.InterpreterContext)
	 */
	@Override
	public boolean interpret(InterpreterContext context)
			throws FunctionParserException {
		Command p = context.pool();
		AbstractUnaryCommand function = null;
		try {
			function = (AbstractUnaryCommand) clazz.newInstance();
		} catch (InstantiationException e) {
			log.error(e.getMessage(), e);
			throw new FunctionParserException(e.getMessage(), e);
		} catch (IllegalAccessException e) {
			log.error(e.getMessage(), e);
			throw new FunctionParserException(e.getMessage(), e);
		}
		function.setCommand(p);
		context.push(function);
		return true;
	}
}
