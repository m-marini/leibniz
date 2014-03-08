/**
 * 
 */
package org.mmarini.leibnitz.commands;

import org.mmarini.leibnitz.Vector;

/**
 * @author US00852
 * 
 */
public class SubVCommand extends AbstractBinaryCommand {

	private TypeDimensions dimensions;

	/**
	 * 
	 * @param cmd1
	 * @param cmd2
	 */
	public SubVCommand(final Command cmd1, final Command cmd2) {
		super(cmd1, cmd2);
		final TypeDimensions d1 = cmd1.getDimensions();
		final TypeDimensions d2 = cmd2.getDimensions();
		if (d1.getRowCount() >= d2.getRowCount())
			dimensions = d1;
		else
			dimensions = d2;
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#apply(org.mmarini.leibnitz.commands
	 *      .CommandContext)
	 */
	@Override
	public void apply(final CommandContext context) {
		getCommand1().apply(context);
		final Vector v1 = context.getVector();
		getCommand2().apply(context);
		final Vector v2 = context.getVector();
		v1.subtract(v2);
		context.setVector(v1);
	}

	/**
	 * @see org.mmarini.leibnitz.commands.AbstractBinaryCommand#getDimensions()
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
		return new StringBuilder("(").append(getCommand1()).append("-")
				.append(getCommand2()).append(")").toString();
	}
}
