/**
 * 
 */
package org.mmarini.leibnitz.function;

import org.mmarini.leibnitz.Array;

/**
 * @author US00852
 * 
 */
public class NegateArrayFunction extends AbstractUnaryFunction {

	/**
	 * 
	 * @param function
	 */
	public NegateArrayFunction(Function function) {
		super(function);
	}

	/**
	 * @see org.mmarini.leibnitz.function.Function#apply(org.mmarini.leibnitz.function
	 *      .EvaluationContext)
	 */
	@Override
	public void apply(EvaluationContext context) {
		getFunction().apply(context);
		Array array = context.getArray();
		array.negate();
		context.setArray(array);
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
