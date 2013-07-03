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
public class SubSVCommand extends AbstractBinaryCommand {

	/**
	 * 
	 * @param function
	 * @param function2
	 */
	public SubSVCommand(Command function, Command function2) {
		super(function, function2);
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#apply(org.mmarini.leibnitz.commands
	 *      .CommandContext)
	 */
	@Override
	public void apply(CommandContext context) {
		getCommand1().apply(context);
		double r = context.getScalar();
		getCommand2().apply(context);
		Vector v = context.getVector();
		v.inverse();
		context.setQuaternion(new Quaternion(r, v));
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
