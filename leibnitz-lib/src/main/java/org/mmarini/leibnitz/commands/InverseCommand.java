/**
 * 
 */
package org.mmarini.leibnitz.commands;

import org.mmarini.leibnitz.Array;

/**
 * @author US00852
 * 
 */
public class InverseCommand extends AbstractUnaryCommand {

	/**
	 * @param function
	 */
	public InverseCommand(Command function) {
		super(function);
	}

	@Override
	public void apply(CommandContext context) {
		getCommand().apply(context);
		Array a = context.getArray();
		a.inverse();
		context.setArray(a);
	}

	/**
	 * @see org.mmarini.leibnitz.commands.AbstractUnaryCommand#getDimensions()
	 */
	@Override
	public TypeDimensions getDimensions() {
		return getCommand().getDimensions();
	}

	@Override
	public Type getType() {
		return Type.ARRAY;
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return new StringBuffer("( Inv ").append(getCommand()).append(")")
				.toString();
	}

}
