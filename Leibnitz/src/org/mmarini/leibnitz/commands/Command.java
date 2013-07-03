/**
 * 
 */
package org.mmarini.leibnitz.commands;

/**
 * @author US00852
 * 
 */
public interface Command {
	public enum Type {
		SCALAR, VECTOR, QUATERNION, ARRAY
	};

	/**
	 * 
	 * @param context
	 */
	public abstract void apply(CommandContext context);

	/**
	 * 
	 * @return
	 */
	public abstract TypeDimensions getDimensions();

	/**
	 * 
	 * @return
	 */
	public abstract Type getType();

	/**
	 * 
	 */
	public abstract void reset();
}
