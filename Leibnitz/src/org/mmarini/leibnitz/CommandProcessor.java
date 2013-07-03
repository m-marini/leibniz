/**
 * 
 */
package org.mmarini.leibnitz;

import org.mmarini.leibnitz.commands.CommandContext;

/**
 * @author Marco
 * 
 */
public class CommandProcessor implements CommandContext {

	private double scalar;
	private Vector vector;
	private Quaternion quaternion;
	private Array array;

	/**
	 * 
	 */
	public CommandProcessor() {
	}

	/**
	 * @see org.mmarini.leibnitz.commands.CommandContext#getArray()
	 */
	@Override
	public Array getArray() {
		return array;
	}

	/**
	 * @see org.mmarini.leibnitz.commands.CommandContext#getQuaternion()
	 */
	@Override
	public Quaternion getQuaternion() {
		return quaternion;
	}

	/**
	 * @see org.mmarini.leibnitz.commands.CommandContext#getScalar()
	 */
	@Override
	public double getScalar() {
		return scalar;
	}

	/**
	 * @see org.mmarini.leibnitz.commands.CommandContext#getVector()
	 */
	@Override
	public Vector getVector() {
		return vector;
	}

	/**
	 * @see org.mmarini.leibnitz.commands.CommandContext#setArray(org.mmarini.leibnitz
	 *      .Array)
	 */
	@Override
	public void setArray(Array array) {
		this.array = array;
	}

	/**
	 * @see org.mmarini.leibnitz.commands.CommandContext#setQuaternion(org.mmarini
	 *      .leibnitz.Quaternion)
	 */
	@Override
	public void setQuaternion(Quaternion quaternion) {
		this.quaternion = quaternion;
	}

	/**
	 * @see org.mmarini.leibnitz.commands.CommandContext#setScalar(double)
	 */
	@Override
	public void setScalar(double value) {
		scalar = value;
	}

	/**
	 * @see org.mmarini.leibnitz.commands.CommandContext#setVector(org.mmarini.leibnitz
	 *      .Vector)
	 */
	@Override
	public void setVector(Vector vector) {
		this.vector = vector;
	}

}
