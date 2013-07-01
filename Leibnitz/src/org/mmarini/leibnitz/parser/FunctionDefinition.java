/**
 * 
 */
package org.mmarini.leibnitz.parser;

import org.mmarini.leibnitz.function.Function;

/**
 * @author US00852
 * 
 */
public class FunctionDefinition {

	public static final int SCALAR_TYPE = 0;
	public static final int VECTOR_TYPE = 1;
	public static final int ARRAY_TYPE = 2;

	private Function function;
	private int type;
	private int rowCount;
	private int colCount;

	/**
	 * 
	 * @param function
	 */
	public FunctionDefinition(Function function) {
		this(function, SCALAR_TYPE, 1, 1);
	}

	/**
	 * 
	 * @param function
	 * @param dimension
	 */
	public FunctionDefinition(Function function, int dimension) {
		this(function, VECTOR_TYPE, dimension, 1);
	}

	/**
	 * 
	 * @param function
	 * @param rowCount
	 * @param colCount
	 */
	public FunctionDefinition(Function function, int rowCount, int colCount) {
		this(function, ARRAY_TYPE, rowCount, colCount);
	}

	/**
	 * 
	 * @param function
	 * @param rowCount
	 * @param colCount
	 * @param vector
	 */
	protected FunctionDefinition(Function function, int type, int rowCount,
			int colCount) {
		this.function = function;
		this.type = type;
		this.rowCount = rowCount;
		this.colCount = colCount;
	}

	/**
	 * 
	 * @param function
	 * @return
	 */
	public FunctionDefinition clone(Function function) {
		return new FunctionDefinition(function, type, rowCount, colCount);
	}

	/**
	 * @return the colCount
	 */
	public int getColCount() {
		return colCount;
	}

	/**
	 * @return the function
	 */
	public Function getFunction() {
		return function;
	}

	/**
	 * @return the rowCount
	 */
	public int getRowCount() {
		return rowCount;
	}

	/**
	 * @return the type
	 */
	public int getType() {
		return type;
	}

	/**
	 * @return the vector
	 */
	public boolean isArray() {
		return type == ARRAY_TYPE;
	}

	/**
	 * @return the vector
	 */
	public boolean isScalar() {
		return type == SCALAR_TYPE;
	}

	/**
	 * @return the vector
	 */
	public boolean isVector() {
		return type == VECTOR_TYPE;
	}
}
