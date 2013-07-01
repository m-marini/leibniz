/**
 * 
 */
package org.mmarini.leibnitz.function;

import org.mmarini.leibnitz.Array;

/**
 * @author US00852
 * 
 */
public class ArrayFunction implements Function {
	private Array array;

	/**
	 * 
	 * @param array
	 */
	public ArrayFunction(Array array) {
		this.array = array;
	}

	/**
	 * @see org.mmarini.leibnitz.function.Function#apply(org.mmarini.leibnitz.function
	 *      .EvaluationContext)
	 */
	@Override
	public void apply(EvaluationContext context) {
		context.setArray(array.clone());
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return String.valueOf(array);
	}

}
