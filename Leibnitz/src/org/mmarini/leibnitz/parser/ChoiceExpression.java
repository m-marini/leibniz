/**
 * 
 */
package org.mmarini.leibnitz.parser;

/**
 * A choice of expressions.
 * <p>
 * The first expression in the list that matches runs this expression correctly.
 * If none expressions match it runs on error this expression if mandatory
 * otherwise complete in fail this expression.
 * </p>
 * 
 * @author US00852
 * 
 */
public class ChoiceExpression extends AbstractCompositeExpression {
	private boolean mandatory;

	/**
	 * 
	 */
	public ChoiceExpression(String name) {
		this(name, true);
	}

	/**
	 * 
	 * @param mandatory
	 */
	public ChoiceExpression(String name, boolean mandatory) {
		super(name);
		this.mandatory = mandatory;
	}

	/**
	 * @see org.mmarini.leibnitz.diff.Expression#interpret(org.mmarini.leibnitz.diff
	 *      .IterpreterContext)
	 */
	@Override
	public boolean interpret(InterpreterContext context)
			throws FunctionParserException {
		for (AbstractExpression e : getExpressions()) {
			if (e.interpret(context))
				return true;
		}
		if (mandatory)
			context.generateParseException(this);
		return false;
	}

}
