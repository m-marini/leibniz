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
	private TypeDimensions dimension;

	/**
	 * @param function1
	 * @param function2
	 */
	public AppendAACommand(Command function1, Command function2) {
		super(function1, function2);
		TypeDimensions dim1 = function1.getDimensions();
		TypeDimensions dim2 = function2.getDimensions();
		dimension = new TypeDimensions(dim1.getRowCount() + dim2.getRowCount(),
				dim1.getColCount());

	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#apply(org.mmarini.leibnitz.commands
	 *      .CommandContext)
	 */
	@Override
	public void apply(CommandContext context) {
		getCommand1().apply(context);
		Array a1 = context.getArray();
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
