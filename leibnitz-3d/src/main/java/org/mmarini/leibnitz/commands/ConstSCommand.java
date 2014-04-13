/**
 * 
 */
package org.mmarini.leibnitz.commands;

/**
 * @author US00852
 * 
 */
public class ConstSCommand extends AbstractCommand {

	private final double value;

	/**
	 * 
	 * @param value
	 */
	public ConstSCommand(final double value) {
		this.value = value;
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#apply(org.mmarini.leibnitz.commands
	 *      .CommandContext)
	 */
	@Override
	public void apply(final CommandContext context) {
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
