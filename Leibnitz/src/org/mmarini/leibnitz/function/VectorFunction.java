/**
 * 
 */
package org.mmarini.leibnitz.function;

import org.mmarini.leibnitz.Vector;

/**
 * @author US00852
 * 
 */
public class VectorFunction implements Function {

	private Vector vector;

	/**
	 * 
	 * @param vector
	 */
	public VectorFunction(Vector vector) {
		this.vector = vector;
	}

	/**
	 * @see org.mmarini.leibnitz.function.Function#apply(org.mmarini.leibnitz.function.EvaluationContext)
	 */
	@Override
	public void apply(EvaluationContext context) {
		context.setVector(vector.clone());
	}

	@Override
	public String toString() {
		return String.valueOf(vector);
	}
}
