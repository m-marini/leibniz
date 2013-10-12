/**
 * 
 */
package org.mmarini.leibnitz.commands;

/**
 * @author US00852
 * 
 */
public class ConstSCommand extends AbstractCommand {

	private double value;

	/**
	 * 
	 * @param value
	 */
	public ConstSCommand(double value) {
		this.value = value;
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#apply(org.mmarini.leibnitz.commands
	 *      .CommandContext)
	 */
	@Override
	public void apply(CommandContext context) {
		context.setScalar(value);
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#getDimensions()
	 */
	@Override
	public TypeDimensions getDimensions() {
		return null;
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#getType()
	 */
	@Override
	public Type getType() {
		return Type.SCALAR;
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return String.valueOf(value);
	}

}
