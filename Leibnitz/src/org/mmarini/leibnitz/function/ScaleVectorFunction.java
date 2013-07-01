/**
 * 
 */
package org.mmarini.leibnitz.function;

import org.mmarini.leibnitz.Vector;

/**
 * @author US00852
 * 
 */
public class ScaleVectorFunction extends AbstractBinaryFunction {

	/**
	 * 
	 * @param scale
	 * @param vector
	 */
	public ScaleVectorFunction(Function scale, Function vector) {
		super(scale, vector);
	}

	/**
	 * @see org.mmarini.leibnitz.function.Function#apply(org.mmarini.leibnitz.function.EvaluationContext)
	 */
	@Override
	public void apply(EvaluationContext context) {
		getFunction1().apply(context);
		double scale = context.getScalar();
		getFunction2().apply(context);
		Vector v = context.getVector();
		v.scale(scale);
		context.setVector(v);
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return new StringBuilder("(").append(getFunction1()).append("*")
				.append(getFunction2()).append(")").toString();
	}
}
