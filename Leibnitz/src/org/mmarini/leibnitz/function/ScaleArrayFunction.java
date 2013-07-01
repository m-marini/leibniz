/**
 * 
 */
package org.mmarini.leibnitz.function;

import org.mmarini.leibnitz.Array;

/**
 * @author US00852
 * 
 */
public class ScaleArrayFunction extends AbstractBinaryFunction {

	/**
	 * 
	 * @param scale
	 * @param array
	 */
	public ScaleArrayFunction(Function scale, Function array) {
		super(scale, array);
	}

	/**
	 * @see org.mmarini.leibnitz.function.Function#apply(org.mmarini.leibnitz.function
	 *      .EvaluationContext)
	 */
	@Override
	public void apply(EvaluationContext context) {
		getFunction1().apply(context);
		double scale = context.getScalar();
		getFunction2().apply(context);
		Array array = context.getArray();
		array.scale(scale);
		context.setArray(array);
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
