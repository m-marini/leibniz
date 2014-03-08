/**
 * 
 */
package org.mmarini.leibnitz.commands;

import org.mmarini.leibnitz.Array;
import org.mmarini.leibnitz.Vector;

/**
 * @author US00852
 * 
 */
public class Spherical1Command extends AbstractUnaryCommand {

	/**
	 * 
	 */
	public Spherical1Command() {
	}

	/**
	 * @param function
	 */
	public Spherical1Command(final Command function) {
		super(function);
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#apply(org.mmarini.leibnitz.commands
	 *      .CommandContext)
	 */
	@Override
	public void apply(final CommandContext context) {
		getCommand().apply(context);
		final Vector v = context.getVector();
		final double r = v.getValue(0);
		final double theta = v.getValue(1);
		final double phi = v.getValue(2);
		final Array a = new Array(3, 3);
		final double sp = Math.sin(phi);
		final double cp = Math.cos(phi);
		final double st = Math.sin(theta);
		final double ct = Math.cos(theta);
		a.setValues(0, 0, st * cp);
		a.setValues(0, 1, r * ct * cp);
		a.setValues(0, 2, -r * st * sp);
		a.setValues(1, 0, st * sp);
		a.setValues(1, 1, r * ct * sp);
		a.setValues(1, 2, r * st * cp);
		a.setValues(2, 0, ct);
		a.setValues(2, 1, -r * st);
		context.setArray(a);
	}

	/**
	 * @see org.mmarini.leibnitz.commands.AbstractUnaryCommand#getDimensions()
	 */
	@Override
	public TypeDimensions getDimensions() {
		return TypeDimensions.ARRAY3D;
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#getType()
	 */
	@Override
	public Type getType() {
		return Type.ARRAY;
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return new StringBuilder("(sphere1 ").append(getCommand()).append(")")
				.toString();
	}

}
