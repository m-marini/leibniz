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
public class MulAVCommand extends AbstractBinaryCommand {

	private TypeDimensions dimensions;

	/**
	 * 
	 * @param function
	 * @param function2
	 */
	public MulAVCommand(Command function, Command function2) {
		super(function, function2);
		dimensions = new TypeDimensions(function.getDimensions().getRowCount());
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
		Vector b = context.getVector();
		Vector r = new Vector(dimensions.getRowCount());
		r.multiply(a, b);
		context.setVector(r);
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
		return Type.VECTOR;
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
