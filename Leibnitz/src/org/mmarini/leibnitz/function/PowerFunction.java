/**
 * 
 */
package org.mmarini.leibnitz.function;

/**
 * @author US00852
 * 
 */
public class PowerFunction extends AbstractBinaryFunction {

	/**
	 * 
	 * @param base
	 * @param exp
	 */
	public PowerFunction(Function base, Function exp) {
		super(base, exp);
	}

	/**
	 * @see org.mmarini.leibnitz.function.Function#apply(org.mmarini.leibnitz.function.EvaluationContext)
	 */
	@Override
	public void apply(EvaluationContext context) {
		getFunction1().apply(context);
		double a = context.getScalar();
		getFunction2().apply(context);
		double b = context.getScalar();
		context.setScalar(Math.pow(a, b));
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return new StringBuilder("(").append(getFunction1()).append("^")
				.append(getFunction2()).append(")").toString();
	}
}
