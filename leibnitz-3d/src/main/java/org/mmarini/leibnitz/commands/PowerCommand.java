/**
 * 
 */
package org.mmarini.leibnitz.commands;

/**
 * @author US00852
 * 
 */
public class PowerCommand extends AbstractBinaryCommand {

	/**
	 * 
	 * @param base
	 * @param exp
	 */
	public PowerCommand(final Command base, final Command exp) {
		super(base, exp);
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#apply(org.mmarini.leibnitz.commands
	 *      .CommandContext)
	 */
	@Override
	public void apply(final CommandContext context) {
		getCommand1().apply(context);
		final double a = context.getScalar();
		getCommand2().apply(context);
		final double b = context.getScalar();
		context.setScalar(Math.pow(a, b));
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
		return new StringBuilder("(").append(getCommand1()).append("^")
				.append(getCommand2()).append(")").toString();
	}
}