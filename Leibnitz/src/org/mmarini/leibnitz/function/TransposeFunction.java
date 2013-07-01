package org.mmarini.leibnitz.function;

import org.mmarini.leibnitz.Array;

/**
 * 
 * @author US00852
 * 
 */
public class TransposeFunction extends AbstractUnaryFunction {

	/**
	 * 
	 * @param function
	 */
	public TransposeFunction(Function function) {
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
		a.transpose();
		context.setArray(a);
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return new StringBuilder("(T").append(getFunction()).append(")")
				.toString();
	}

}
