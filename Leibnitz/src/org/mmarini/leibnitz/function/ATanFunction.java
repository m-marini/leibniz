/**
 * 
 */
package org.mmarini.leibnitz.function;

/**
 * @author US00852
 * 
 */
public class ATanFunction extends AbstractUnaryFunction {

	/**
	 * @param function
	 */
	public ATanFunction() {
	}

	/**
	 * @see org.mmarini.leibnitz.function.Function#apply(org.mmarini.leibnitz.function
	 *      .EvaluationContext)
	 */
	@Override
	public void apply(EvaluationContext context) {
		getFunction().apply(context);
		context.setScalar(Math.atan(context.getScalar()));
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return new StringBuilder("(sin").append(getFunction()).append(")")
				.toString();
	}
}
