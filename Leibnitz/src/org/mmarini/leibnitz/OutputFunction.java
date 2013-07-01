/**
 * 
 */
package org.mmarini.leibnitz;

import org.mmarini.leibnitz.parser.FunctionDefinition;

/**
 * @author US00852
 * 
 */
public class OutputFunction {
	private String label;
	private FunctionDefinition definition;

	/**
	 * 
	 */
	public OutputFunction() {
	}

	/**
	 * @param label
	 * @param definition
	 */
	public OutputFunction(String label, FunctionDefinition definition) {
		this.label = label;
		this.definition = definition;
	}

	/**
	 * @return the definition
	 */
	public FunctionDefinition getDefinition() {
		return definition;
	}

	/**
	 * @return the label
	 */
	public String getLabel() {
		return label;
	}

	/**
	 * @param definition
	 *            the definition to set
	 */
	public void setDefinition(FunctionDefinition definition) {
		this.definition = definition;
	}

	/**
	 * @param label
	 *            the label to set
	 */
	public void setLabel(String label) {
		this.label = label;
	}

}
