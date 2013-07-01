/**
 * 
 */
package org.mmarini.leibnitz.function;

/**
 * @author US00852
 * 
 */
public class TraceVectFunction extends AbstractUnaryFunction {

	/**
	 * 
	 * @param function
	 */
	public TraceVectFunction(Function function) {
		super(function);
	}

	/**
	 * @see org.mmarini.leibnitz.function.Function#apply(org.mmarini.leibnitz.function.EvaluationContext)
	 */
	@Override
	public void apply(EvaluationContext context) {
		getFunction().apply(context);
		context.setScalar(context.getVector().getTrace());
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
