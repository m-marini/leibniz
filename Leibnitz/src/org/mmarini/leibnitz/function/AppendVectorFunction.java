/**
 * 
 */
package org.mmarini.leibnitz.function;

import org.mmarini.leibnitz.Array;
import org.mmarini.leibnitz.Vector;

/**
 * @author US00852
 * 
 */
public class AppendVectorFunction extends AbstractBinaryFunction implements
		Function {

	/**
	 * @param function1
	 * @param function2
	 */
	public AppendVectorFunction(Function function1, Function function2) {
		super(function1, function2);
	}

	/**
	 * @see org.mmarini.leibnitz.function.Function#apply(org.mmarini.leibnitz.function
	 *      .EvaluationContext)
	 */
	@Override
	public void apply(EvaluationContext context) {
		getFunction1().apply(context);
		Vector a = context.getVector();
		Array array = new Array(a);
		getFunction2().apply(context);
		Vector v = context.getVector();
		array.append(v);
		context.setArray(array);
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return new StringBuilder().append("(").append(getFunction1())
				.append(";").append(getFunction2()).append(")").toString();
	}
}
