/**
 * 
 */
package org.mmarini.leibnitz.parser;

/**
 * An optional expression. If the test expression doesn't match it runs this
 * expression in fail. If next expression completes it runs this expression in
 * completion.
 * <p>
 * The first expression in the list that fails runs this expression in fail.
 * </p>
 * 
 * @author US00852
 * 
 */
public class OptExpression extends SequenceExpression {
	private AbstractExpression test;

	/**
	 * 
	 * @param name
	 */
	public OptExpression(String name) {
		super(name);
	}

	/**
	 * 
	 * @param name
	 */
	public OptExpression(String name, AbstractExpression test,
			AbstractExpression... exp) {
		super(name);
		setTest(test);
		for (AbstractExpression e : exp)
			add(e);
	}

	/**
	 * @see org.mmarini.leibnitz.diff.Expression#interpret(org.mmarini.leibnitz.diff
	 *      .IterpreterContext)
	 */
	@Override
	public boolean interpret(InterpreterContext context)
			throws FunctionParserException {
		if (!test.interpret(context))
			return false;
		return super.interpret(context);
	}

	/**
	 * 
	 * @param test
	 */
	public void setTest(AbstractExpression test) {
		this.test = test;
	}

}
