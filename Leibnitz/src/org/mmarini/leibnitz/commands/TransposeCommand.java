package org.mmarini.leibnitz.commands;

import org.mmarini.leibnitz.Array;

/**
 * 
 * @author US00852
 * 
 */
public class TransposeCommand extends AbstractUnaryCommand {

	private TypeDimensions type;

	/**
	 * 
	 * @param function
	 */
	public TransposeCommand(Command function) {
		super(function);
		TypeDimensions type = function.getDimensions();
		this.type = new TypeDimensions(type.getColCount(), type.getRowCount());
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#apply(org.mmarini.leibnitz.commands
	 *      .CommandContext)
	 */
	@Override
	public void apply(CommandContext context) {
		getCommand().apply(context);
		Array a = context.getArray();
		a.transpose();
		context.setArray(a);
	}

	/**
	 * @see org.mmarini.leibnitz.commands.AbstractUnaryCommand#getDimensions()
	 */
	@Override
	public TypeDimensions getDimensions() {
		return type;
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
		return new StringBuilder("(T ").append(getCommand()).append(")")
				.toString();
	}

}
