/**
 * 
 */
package org.mmarini.leibnitz.commands;

/**
 * @author US00852
 * 
 */
public class ModuleVCommand extends AbstractUnaryCommand {

	/**
	 * 
	 * @param function
	 */
	public ModuleVCommand(Command function) {
		super(function);
	}

	/**
	 * @see org.mmarini.leibnitz.function.old.Function#apply(org.mmarini.leibnitz.function.old.EvaluationContext)
	 */
	@Override
	public void apply(CommandContext context) {
		getCommand().apply(context);
		context.setScalar(context.getVector().getModulus());
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#getType()
	 */
	@Override
	public Type getType() {
		return Type.SCALAR;
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return new StringBuilder("|").append(getCommand()).append("|")
				.toString();
	}
}
