/**
 * 
 */
package org.mmarini.leibnitz.commands;

import org.mmarini.leibnitz.Array;

/**
 * @author US00852
 * 
 */
public class DivACommand extends AbstractBinaryCommand {
	/**
	 * 
	 * @param n
	 * @param d
	 */
	public DivACommand(Command n, Command d) {
		super(n, d);
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#apply(org.mmarini.leibnitz.commands
	 *      .CommandContext)
	 */
	@Override
	public void apply(CommandContext context) {
		getCommand1().apply(context);
		Array array = context.getArray();
		getCommand2().apply(context);
		double scale = context.getScalar();
		array.scale(1. / scale);
		context.setArray(array);
	}

	/**
	 * @see org.mmarini.leibnitz.commands.AbstractBinaryCommand#getDimensions()
	 */
	@Override
	public TypeDimensions getDimensions() {
		return getCommand1().getDimensions();
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#getType()
	 */
	@Override
	public Type getType() {
		return Type.ARRAY;
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return new StringBuilder("(").append(getCommand1()).append("/")
				.append(getCommand2()).append(")").toString();
	}

}
