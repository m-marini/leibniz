/**
 * 
 */
package org.mmarini.leibnitz.function;

/**
 * @author US00852
 * 
 */
public class ScalarFunction implements Function {

	private double k;

	/**
	 * 
	 * @param k
	 */
	public ScalarFunction(double k) {
		this.k = k;
	}

	/**
	 * @see org.mmarini.leibnitz.function.Function#apply(org.mmarini.leibnitz.function.EvaluationContext)
	 */
	@Override
	public void apply(EvaluationContext context) {
		context.setScalar(k);
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return String.valueOf(k);
	}
}
