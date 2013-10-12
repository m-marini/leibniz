/**
 * 
 */
package org.mmarini.leibnitz.commands;

import org.mmarini.leibnitz.Array;

/**
 * @author US00852
 * 
 */
public class MulAACommand extends AbstractBinaryCommand {

	private TypeDimensions dimensions;

	/**
	 * 
	 * @param function
	 * @param function2
	 */
	public MulAACommand(Command function, Command function2) {
		super(function, function2);
		dimensions = new TypeDimensions(function.getDimensions().getRowCount(),
				function2.getDimensions().getColCount());
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#apply(org.mmarini.leibnitz.commands
	 *      .CommandContext)
	 */
	@Override
	public void apply(CommandContext context) {
		getCommand1().apply(context);
		Array a = context.getArray();
		getCommand2().apply(context);
		Array b = context.getArray();
		Array m = new Array(dimensions.getRowCount(), dimensions.getColCount());
		m.multiply(a, b);
		context.setArray(m);
	}

	/**
	 * 
	 * @return
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
		return Type.ARRAY;
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return new StringBuilder("(").append(getCommand1()).append("*")
				.append(getCommand2()).append(")").toString();
	}
}
