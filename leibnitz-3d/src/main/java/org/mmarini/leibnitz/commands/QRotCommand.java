/**
 * 
 */
package org.mmarini.leibnitz.commands;

import org.mmarini.leibnitz.Quaternion;
import org.mmarini.leibnitz.Vector;

/**
 * @author Marco
 * 
 */
public class QRotCommand extends AbstractUnaryCommand {

	/**
	 * 
	 */
	public QRotCommand() {
	}

	/**
	 * @param command
	 */
	public QRotCommand(final Command command) {
		super(command);
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#apply(org.mmarini.leibnitz.commands
	 *      .CommandContext)
	 */
	@Override
	public void apply(final CommandContext context) {
		getCommand().apply(context);
		final Vector v = context.getVector();
		context.setQuaternion(new Quaternion(v));
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
		return new StringBuilder("(qrot ").append(getCommand()).append(")")
				.toString();
	}
}
