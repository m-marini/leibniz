package org.mmarini.leibnitz.function;

import org.mmarini.leibnitz.Array;
import org.mmarini.leibnitz.Vector;

/**
 * 
 * @author US00852
 * 
 */
public interface EvaluationContext {
	/**
	 * 
	 * @return
	 */
	public abstract Array getArray();

	/**
	 * 
	 * @return
	 */
	public abstract double getScalar();

	/**
	 * 
	 * @return
	 */
	public abstract Vector getVector();

	/**
	 * 
	 * @param a1
	 */
	public abstract void setArray(Array a1);

	/**
	 * 
	 * @param order
	 */
	public abstract void setParameter(int order);

	/**
	 * 
	 * @param d
	 */
	public abstract void setScalar(double d);

	/**
	 * 
	 */
	public abstract void setT();

	/**
	 * 
	 * @param vector
	 */
	public abstract void setVector(Vector vector);
}
