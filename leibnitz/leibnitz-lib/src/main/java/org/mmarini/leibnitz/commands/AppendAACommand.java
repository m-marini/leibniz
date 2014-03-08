/**
 * 
 */
package org.mmarini.leibnitz.commands;

import org.mmarini.leibnitz.Array;

/**
 * @author US00852
 * 
 */
public class AppendAACommand extends AbstractBinaryCommand {
	private final TypeDimensions dimension;

	/**
	 * @param function1
	 * @param function2
	 */
	public AppendAACommand(final Command function1, final Command function2) {
		super(function1, function2);
		final TypeDimensions dim1 = function1.getDimensions();
		final TypeDimensions dim2 = function2.getDimensions();
		dimension = new TypeDimensions(dim1.getRowCount() + dim2.getRowCount(),
				dim1.getColCount());

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
		a1.append(context.getArray());
		context.setArray(a1);
	}

	/**
	 * @see org.mmarini.leibnitz.commands.AbstractBinaryCommand#getDimensions()
	 */
	@Override
	public TypeDimensions getDimensions() {
		return dimension;
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
		return new StringBuilder("(").append(getCommand1()).append(";")
				.append(getCommand2()).append(")").toString();
	}

}
