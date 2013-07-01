/**
 * 
 */
package org.mmarini.leibnitz.function;

import org.mmarini.leibnitz.Vector;

/**
 * @author US00852
 * 
 */
public class VersusFunction extends AbstractUnaryFunction {

	/**
	 * 
	 */
	public VersusFunction() {
	}

	/**
	 * @see org.mmarini.leibnitz.function.Function#apply(org.mmarini.leibnitz.function.EvaluationContext)
	 */
	@Override
	public void apply(EvaluationContext context) {
		getFunction().apply(context);
		Vector vector = context.getVector();
		vector.normalize();
		context.setVector(vector);
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return new StringBuilder("N(").append(getFunction()).append(")")
				.toString();
	}

}
