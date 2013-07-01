/**
 * 
 */
package org.mmarini.leibnitz.function;

/**
 * @author US00852
 * 
 */
public abstract class AbstractBinaryFunction implements Function {
	private Function function1;
	private Function function2;

	/**
	 * 
	 * @param function
	 */
	protected AbstractBinaryFunction(Function function1, Function function2) {
		this.function1 = function1;
		this.function2 = function2;
	}

	/**
	 * @return the function1
	 */
	protected Function getFunction1() {
		return function1;
	}

	/**
	 * @return the function2
	 */
	protected Function getFunction2() {
		return function2;
	}
}
