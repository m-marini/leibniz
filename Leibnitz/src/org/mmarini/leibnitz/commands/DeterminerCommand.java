/**
 * 
 */
package org.mmarini.leibnitz.commands;

import org.mmarini.leibnitz.Array;

/**
 * @author US00852
 * 
 */
public class DeterminerCommand extends AbstractUnaryCommand {

	/**
	 * @param function
	 */
	public DeterminerCommand(Command function) {
		super(function);
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#apply(org.mmarini.leibnitz.commands
	 *      .CommandContext)
	 */
	@Override
	public void apply(CommandContext context) {
		getCommand().apply(context);
		Array a = context.getArray();
		context.setScalar(a.getDeterminer());
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#getType()
	 */
	@Override
	public Type getType() {
		return Type.SCALAR;
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return new StringBuffer("(det ").append(getCommand()).append(")")
				.toString();
	}

}
