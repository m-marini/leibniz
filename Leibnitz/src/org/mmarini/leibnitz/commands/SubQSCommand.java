/**
 * 
 */
package org.mmarini.leibnitz.commands;

import org.mmarini.leibnitz.Quaternion;

/**
 * @author US00852
 * 
 */
public class SubQSCommand extends AbstractBinaryCommand {

	/**
	 * 
	 * @param cmd1
	 * @param cmd2
	 */
	public SubQSCommand(Command cmd1, Command cmd2) {
		super(cmd1, cmd2);
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#apply(org.mmarini.leibnitz.commands
	 *      .CommandContext)
	 */
	@Override
	public void apply(CommandContext context) {
		getCommand1().apply(context);
		Quaternion q = context.getQuaternion();
		getCommand2().apply(context);
		double s = context.getScalar();
		q.subtract(s);
		context.setQuaternion(q);
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
		return new StringBuilder("(").append(getCommand1()).append("+")
				.append(getCommand2()).append(")").toString();
	}
}
