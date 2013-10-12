/**
 * 
 */
package org.mmarini.leibnitz.commands;

import org.mmarini.leibnitz.Quaternion;

/**
 * @author Marco
 * 
 */
public class AngleCommand extends AbstractUnaryCommand {

	/**
	 * 
	 */
	public AngleCommand() {
	}

	/**
	 * @param command
	 */
	public AngleCommand(Command command) {
		super(command);
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#apply(org.mmarini.leibnitz.commands
	 *      .CommandContext)
	 */
	@Override
	public void apply(CommandContext context) {
		getCommand().apply(context);
		Quaternion q = context.getQuaternion();
		context.setScalar(q.getAngle());
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
		return new StringBuilder("(angle ").append(getCommand()).append(")")
				.toString();
	}
}
