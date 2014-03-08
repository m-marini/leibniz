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
public class AppendVCommand extends AbstractBinaryCommand {

	private final TypeDimensions dimension;

	/**
	 * @param function1
	 * @param function2
	 */
	public AppendVCommand(final Command function1, final Command function2) {
		super(function1, function2);
		dimension = new TypeDimensions(2, function1.getDimensions()
				.getRowCount());
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#apply(org.mmarini.leibnitz.commands
	 *      .CommandContext)
	 */
	@Override
	public void apply(final CommandContext context) {
		getCommand1().apply(context);
		final Vector a = context.getVector();
		final Array array = new Array(a);
		getCommand2().apply(context);
		final Vector v = context.getVector();
		array.append(v);
		context.setArray(array);
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
		return new StringBuilder().append("(").append(getCommand1())
				.append(";").append(getCommand2()).append(")").toString();
	}
}
