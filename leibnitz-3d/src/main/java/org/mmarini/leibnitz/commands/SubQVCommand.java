/**
 * 
 */
package org.mmarini.leibnitz.commands;

import org.mmarini.leibnitz.Quaternion;
import org.mmarini.leibnitz.Vector;

/**
 * @author US00852
 * 
 */
public class SubQVCommand extends AbstractBinaryCommand {

	/**
	 * 
	 * @param cmd1
	 * @param cmd2
	 */
	public SubQVCommand(final Command cmd1, final Command cmd2) {
		super(cmd1, cmd2);
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#apply(org.mmarini.leibnitz.commands
	 *      .CommandContext)
	 */
	@Override
	public void apply(final CommandContext context) {
		getCommand1().apply(context);
		final Quaternion q = context.getQuaternion();
		getCommand2().apply(context);
		final Vector v = context.getVector();
		q.subtract(v);
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
