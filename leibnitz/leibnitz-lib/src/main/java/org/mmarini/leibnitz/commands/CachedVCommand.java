/**
 * 
 */
package org.mmarini.leibnitz.commands;

import org.mmarini.leibnitz.Vector;

/**
 * @author US00852
 * 
 */
public class CachedVCommand extends AbstractCachedCommand {

	private Vector value;

	/**
	 * 
	 */
	public CachedVCommand() {
	}

	public CachedVCommand(final Command function) {
		super(function);
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#apply(org.mmarini.leibnitz.commands
	 *      .CommandContext)
	 */
	@Override
	public void apply(final CommandContext context) {
		if (!isCached()) {
			getCommand().apply(context);
			value = context.getVector();
			setCached(true);
		}
		context.setVector(value.clone());
	}
}
