/**
 * 
 */
package org.mmarini.leibnitz.commands;

import org.mmarini.leibnitz.Vector;

/**
 * @author US00852
 * 
 */
public class SphericalCommand extends AbstractUnaryCommand {

	/**
	 * 
	 */
	public SphericalCommand() {
	}

	/**
	 * @param function
	 */
	public SphericalCommand(final Command function) {
		super(function);
	}

	@Override
	public void apply(final CommandContext context) {
		getCommand().apply(context);
		final Vector v = context.getVector();
		final double r = v.getValue(0);
		final double theta = v.getValue(1);
		final double phi = v.getValue(2);
		final double st = Math.sin(theta);
		v.setValues(0, r * Math.cos(phi) * st);
		v.setValues(1, r * Math.sin(phi) * st);
		v.setValues(2, r * Math.cos(theta));
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
	 * @see org.mmarini.leibnitz.commands.Command#getType()
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
		return new StringBuilder("(sphere ").append(getCommand()).append(")")
				.toString();
	}

}
