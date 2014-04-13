/**
 * 
 */
package org.mmarini.leibnitz.commands;

import org.mmarini.leibnitz.Array;

/**
 * @author US00852
 * 
 */
public class AddACommand extends AbstractBinaryCommand {

	/**
	 * 
	 * @param function1
	 * @param function2
	 */
	public AddACommand(final Command function1, final Command function2) {
		super(function1, function2);
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#apply(org.mmarini.leibnitz.commands
	 *      .CommandContext)
	 */
	@Override
	public void apply(final CommandContext context) {
		getCommand1().apply(context);
		final Array a1 = context.getArray();
		getCommand2().apply(context);
		final Array a2 = context.getArray();
		a1.add(a2);
		context.setArray(a1);
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
		return new StringBuilder("(").append(getCommand1()).append("+")
				.append(getCommand2()).append(")").toString();
	}
}