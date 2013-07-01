/**
 * 
 */
package org.mmarini.leibnitz.parser;

import org.mmarini.leibnitz.function.AbstractUnaryFunction;

/**
 * @author US00852
 * 
 */
public class UnaryFunctionClassExpression extends AbstractExpression {
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
		FunctionDefinition p = context.pool();
		AbstractUnaryFunction function = null;
		try {
			function = (AbstractUnaryFunction) clazz.newInstance();
		} catch (InstantiationException | IllegalAccessException e) {
			e.printStackTrace();
			throw new FunctionParserException(e.getMessage(), e);
		}
		function.setFunction(p.getFunction());
		context.push(p.clone(function));
		return true;
	}
}
