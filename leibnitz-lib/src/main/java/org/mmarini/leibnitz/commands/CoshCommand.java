/**
 * 
 */
package org.mmarini.leibnitz.commands;

/**
 * @author US00852
 * 
 */
public class CoshCommand extends AbstractUnaryCommand {

	/**
	 *
	 */
	public CoshCommand() {
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#apply(org.mmarini.leibnitz.commands
	 *      .CommandContext)
	 */
	@Override
	public void apply(CommandContext context) {
		getCommand().apply(context);
		context.setScalar(Math.cosh(context.getScalar()));
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
		return new StringBuilder("(cosh ").append(getCommand()).append(")")
				.toString();
	}
}
