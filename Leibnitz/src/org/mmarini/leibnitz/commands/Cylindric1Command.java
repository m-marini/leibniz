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
public class Cylindric1Command extends AbstractUnaryCommand {

	/**
	 * 
	 */
	public Cylindric1Command() {
	}

	/**
	 * @param function
	 */
	public Cylindric1Command(Command function) {
		super(function);
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#apply(org.mmarini.leibnitz.commands
	 *      .CommandContext)
	 */
	@Override
	public void apply(CommandContext context) {
		getCommand().apply(context);
		Vector v = context.getVector();
		double r = v.getValue(0);
		double phi = v.getValue(1);
		Array a = new Array(3, 3);
		double sin = Math.sin(phi);
		double cos = Math.cos(phi);
		a.setValues(0, 0, cos);
		a.setValues(0, 1, -r * sin);
		a.setValues(1, 0, sin);
		a.setValues(1, 1, r * cos);
		a.setValues(2, 2, 1);
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
		return new StringBuilder("(cyl1 ").append(getCommand()).append(")")
				.toString();
	}

}
