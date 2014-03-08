/**
EvaluationContext * $Id: FunctionGenerator.java,v 1.3.6.1 2012/07/26 17:31:21 marco Exp $
 */
package org.mmarini.leibnitz;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mmarini.leibnitz.commands.Command;
import org.mmarini.leibnitz.commands.Command.Type;
import org.mmarini.leibnitz.commands.VariableCommand;
import org.mmarini.leibnitz.commands.VariableSCommand;
import org.mmarini.leibnitz.parser.FunctionParserException;

/**
 * The class implements a function generator.
 * <p>
 * The generation happens computing the required output values and then updating
 * the state variables by applying the updating functions.
 * </p>
 * 
 * @author US00852
 * 
 */
public class FunctionGenerator {
	private final CommandProcessor commandProcessor;
	private final Map<String, Command> functions;
	private final List<VariableCommand> variables;
	private Map<String, VariableCommand> variableTable = new HashMap<String, VariableCommand>();

	/**
	 * 
	 */
	public FunctionGenerator() {
		commandProcessor = new CommandProcessor();
		functions = new HashMap<String, Command>();
		variables = new ArrayList<VariableCommand>();
		variableTable = new HashMap<String, VariableCommand>();
	}

	/**
	 * 
	 * @param id
	 * @param function
	 */
	public void add(final String id, final Command function) {
		functions.put(id, function);
	}

	/**
	 * 
	 * @param id
	 * @param variable
	 */
	public void add(final String id, final VariableCommand variable) {
		variables.add(variable);
		variableTable.put(id, variable);
		functions.put(id, variable);
	}

	/**
	 * Apply the update to the state variables.
	 */
	public void apply() {
		for (final VariableCommand v : variables) {
			v.update(commandProcessor);
		}
		resetCache();
	}

	/**
	 * 
	 * @param id
	 * @return
	 * @throws FunctionParserException
	 */
	public Array getArray(final String id) throws FunctionParserException {
		final Command cmd = getFunction(id);
		if (cmd.getType() != Type.ARRAY)
			throw new FunctionParserException("check for type " + cmd.getType());
		cmd.apply(commandProcessor);
		return commandProcessor.getArray();
	}

	/**
	 * 
	 * @param id
	 * @return
	 */
	public Command getFunction(final String id) {
		return functions.get(id);
	}

	/**
	 * 
	 * @param id
	 * @return
	 * @throws FunctionParserException
	 */
	public Quaternion getQuaternion(final String id) throws FunctionParserException {
		final Command cmd = getFunction(id);
		if (cmd.getType() != Type.QUATERNION)
			throw new FunctionParserException("check for type " + cmd.getType());
		cmd.apply(commandProcessor);
		return commandProcessor.getQuaternion();
	}

	/**
	 * 
	 * @param id
	 * @return
	 * @throws FunctionParserException
	 */
	public double getScalar(final String id) throws FunctionParserException {
		final Command cmd = getFunction(id);
		if (cmd.getType() != Type.SCALAR)
			throw new FunctionParserException("check for type " + cmd.getType());
		cmd.apply(commandProcessor);
		return commandProcessor.getScalar();
	}

	/**
	 * 
	 * @param id
	 * @return
	 */
	public VariableCommand getVariable(final String id) {
		return variableTable.get(id);
	}

	/**
	 * 
	 * @param id
	 * @return
	 * @throws FunctionParserException
	 */
	public Vector getVector(final String id) throws FunctionParserException {
		final Command cmd = getFunction(id);
		if (cmd.getType() != Type.VECTOR)
			throw new FunctionParserException("check for type " + cmd.getType());
		cmd.apply(commandProcessor);
		return commandProcessor.getVector();
	}

	/**
	 * 
	 */
	public void init() {
		for (final VariableCommand v : variables)
			v.init(commandProcessor);
	}

	/**
	 * 
	 */
	private void resetCache() {
		for (final Command f : functions.values())
			f.reset();
	}

	/**
	 * 
	 * @param id
	 * @param value
	 * @throws FunctionParserException
	 */
	public void setVariable(final String id, final double value)
			throws FunctionParserException {
		final VariableCommand var = variableTable.get(id);
		if (var == null)
			throw new FunctionParserException("variable \"" + id
					+ "\" not found");
		final Type type = var.getType();
		if (type != Type.SCALAR)
			throw new FunctionParserException("check for type " + type);
		((VariableSCommand) var).setValue(value);
	}
}
