/**
 * 
 */
package org.mmarini.leibnitz.function;

import org.mmarini.leibnitz.Vector;

/**
 * @author US00852
 * 
 */
public class ScalarProduct extends AbstractBinaryFunction {

	/**
	 * 
	 * @param function
	 * @param function2
	 */
	public ScalarProduct(Function function, Function function2) {
		super(function, function2);

	}

	/**
	 * @see org.mmarini.leibnitz.function.Function#apply(org.mmarini.leibnitz.function.EvaluationContext)
	 */
	@Override
	public void apply(EvaluationContext context) {
		getFunction1().apply(context);
		Vector v1 = context.getVector();
		getFunction2().apply(context);
		Vector v2 = context.getVector();
		double scalar = v1.scalar(v2);
		context.setScalar(scalar);
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
