/**
 * 
 */
package org.mmarini.leibnitz.commands;

import org.mmarini.leibnitz.Quaternion;

/**
 * @author US00852
 * 
 */
public class MulQQCommand extends AbstractBinaryCommand {

	/**
	 * 
	 * @param function
	 * @param function2
	 */
	public MulQQCommand(final Command function, final Command function2) {
		super(function, function2);
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#apply(org.mmarini.leibnitz.commands
	 *      .CommandContext)
	 */
	@Override
	public void apply(final CommandContext context) {
		getCommand1().apply(context);
		final Quaternion a = context.getQuaternion();
		getCommand2().apply(context);
		final Quaternion b = context.getQuaternion();
		a.multiply(b);
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
		return new StringBuilder("(").append(getCommand1()).append("*")
				.append(getCommand2()).append(")").toString();
	}
}
