/**
 * 
 */
package org.mmarini.leibnitz.commands;

import org.mmarini.leibnitz.Array;

/**
 * @author US00852
 * 
 */
public class CachedACommand extends AbstractCachedCommand {
	private Array value;

	/**
	 * 
	 */
	public CachedACommand() {
	}

	public CachedACommand(Command function) {
		super(function);
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#apply(org.mmarini.leibnitz.commands
	 *      .CommandContext)
	 */
	@Override
	public void apply(CommandContext context) {
		if (!isCached()) {
			getCommand().apply(context);
			value = context.getArray();
			setCached(true);
		}
		context.setArray(value.clone());
	}
}
