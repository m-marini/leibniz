/**
 * 
 */
package org.mmarini.leibnitz.function;

/**
 * @author US00852
 * 
 */
public class DivideScalarFunction extends AbstractBinaryFunction {

	/**
	 * 
	 * @param n
	 * @param d
	 */
	public DivideScalarFunction(Function n, Function d) {
		super(n, d);
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
		context.setScalar(a / b);
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return new StringBuilder("(").append(getFunction1()).append("/")
				.append(getFunction2()).append(")").toString();
	}
}
