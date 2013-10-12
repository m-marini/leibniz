/**
 * 
 */
package org.mmarini.leibnitz.commands;

/**
 * @author US00852
 * 
 */
public abstract class AbstractUnaryCommand extends AbstractCommand {

	private Command command;
	private boolean resetting;

	/**
	 * 
	 */
	protected AbstractUnaryCommand() {
	}

	/**
	 * @param type
	 */
	protected AbstractUnaryCommand(Command command) {
		this.command = command;
	}

	/**
	 * @return the command
	 */
	protected Command getCommand() {
		return command;
	}

	/**
	 * @see org.mmarini.leibnitz.commands.AbstractCommand#reset()
	 */
	@Override
	public void reset() {
		if (!resetting) {
			resetting = true;
			command.reset();
			resetting = false;
		}
	}

	/**
	 * @param command
	 *            the command to set
	 */
	public void setCommand(Command command) {
		this.command = command;
	}

}
