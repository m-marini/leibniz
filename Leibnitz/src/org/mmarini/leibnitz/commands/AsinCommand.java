/**
 * 
 */
package org.mmarini.leibnitz.commands;

/**
 * @author US00852
 * 
 */
public class AsinCommand extends AbstractUnaryCommand {

	/**
	 */
	public AsinCommand() {
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#apply(org.mmarini.leibnitz.commands
	 *      .CommandContext)
	 */
	@Override
	public void apply(CommandContext context) {
		getCommand().apply(context);
		context.setScalar(Math.asin(context.getScalar()));
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
		return new StringBuilder("(asin ").append(getCommand()).append(")")
				.toString();
	}
}
