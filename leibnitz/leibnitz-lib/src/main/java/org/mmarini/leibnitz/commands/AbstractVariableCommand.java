/**
 * 
 */
package org.mmarini.leibnitz.commands;

/**
 * @author us00852
 * 
 */
public abstract class AbstractVariableCommand extends AbstractCommand implements
		VariableCommand {
	/**
	 * 
	 * @param id
	 * @param initCmd
	 * @return
	 */
	public static AbstractVariableCommand create(final String id, final Command initCmd) {
		AbstractVariableCommand var = null;
		switch (initCmd.getType()) {
		case SCALAR:
			var = new VariableSCommand(id);
			break;
		case VECTOR:
			var = new VariableVCommand(id);
			break;
		case QUATERNION:
			var = new VariableQCommand(id);
			break;
		case ARRAY:
			var = new VariableACommand(id);
			break;
		}
		var.setInitFunction(initCmd);
		return var;
	}

	private final String name;
	private Command initFunction;
	private Command updateFunction;

	private boolean resetting;

	/**
	 * 
	 * @param name
	 */
	protected AbstractVariableCommand(final String name) {
		this.name = name;
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#getDimensions()
	 */
	@Override
	public TypeDimensions getDimensions() {
		return initFunction.getDimensions();
	}

	/**
	 * @return the initFunction
	 */
	protected Command getInitFunction() {
		return initFunction;
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#getType()
	 */
	@Override
	public Type getType() {
		return initFunction.getType();
	}

	/**
	 * @return the updateFunction
	 */
	protected Command getUpdateFunction() {
		return updateFunction;
	}

	/**
	 * @see org.mmarini.leibnitz.commands.AbstractCommand#reset()
	 */
	@Override
	public void reset() {
		if (!resetting) {
			resetting = true;
			initFunction.reset();
			if (updateFunction != null)
				updateFunction.reset();
			resetting = false;
		}
	}

	/**
	 * @param initFunction
	 *            the initFunction to set
	 */
	public void setInitFunction(final Command initFunction) {
		this.initFunction = initFunction;
	}

	/**
	 * @param updateFunction
	 *            the updateFunction to set
	 */
	@Override
	public void setUpdateFunction(final Command updateFunction) {
		this.updateFunction = updateFunction;
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return String.valueOf(name);
	}
}
