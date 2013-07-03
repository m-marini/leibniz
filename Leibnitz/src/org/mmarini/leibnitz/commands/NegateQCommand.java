/**
 * 
 */
package org.mmarini.leibnitz.commands;

import org.mmarini.leibnitz.Quaternion;

/**
 * @author US00852
 * 
 */
public class NegateQCommand extends AbstractUnaryCommand {

	/**
	 * 
	 * @param function
	 */
	public NegateQCommand(Command function) {
		super(function);
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#apply(org.mmarini.leibnitz.commands
	 *      .CommandContext)
	 */
	@Override
	public void apply(CommandContext context) {
		getCommand().apply(context);
		Quaternion q = context.getQuaternion();
		q.inverse();
		context.setQuaternion(q);
	}

	/**
	 * @see org.mmarini.leibnitz.commands.AbstractUnaryCommand#getDimensions()
	 */
	@Override
	public TypeDimensions getDimensions() {
		return getCommand().getDimensions();
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
		return new StringBuilder("(-").append(getCommand()).append(")")
				.toString();
	}
}
