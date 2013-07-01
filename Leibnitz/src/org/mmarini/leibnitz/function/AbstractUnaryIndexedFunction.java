/**
 * 
 */
package org.mmarini.leibnitz.function;

/**
 * @author US00852
 * 
 */
public abstract class AbstractUnaryIndexedFunction extends
		AbstractUnaryFunction {

	private int index;

	/**
	 * 
	 * @param function
	 */
	protected AbstractUnaryIndexedFunction(int index, Function function) {
		super(function);
		this.index = index;
	}

	/**
	 * @return the index
	 */
	protected int getIndex() {
		return index;
	}
}
