/**
 * 
 */
package org.mmarini.leibnitz.commands;

import org.mmarini.leibnitz.Array;
import org.mmarini.leibnitz.Quaternion;
import org.mmarini.leibnitz.Vector;

/**
 * @author US00852
 * 
 */
public interface CommandContext {

	/**
	 * 
	 * @return
	 */
	public abstract Array getArray();

	/**
	 * 
	 * @return
	 */
	public abstract Quaternion getQuaternion();

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
	 * @param clone
	 */
	public abstract void setArray(Array clone);

	/**
	 * 
	 * @param quaternion
	 */
	public abstract void setQuaternion(Quaternion quaternion);

	/**
	 * 
	 * @param value
	 */
	public abstract void setScalar(double value);

	/**
	 * 
	 * @param clone
	 */
	public abstract void setVector(Vector clone);

}
