package org.mmarini.leibnitz.commands;

/**
 * 
 * @author Marco
 * 
 */
public abstract class AbstractCommand implements Command {

	/**
	 * 
	 */
	protected AbstractCommand() {
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#getDimensions()
	 */
	@Override
	public TypeDimensions getDimensions() {
		return null;
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#reset()
	 */
	@Override
	public void reset() {
	}

}