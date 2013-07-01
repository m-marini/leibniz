/**
 * 
 */
package org.mmarini.leibnitz.function;

import org.mmarini.leibnitz.Array;

/**
 * @author US00852
 * 
 */
public class ArrayProductFunction extends AbstractBinaryFunction {

	/**
	 * 
	 * @param function1
	 * @param function2
	 */
	public ArrayProductFunction(Function function1, Function function2) {
		super(function1, function2);
	}

	/**
	 * @see org.mmarini.leibnitz.function.Function#apply(org.mmarini.leibnitz.function
	 *      .EvaluationContext)
	 */
	@Override
	public void apply(EvaluationContext context) {
		getFunction1().apply(context);
		Array a1 = context.getArray();
		getFunction2().apply(context);
		Array a2 = context.getArray();
		Array m = a1.clone();
		m.multiply(a1, a2);
		context.setArray(m);
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
