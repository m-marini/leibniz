/**
 * 
 */
package org.mmarini.leibnitz.function;

/**
 * @author US00852
 * 
 */
public class TraceScalarFunction extends AbstractUnaryFunction {

	/**
	 * 
	 * @param function
	 */
	public TraceScalarFunction(Function function) {
		super(function);
	}

	/**
	 * @see org.mmarini.leibnitz.function.Function#apply(org.mmarini.leibnitz.function.EvaluationContext)
	 */
	@Override
	public void apply(EvaluationContext context) {
		getFunction().apply(context);
		double value = context.getScalar();
		context.setScalar(value * value);
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return new StringBuilder("(tr").append(getFunction()).append(")")
				.toString();
	}
}
