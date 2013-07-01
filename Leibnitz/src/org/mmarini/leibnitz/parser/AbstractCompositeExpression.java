/**
 * 
 */
package org.mmarini.leibnitz.parser;

import java.util.ArrayList;
import java.util.List;

/**
 * @author US00852
 * 
 */
public abstract class AbstractCompositeExpression extends AbstractExpression {
	private List<AbstractExpression> expressions;

	/**
	 * 
	 * @param name
	 */
	protected AbstractCompositeExpression(String name) {
		super(name);
		expressions = new ArrayList<>();
	}

	/**
	 * 
	 * @param expressions
	 */
	public void add(AbstractExpression expression) {
		expressions.add(expression);
	}

	/**
	 * 
	 * @return
	 */
	public List<AbstractExpression> getExpressions() {
		return expressions;
	}

}
