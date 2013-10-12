/**
 * 
 */
package org.mmarini.leibnitz.commands;

/**
 * @author US00852
 * 
 */
public class DivSCommand extends AbstractBinaryCommand {
	/**
	 * 
	 * @param n
	 * @param d
	 */
	public DivSCommand(Command n, Command d) {
		super(n, d);
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#apply(org.mmarini.leibnitz.commands
	 *      .CommandContext)
	 */
	@Override
	public void apply(CommandContext context) {
		getCommand1().apply(context);
		double n = context.getScalar();
		getCommand2().apply(context);
		double d = context.getScalar();
		context.setScalar(n / d);
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
		return new StringBuilder("(").append(getCommand1()).append("/")
				.append(getCommand2()).append(")").toString();
	}
}
