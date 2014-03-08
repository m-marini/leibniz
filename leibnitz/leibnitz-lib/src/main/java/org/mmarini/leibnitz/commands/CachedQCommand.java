/**
 * 
 */
package org.mmarini.leibnitz.commands;

import org.mmarini.leibnitz.Quaternion;

/**
 * @author US00852
 * 
 */
public class CachedQCommand extends AbstractCachedCommand {

	private Quaternion value;

	/**
	 * 
	 */
	public CachedQCommand() {
	}

	public CachedQCommand(final Command function) {
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
			value = context.getQuaternion();
			setCached(true);
		}
		context.setQuaternion(value.clone());
	}
}
