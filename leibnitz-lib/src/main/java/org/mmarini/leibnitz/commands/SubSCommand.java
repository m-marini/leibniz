/**
 * 
 */
package org.mmarini.leibnitz.commands;

/**
 * @author US00852
 * 
 */
public class SubSCommand extends AbstractBinaryCommand {

	/**
	 * 
	 * @param a
	 * @param b
	 */
	public SubSCommand(Command a, Command b) {
		super(a, b);
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#apply(org.mmarini.leibnitz.commands
	 *      .CommandContext)
	 */
	@Override
	public void apply(CommandContext context) {
		getCommand1().apply(context);
		double a = context.getScalar();
		getCommand2().apply(context);
		double b = context.getScalar();
		context.setScalar(a - b);
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
		return new StringBuilder("(").append(getCommand1()).append("-")
				.append(getCommand2()).append(")").toString();
	}
}
