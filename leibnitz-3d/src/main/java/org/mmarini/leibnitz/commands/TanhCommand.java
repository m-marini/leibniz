/**
 * 
 */
package org.mmarini.leibnitz.commands;

/**
 * @author US00852
 * 
 */
public class TanhCommand extends AbstractUnaryCommand {

	/**
	 *
	 */
	public TanhCommand() {
	}

	/**
	 * @see org.mmarini.leibnitz.function.old.Function#apply(org.mmarini.leibnitz.function.old
	 *      .EvaluationContext)
	 */
	@Override
	public void apply(final CommandContext context) {
		getCommand().apply(context);
		context.setScalar(Math.tanh(context.getScalar()));
	}

	/**
	 * @see org.mmarini.leibnitz.commands.Command#getType()
	 */
	@Override
	public Type getType() {
		return Type.SCALAR;
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return new StringBuilder("tanh").append(getCommand()).append(")")
				.toString();
	}
}
