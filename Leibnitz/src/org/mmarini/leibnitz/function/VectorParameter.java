/**
 * 
 */
package org.mmarini.leibnitz.function;

/**
 * @author US00852
 * 
 */
public class VectorParameter implements Function {
	private int order;

	/**
	 * 
	 * @param order
	 */
	public VectorParameter(int order) {
		this.order = order;
	}

	/**
	 * @see org.mmarini.leibnitz.function.Function#apply(org.mmarini.leibnitz.function.EvaluationContext)
	 */
	@Override
	public void apply(EvaluationContext context) {
		// context.setVector(context.getX()[order].clone()); TODO
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		if (order == 0)
			return "Q";
		return new StringBuilder("(Q").append(order).append(")").toString();
	}
}
