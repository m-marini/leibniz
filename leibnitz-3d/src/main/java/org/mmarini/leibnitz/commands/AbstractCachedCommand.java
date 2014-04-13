/**
 * 
 */
package org.mmarini.leibnitz.commands;

/**
 * @author US00852
 * 
 */
public abstract class AbstractCachedCommand extends AbstractUnaryCommand {

	/**
	 * 
	 * @param command
	 * @return
	 */
	public static AbstractCachedCommand create(final Command command) {
		switch (command.getType()) {
		case SCALAR:
			return new CachedSCommand(command);
		case QUATERNION:
			return new CachedQCommand(command);
		case VECTOR:
			return new CachedVCommand(command);
		case ARRAY:
			return new CachedACommand(command);
		default:
			break;
		}
		return null;
	}

	private boolean cached;

	/**
	 * 
	 */
	protected AbstractCachedCommand() {
	}

	/**
	 * 
	 * @param function
	 */
	protected AbstractCachedCommand(final Command function) {
		super(function);
	}

	/**
	 * @see org.mmarini.leibnitz.commands.AbstractUnaryCommand#getDimensions()
	 */
	@Override
	public TypeDimensions getDimensions() {
		return getCommand().getDimensions();
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#getType()
	 */
	@Override
	public Type getType() {
		return getCommand().getType();
	}

	/**
	 * @return the cached
	 */
	protected boolean isCached() {
		return cached;
	}

	/**
	 * 
	 */
	@Override
	public void reset() {
		cached = false;
		super.reset();
	}

	/**
	 * @param cached
	 *            the cached to set
	 */
	protected void setCached(final boolean cached) {
		this.cached = cached;
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return String.valueOf(getCommand());
	}
}
