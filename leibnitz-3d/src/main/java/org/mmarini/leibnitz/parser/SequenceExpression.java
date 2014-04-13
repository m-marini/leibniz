/**
 * 
 */
package org.mmarini.leibnitz.parser;

/**
 * A sequence of mandatory expressions.
 * <p>
 * The first expression in the list that fails runs this expression in fail.
 * </p>
 * 
 * @author US00852
 * 
 */
public class SequenceExpression extends AbstractCompositeExpression {

	/**
	 * 
	 * @param name
	 */
	public SequenceExpression(final String name) {
		super(name);
	}

	/**
	 * @see org.mmarini.leibnitz.diff.Expression#interpret(org.mmarini.leibnitz.diff
	 *      .IterpreterContext)
	 */
	@Override
	public boolean interpret(final InterpreterContext context)
			throws FunctionParserException {
		for (final AbstractExpression e : getExpressions()) {
			if (!e.interpret(context))
				context.generateParseException(this);
		}
		return true;
	}
}