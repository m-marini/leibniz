/**
 * 
 */
package org.mmarini.leibnitz.commands;

import org.mmarini.leibnitz.Array;
import org.mmarini.leibnitz.Vector;

/**
 * @author US00852
 * 
 */
public class AppendACommand extends AbstractBinaryCommand {
	private final TypeDimensions dimensions;

	/**
	 * @param function1
	 * @param function2
	 */
	public AppendACommand(final Command function1, final Command function2) {
		super(function1, function2);
		final TypeDimensions dim1 = function1.getDimensions();
		dimensions = new TypeDimensions(dim1.getRowCount() + 1,
				dim1.getColCount());
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#apply(org.mmarini.leibnitz.commands
	 *      .CommandContext)
	 */
	@Override
	public void apply(final CommandContext context) {
		getCommand1().apply(context);
		final Array a = context.getArray();
		getCommand2().apply(context);
		final Vector v = context.getVector();
		a.append(v);
		context.setArray(a);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see org.mmarini.leibnitz.commands.AbstractBinaryCommand#getDimensions()
	 */
	@Override
	public TypeDimensions getDimensions() {
		return dimensions;
	}

	@Override
	public Type getType() {
		return Type.ARRAY;
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return new StringBuilder().append("(").append(getCommand1())
				.append(";").append(getCommand2()).append(")").toString();
	}
}
