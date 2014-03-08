/**
 * 
 */
package org.mmarini.leibnitz.commands;

/**
 * @author US00852
 * 
 */
public abstract class AbstractBinaryCommand extends AbstractCommand {
	private Command command1;
	private Command command2;
	private boolean resetting;

	/**
	 * @param command1
	 * @param command2
	 */
	protected AbstractBinaryCommand(final Command command1, final Command command2) {
		this.command1 = command1;
		this.command2 = command2;
	}

	/**
	 * @return the command1
	 */
	protected Command getCommand1() {
		return command1;
	}

	/**
	 * @return the command2
	 */
	protected Command getCommand2() {
		return command2;
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#reset()
	 */
	@Override
	public void reset() {
		if (!resetting) {
			resetting = true;
			command1.reset();
			command2.reset();
			resetting = false;
		}
	}

	/**
	 * @param command1
	 *            the command1 to set
	 */
	public void setCommand1(final Command command1) {
		this.command1 = command1;
	}

	/**
	 * @param command2
	 *            the command2 to set
	 */
	public void setCommand2(final Command command2) {
		this.command2 = command2;
	}

}
