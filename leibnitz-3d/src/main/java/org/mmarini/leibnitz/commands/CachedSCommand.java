/**
 * 
 */
package org.mmarini.leibnitz.commands;

/**
 * @author US00852
 * 
 */
public class CachedSCommand extends AbstractCachedCommand {
	private double value;

	/**
	 * 
	 */
	public CachedSCommand() {
	}

	/**
	 * 
	 * @param function
	 */
	public CachedSCommand(final Command function) {
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
			value = context.getScalar();
			setCached(true);
		}
		context.setScalar(value);
	}
}
