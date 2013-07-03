/**
 * 
 */
package org.mmarini.leibnitz.commands;

import org.mmarini.leibnitz.Quaternion;

/**
 * @author US00852
 * 
 */
public class AddQCommand extends AbstractBinaryCommand {

	/**
	 * 
	 * @param function
	 * @param function2
	 */
	public AddQCommand(Command function, Command function2) {
		super(function, function2);
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#apply(org.mmarini.leibnitz.commands
	 *      .CommandContext)
	 */
	@Override
	public void apply(CommandContext context) {
		getCommand1().apply(context);
		Quaternion v1 = context.getQuaternion();
		getCommand2().apply(context);
		Quaternion v2 = context.getQuaternion();
		v1.add(v2);
		context.setQuaternion(v1);
	}

	/**
	 * @see org.mmarini.leibnitz.commands.AbstractBinaryCommand#getDimensions()
	 */
	@Override
	public TypeDimensions getDimensions() {
		return getCommand1().getDimensions();
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
