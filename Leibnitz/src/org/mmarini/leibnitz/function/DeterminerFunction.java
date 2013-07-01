/**
 * 
 */
package org.mmarini.leibnitz.function;

import org.mmarini.leibnitz.Array;

/**
 * @author US00852
 * 
 */
public class DeterminerFunction extends AbstractUnaryFunction {

	/**
	 * @param function
	 */
	public DeterminerFunction(Function function) {
		super(function);
	}

	/**
	 * @see org.mmarini.leibnitz.function.Function#apply(org.mmarini.leibnitz.function
	 *      .EvaluationContext)
	 */
	@Override
	public void apply(EvaluationContext context) {
		getFunction().apply(context);
		Array a = context.getArray();
		context.setScalar(a.getDeterminer());
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return new StringBuffer("(det").append(getFunction()).append(")")
				.toString();
	}

}
