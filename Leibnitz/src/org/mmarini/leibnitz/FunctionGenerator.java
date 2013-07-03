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
	private CommandProcessor commandProcessor;
	private Map<String, Command> functions;
	private List<VariableCommand> variables;
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
	public void add(String id, Command function) {
		functions.put(id, function);
	}

	/**
	 * 
	 * @param id
	 * @param variable
	 */
	public void add(String id, VariableCommand variable) {
		variables.add(variable);
		variableTable.put(id, variable);
		functions.put(id, variable);
	}

	/**
	 * Apply the update to the state variables.
	 */
	public void apply() {
		for (VariableCommand v : variables) {
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
	public Array getArray(String id) throws FunctionParserException {
		Command cmd = getFunction(id);
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
	public Command getFunction(String id) {
		return functions.get(id);
	}

	/**
	 * 
	 * @param id
	 * @return
	 * @throws FunctionParserException
	 */
	public Quaternion getQuaternion(String id) throws FunctionParserException {
		Command cmd = getFunction(id);
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
	public double getScalar(String id) throws FunctionParserException {
		Command cmd = getFunction(id);
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
	public VariableCommand getVariable(String id) {
		return variableTable.get(id);
	}

	/**
	 * 
	 * @param id
	 * @return
	 * @throws FunctionParserException
	 */
	public Vector getVector(String id) throws FunctionParserException {
		Command cmd = getFunction(id);
		if (cmd.getType() != Type.VECTOR)
			throw new FunctionParserException("check for type " + cmd.getType());
		cmd.apply(commandProcessor);
		return commandProcessor.getVector();
	}

	/**
	 * 
	 */
	public void init() {
		for (VariableCommand v : variables)
			v.init(commandProcessor);
	}

	/**
	 * 
	 */
	private void resetCache() {
		for (Command f : functions.values())
			f.reset();
	}

	/**
	 * 
	 * @param id
	 * @param value
	 * @throws FunctionParserException
	 */
	public void setVariable(String id, double value)
			throws FunctionParserException {
		VariableCommand var = variableTable.get(id);
		if (var == null)
			throw new FunctionParserException("variable \"" + id
					+ "\" not found");
		Type type = var.getType();
		if (type != Type.SCALAR)
			throw new FunctionParserException("check for type " + type);
		((VariableSCommand) var).setValue(value);
	}
}
