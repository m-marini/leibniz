/**
 * 
 */
package org.mmarini.leibnitz.function;

/**
 * @author US00852
 * 
 */
public abstract class AbstractUnaryFunction implements Function {

	private Function function;

	/**
	 * 
	 */
	protected AbstractUnaryFunction() {
	}

	/**
	 * 
	 * @param function
	 */
	protected AbstractUnaryFunction(Function function) {
		this.function = function;
	}

	/**
	 * @return the function
	 */
	protected Function getFunction() {
		return function;
	}

	/**
	 * @param function
	 *            the function to set
	 */
	public void setFunction(Function function) {
		this.function = function;
	}
}
