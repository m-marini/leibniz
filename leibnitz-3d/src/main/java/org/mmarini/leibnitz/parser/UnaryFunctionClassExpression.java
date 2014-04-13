/**
 * 
 */
package org.mmarini.leibnitz.parser;

import org.mmarini.leibnitz.commands.AbstractUnaryCommand;
import org.mmarini.leibnitz.commands.Command;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author US00852
 * 
 */
public class UnaryFunctionClassExpression extends AbstractExpression {
	private static Logger log = LoggerFactory
			.getLogger(UnaryFunctionClassExpression.class);
	private final Class<?> clazz;

	/**
	 * 
	 * @param name
	 * @param clazz
	 */
	public UnaryFunctionClassExpression(final String name, final Class<?> clazz) {
		super(name);
		this.clazz = clazz;
	}

	/**
	 * @see org.mmarini.leibnitz.parser.AbstractExpression#interpret(org.mmarini.
	 *      leibnitz.parser.InterpreterContext)
	 */
	@Override
	public boolean interpret(final InterpreterContext context)
			throws FunctionParserException {
		final Command p = context.pool();
		AbstractUnaryCommand function = null;
		try {
			function = (AbstractUnaryCommand) clazz.newInstance();
		} catch (final InstantiationException e) {
			log.error(e.getMessage(), e);
			throw new FunctionParserException(e.getMessage(), e);
		} catch (final IllegalAccessException e) {
			log.error(e.getMessage(), e);
			throw new FunctionParserException(e.getMessage(), e);
		}
		function.setCommand(p);
		context.push(function);
		return true;
	}
}
