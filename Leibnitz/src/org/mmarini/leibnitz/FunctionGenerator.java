/**
 * $Id: FunctionGenerator.java,v 1.3 2012/07/21 19:01:21 marco Exp $
 */
package org.mmarini.leibnitz;

import java.util.ArrayList;
import java.util.List;

import org.mmarini.leibnitz.function.EvaluationContext;
import org.mmarini.leibnitz.function.Function;
import org.mmarini.leibnitz.parser.FunctionDefinition;

/**
 * <pre>
 * Y(n) + F(x, Y, Y(1), ..., Y(n-1)) = 0
 * Y(n) = -F(x, Y, Y(1), ..., Y(n-1))
 * </pre>
 * 
 * Example
 * 
 * <pre>
 * Y(2) + 10 Y(1) + 500 Y = 0
 * F(x, Y, Y(1)) = 10 Y(1) + 500 Y
 * </pre>
 * 
 * 
 * @author US00852
 * 
 */
public class FunctionGenerator implements EvaluationContext {

	private Function function;
	private Vector[] variable;
	private double dt;
	private double t;
	private double scalar;
	private Vector vector;
	private double t1;
	private Array array;
	private List<OutputFunction> output;

	/**
	 * 
	 */
	public FunctionGenerator() {
		variable = new Vector[1];
		output = new ArrayList<>();
	}

	/**
	 * 
	 * @param label
	 * @param functionResult
	 */
	public void addOutput(String label, FunctionDefinition functionResult) {
		output.add(new OutputFunction(label, functionResult));
	}

	/**
	 * 
	 */
	public void apply() {
		Vector[] x = this.variable;
		double dt = this.dt;
		t += dt;
		int n = x[0].getDimension();
		Vector tmp = new Vector(n);
		for (int i = x.length - 2; i >= 0; --i) {
			tmp.setVector(x[i + 1]);
			tmp.scale(dt);
			x[i].add(tmp);
		}
	}

	/**
	 * 
	 * @param dt
	 */
	public void compute() {
		function.apply(this);
		vector.inverse();
		variable[variable.length - 1].setVector(vector);
	}

	/**
	 * @see org.mmarini.leibnitz.function.EvaluationContext#getArray()
	 */
	@Override
	public Array getArray() {
		return array;
	}

	/**
	 * 
	 * @return
	 */
	public int getOrder() {
		return variable.length;
	}

	/**
	 * @return the output
	 */
	public List<OutputFunction> getOutput() {
		return output;
	}

	/**
	 * @return the scalar
	 */
	@Override
	public double getScalar() {
		return scalar;
	}

	/**
	 * 
	 * @return
	 */
	public double getT() {
		return t;
	}

	/**
	 * @return the variable
	 */
	public Vector[] getVariable() {
		return variable;
	}

	/**
	 * @return the vector
	 */
	@Override
	public Vector getVector() {
		return vector;
	}

	/**
	 * @return the x
	 */
	public Vector[] getX() {
		return variable;
	}

	/**
	 * 
	 * @return
	 */
	public boolean isCompleted() {
		return t > t1;
	}

	/**
	 * @see org.mmarini.leibnitz.function.EvaluationContext#setArray(org.mmarini.
	 *      leibnitz.Array)
	 */
	@Override
	public void setArray(Array a1) {
		array = a1;
	}

	/**
	 * @param dt
	 *            the dt to set
	 */
	public void setDt(double dt) {
		this.dt = dt;
	}

	/**
	 * 
	 * @param function
	 * @throws FunctionException
	 */
	public void setFunction(Function function) {
		this.function = function;
	}

	/**
	 * @see org.mmarini.leibnitz.function.EvaluationContext#setParameter(int)
	 */
	@Override
	public void setParameter(int order) {
		vector = variable[order].clone();
	}

	/**
	 * 
	 * @param order
	 * @param index
	 * @param value
	 */
	public void setParameter(int order, Vector v) {
		variable[order].setVector(v);
	}

	/**
	 * 
	 * @param order
	 * @param value
	 */
	public void setQ(int order, Vector value) {
		variable[order].setVector(value);
	}

	/**
	 * @param scalar
	 *            the scalar to set
	 */
	@Override
	public void setScalar(double scalar) {
		this.scalar = scalar;
	}

	/**
	 * @see org.mmarini.leibnitz.function.EvaluationContext#setT()
	 */
	@Override
	public void setT() {
		scalar = t;
	}

	/**
	 * @param t
	 *            the t to set
	 */
	public void setT(double t) {
		this.t = t;
	}

	/**
	 * 
	 * @param t1
	 */
	public void setT1(double t1) {
		this.t1 = t1;
	}

	/**
	 * 
	 * @param order
	 */
	public void setVariable(int order, int dimension) {
		variable = new Vector[order + 1];
		for (int i = 0; i <= order; ++i)
			variable[i] = new Vector(dimension);
	}

	/**
	 * @param vector
	 *            the vector to set
	 */
	@Override
	public void setVector(Vector vector) {
		this.vector = vector;
	}
}
