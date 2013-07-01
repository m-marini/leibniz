package org.mmarini.leibnitz.function;

/**
 * 
 * @author US00852
 * 
 */
public interface Function {
	public static final Function T = new Function() {
		@Override
		public void apply(EvaluationContext context) {
			context.setT();
		}
	};

	/**
	 * 
	 * @param context
	 */
	public abstract void apply(EvaluationContext context);
}
