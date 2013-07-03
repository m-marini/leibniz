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

	private TypeDimensions dimension;

	/**
	 * @param function1
	 * @param function2
	 */
	public AppendVCommand(Command function1, Command function2) {
		super(function1, function2);
		dimension = new TypeDimensions(2, function1.getDimensions()
				.getRowCount());
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#apply(org.mmarini.leibnitz.commands
	 *      .CommandContext)
	 */
	@Override
	public void apply(CommandContext context) {
		getCommand1().apply(context);
		Vector a = context.getVector();
		Array array = new Array(a);
		getCommand2().apply(context);
		Vector v = context.getVector();
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
