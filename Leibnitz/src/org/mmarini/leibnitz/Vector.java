/**
 * 
 */
package org.mmarini.leibnitz;

import java.util.Arrays;

/**
 * @author US00852
 * 
 */
public class Vector implements Cloneable {
	private double[] values;

	/**
	 * 
	 * @param dimension
	 */
	public Vector(int dimension) {
		values = new double[dimension];
	}

	/**
	 * 
	 * @param vector
	 */
	public Vector(Vector vector) {
		values = Arrays.copyOf(vector.values, vector.values.length);
	}

	/**
	 * 
	 * @param a
	 */
	public void add(Vector a) {
		adjustSize(a.getDimension());
		double[] v = values;
		double[] av = a.values;
		int n = v.length;
		for (int i = 0; i < n; ++i)
			v[i] += av[i];
	}

	/**
	 * 
	 * @param n
	 */
	private void adjustSize(int n) {
		if (values.length < n)
			values = Arrays.copyOf(values, n);
	}

	/**
	 * @see java.lang.Object#clone()
	 */
	@Override
	public Vector clone() {
		return new Vector(this);
	}

	/**
	 * @see java.lang.Object#equals(java.lang.Object)
	 */
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Vector other = (Vector) obj;
		if (!Arrays.equals(values, other.values))
			return false;
		return true;
	}

	/**
	 * 
	 * @return
	 */
	public int getDimension() {
		return values.length;
	}

	/**
	 * 
	 * @return
	 */
	public double getModulus() {
		return Math.sqrt(getTrace());
	}

	/**
	 * 
	 * @return
	 */
	public double getTrace() {
		double trace = 0;
		for (double x : values) {
			trace += x * x;
		}
		return trace;
	}

	/**
	 * 
	 * @param index
	 * @return
	 */
	public double getValue(int index) {
		return values[index];
	}

	/**
	 * @return the values
	 */
	public double[] getValues() {
		return values;
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + Arrays.hashCode(values);
		return result;
	}

	/**
	 * 
	 */
	public void inverse() {
		double[] v = values;
		int n = v.length;
		for (int i = 0; i < n; ++i)
			v[i] = -v[i];
	}

	/**
	 * 
	 * @param array
	 * @param vector
	 */
	public void multiply(Array array, Vector vector) {
		double[][] a = array.getValues();
		int n = a.length;
		int m = a[0].length;
		double[] r = values;
		double[] v = vector.values;
		for (int i = 0; i < n; ++i) {
			double t = 0;
			for (int j = 0; j < m; ++j)
				t += a[i][j] * v[j];
			r[i] = t;
		}
	}

	/**
	 * 
	 */
	public void normalize() {
		double mod = getModulus();
		if (mod > 0)
			scale(1 / mod);
	}

	/**
	 * 
	 * @param v2
	 * @return
	 */
	public double scalar(Vector v2) {
		double[] a = this.values;
		double[] b = v2.values;
		int n = a.length;
		double s = 0;
		for (int i = 0; i < n; ++i)
			s += a[i] * b[i];
		return s;
	}

	/**
	 * 
	 * @param scale
	 */
	public void scale(double scale) {
		double[] values = this.values;
		int n = values.length;
		for (int i = 0; i < n; ++i)
			values[i] *= scale;
	}

	/**
	 * 
	 * @param idx
	 * @param value
	 */
	public void setValues(int idx, double value) {
		values[idx] = value;
	}

	/**
	 * 
	 * @param vector
	 */
	public void setVector(Vector vector) {
		System.arraycopy(vector.values, 0, values, 0,
				Math.min(values.length, vector.getDimension()));
	}

	/**
	 * 
	 * @param v2
	 */
	public void subtract(Vector v2) {
		adjustSize(v2.getDimension());
		double[] v = values;
		double[] av = v2.values;
		int n = v.length;
		for (int i = 0; i < n; ++i)
			v[i] -= av[i];
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return Arrays.toString(values);
	}
}
