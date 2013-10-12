/**
 * 
 */
package org.mmarini.leibnitz.commands;

import org.mmarini.leibnitz.Quaternion;

/**
 * @author us00852
 * 
 */
public class VariableQCommand extends AbstractVariableCommand {
	private Quaternion value;

	/**
	 * 
	 */
	public VariableQCommand(String name) {
		super(name);
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#apply(org.mmarini.leibnitz.commands
	 *      .CommandContext)
	 */
	@Override
	public void apply(CommandContext context) {
		context.setQuaternion(value.clone());
	}

	/**
	 * @see org.mmarini.leibnitz.commands.VariableCommand#init(org.mmarini.leibnitz.commands
	 *      .CommandContext)
	 */
	@Override
	public void init(CommandContext context) {
		getInitFunction().apply(context);
		value = context.getQuaternion();
	}

	/**
	 * @see org.mmarini.leibnitz.commands.VariableCommand#update(org.mmarini.leibnitz.commands
	 *      .CommandContext)
	 */
	@Override
	public void update(CommandContext context) {
		Command updateFunction = getUpdateFunction();
		if (updateFunction != null) {
			updateFunction.apply(context);
			value.setQuaternion(context.getQuaternion());
		}
	}
}
