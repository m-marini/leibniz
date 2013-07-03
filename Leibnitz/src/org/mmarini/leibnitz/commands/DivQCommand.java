/**
 * 
 */
package org.mmarini.leibnitz.commands;

import org.mmarini.leibnitz.Quaternion;

/**
 * @author US00852
 * 
 */
public class DivQCommand extends AbstractBinaryCommand {
	/**
	 * 
	 * @param n
	 * @param d
	 */
	public DivQCommand(Command n, Command d) {
		super(n, d);
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#apply(org.mmarini.leibnitz.commands
	 *      .CommandContext)
	 */
	@Override
	public void apply(CommandContext context) {
		getCommand1().apply(context);
		Quaternion a = context.getQuaternion();
		getCommand2().apply(context);
		double scale = context.getScalar();
		a.scale(1. / scale);
		context.setQuaternion(a);
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#getType()
	 */
	@Override
	public Type getType() {
		return Type.QUATERNION;
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
