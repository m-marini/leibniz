/**
 * 
 */
package org.mmarini.leibnitz.function;

import org.mmarini.leibnitz.Vector;

/**
 * @author US00852
 * 
 */
public class DivideVectorFunction extends AbstractBinaryFunction {

	/**
	 * 
	 * @param n
	 * @param d
	 */
	public DivideVectorFunction(Function n, Function d) {
		super(n, d);
	}

	/**
	 * @see org.mmarini.leibnitz.function.Function#apply(org.mmarini.leibnitz.function.EvaluationContext)
	 */
	@Override
	public void apply(EvaluationContext context) {
		getFunction1().apply(context);
		Vector v = context.getVector();
		getFunction2().apply(context);
		double scale = context.getScalar();
		v.scale(1 / scale);
		context.setVector(v);
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return new StringBuilder("(").append(getFunction1()).append("/")
				.append(getFunction2()).append(")").toString();
	}
}
