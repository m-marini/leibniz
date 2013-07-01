/**
 * 
 */
package org.mmarini.leibnitz.function;

import org.mmarini.leibnitz.Vector;

/**
 * @author US00852
 * 
 */
public class NegateVectorFunction extends AbstractUnaryFunction {

	/**
	 * 
	 * @param function
	 */
	public NegateVectorFunction(Function function) {
		super(function);
	}

	/**
	 * @see org.mmarini.leibnitz.function.Function#apply(org.mmarini.leibnitz.function.EvaluationContext)
	 */
	@Override
	public void apply(EvaluationContext context) {
		getFunction().apply(context);
		Vector v = context.getVector();
		v.inverse();
		context.setVector(v);
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return new StringBuilder("(-").append(getFunction()).append(")")
				.toString();
	}
}
