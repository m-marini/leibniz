/**
 * 
 */
package org.mmarini.leibnitz.commands;

/**
 * @author us00852
 * 
 */
public interface VariableCommand extends Command {

	/**
	 * 
	 * @param context
	 */
	public void init(CommandContext context);

	/**
	 * 
	 * @param fr
	 */
	public void setUpdateFunction(Command fr);

	/**
	 * 
	 * @param functionGenerator
	 */
	public void update(CommandContext context);

}
