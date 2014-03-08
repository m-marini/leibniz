/**
 * 
 */
package org.mmarini.leibnitz.commands;

/**
 * @author us00852
 * 
 */
public class VariableSCommand extends AbstractVariableCommand {

	private double value;

	/**
	 * 
	 */
	public VariableSCommand(final String name) {
		super(name);
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#apply(org.mmarini.leibnitz.commands
	 *      .CommandContext)
	 */
	@Override
	public void apply(final CommandContext context) {
		context.setScalar(value);
	}

	/**
	 * @see org.mmarini.leibnitz.commands.VariableCommand#init(org.mmarini.leibnitz.commands
	 *      .CommandContext)
	 */
	@Override
	public void init(final CommandContext context) {
		getInitFunction().apply(context);
		value = context.getScalar();
	}

	/**
	 * @param value
	 *            the value to set
	 */
	public void setValue(final double value) {
		this.value = value;
	}

	/**
	 * @see org.mmarini.leibnitz.commands.VariableCommand#update(org.mmarini.leibnitz.commands
	 *      .CommandContext)
	 */
	@Override
	public void update(final CommandContext context) {
		final Command updateFunction = getUpdateFunction();
		if (updateFunction != null) {
			updateFunction.apply(context);
			value = context.getScalar();
		}
	}
}
