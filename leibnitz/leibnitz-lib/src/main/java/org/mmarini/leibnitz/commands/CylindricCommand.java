/**
 * 
 */
package org.mmarini.leibnitz.commands;

import org.mmarini.leibnitz.Vector;

/**
 * @author US00852
 * 
 */
public class CylindricCommand extends AbstractUnaryCommand {

	/**
	 * 
	 */
	public CylindricCommand() {
	}

	/**
	 * @param function
	 */
	public CylindricCommand(final Command function) {
		super(function);
	}

	/**
	 * 
	 * @param context
	 */
	@Override
	public void apply(final CommandContext context) {
		getCommand().apply(context);
		final Vector v = context.getVector();
		final double r = v.getValue(0);
		final double phi = v.getValue(1);
		v.setValues(0, r * Math.cos(phi));
		v.setValues(1, r * Math.sin(phi));
		context.setVector(v);
	}

	/**
	 * @see org.mmarini.leibnitz.commands.AbstractUnaryCommand#getDimensions()
	 */
	@Override
	public TypeDimensions getDimensions() {
		return getCommand().getDimensions();
	}

	/**
	 * 
	 * @return
	 */
	@Override
	public Type getType() {
		return Type.VECTOR;
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return new StringBuilder("(cyl ").append(getCommand()).append(")")
				.toString();
	}
}
