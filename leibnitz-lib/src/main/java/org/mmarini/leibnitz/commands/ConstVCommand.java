/**
 * 
 */
package org.mmarini.leibnitz.commands;

import org.mmarini.leibnitz.Vector;

/**
 * @author US00852
 * 
 */
public class ConstVCommand extends AbstractCommand {

	private Vector vector;
	private TypeDimensions dimensions;

	/**
	 * 
	 * @param vector
	 */
	public ConstVCommand(Vector vector) {
		this.vector = vector;
		dimensions = new TypeDimensions(vector.getDimension());
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#apply(org.mmarini.leibnitz.commands
	 *      .CommandContext)
	 */
	@Override
	public void apply(CommandContext context) {
		context.setVector(vector.clone());
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#getDimensions()
	 */
	@Override
	public TypeDimensions getDimensions() {
		return dimensions;
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#getType()
	 */
	@Override
	public Type getType() {
		return Type.VECTOR;
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return String.valueOf(vector);
	}
}
