/**
 * 
 */
package org.mmarini.leibnitz.function;

/**
 * @author US00852
 * 
 */
public class TanFunction extends AbstractUnaryFunction {

	/**
	 *
	 */
	public TanFunction() {
	}

	/**
	 * @see org.mmarini.leibnitz.function.Function#apply(org.mmarini.leibnitz.function
	 *      .EvaluationContext)
	 */
	@Override
	public void apply(EvaluationContext context) {
		getFunction().apply(context);
		context.setScalar(Math.tan(context.getScalar()));
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
