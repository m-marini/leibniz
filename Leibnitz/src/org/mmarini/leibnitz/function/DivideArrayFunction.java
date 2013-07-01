/**
 * 
 */
package org.mmarini.leibnitz.function;

import org.mmarini.leibnitz.Array;

/**
 * @author US00852
 * 
 */
public class DivideArrayFunction extends AbstractBinaryFunction {
	/**
	 * 
	 * @param n
	 * @param d
	 */
	public DivideArrayFunction(Function n, Function d) {
		super(n, d);
	}

	/**
	 * @see org.mmarini.leibnitz.function.Function#apply(org.mmarini.leibnitz.function
	 *      .EvaluationContext)
	 */
	@Override
	public void apply(EvaluationContext context) {
		getFunction1().apply(context);
		Array array = context.getArray();
		getFunction2().apply(context);
		double scale = context.getScalar();
		array.scale(1. / scale);
		context.setArray(array);
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
