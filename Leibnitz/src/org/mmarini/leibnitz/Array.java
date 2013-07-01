/**
 * 
 */
package org.mmarini.leibnitz;

import java.util.Arrays;

/**
 * @author US00852
 * 
 */
public class Array implements Cloneable {
	private double[][] values;

	/**
	 * 
	 * @param array
	 */
	public Array(Array array) {
		setArray(array);
	}

	/**
	 * 
	 * @param n
	 */
	public Array(int n, int m) {
		values = new double[n][m];
	}

	/**
	 * 
	 * @param v
	 */
	public Array(Vector v) {
		values = new double[1][];
		values[0] = Arrays.copyOf(v.getValues(), v.getDimension());
	}

	/**
	 * 
	 * @param a
	 */
	public void add(Array a) {
		double[][] v = values;
		double[][] av = a.values;
		int n = v.length;
		int m = v[0].length;
		for (int i = 0; i < n; ++i) {
			double[] rv = v[i];
			double[] rav = av[i];
			for (int j = 0; j < m; ++j) {
				rv[j] += rav[j];
			}
		}
	}

	/**
	 * 
	 * @param array
	 */
	public void append(Array array) {
		int n = values.length;
		int m = array.values.length;
		double[][] a = new double[n + m][];
		int k = values[0].length;
		System.arraycopy(values, 0, a, 0, n);
		for (int i = 0; i < m; ++i)
			a[i + n] = Arrays.copyOf(array.values[i], k);
		values = a;
	}

	/**
	 * 
	 * @param v
	 */
	public void append(Vector v) {
		int n = values.length;
		double[][] a = new double[n + 1][];
		System.arraycopy(values, 0, a, 0, n);
		a[n] = Arrays.copyOf(v.getValues(), v.getDimension());
		values = a;
	}

	/**
	 * @see java.lang.Object#clone()
	 */
	@Override
	public Array clone() {
		return new Array(this);
	}

	/**
	 * 
	 */
	public double getDeterminer() {
		int n = values.length;
		double[][] a = new double[n][];
		for (int i = 0; i < n; ++i)
			a[i] = Arrays.copyOf(values[i], n);
		return reduceLower(a);
	}

	/**
	 * 
	 * @return
	 */
	public int getRowCount() {
		return values.length;
	}

	/**
	 * 
	 * @return
	 */
	public double getTrace() {
		double trace = 0;
		double[][] v = values;
		int n = v.length;
		for (int i = 0; i < n; ++i) {
			trace += v[i][i];
		}
		return trace;
	}

	/**
	 * 
	 * @param i
	 * @param j
	 * @return
	 */
	public double getValue(int i, int j) {
		return values[i][j];
	}

	/**
	 * @return the values
	 */
	public double[][] getValues() {
		return values;
	}

	/**
	 * 
	 */
	public void inverse() {
		double[][] a = values;
		int n = a.length;
		int m = n * 2;
		for (int i = 0; i < n; ++i) {
			a[i] = Arrays.copyOf(a[i], m);
			a[i][i + n] = 1.;
		}
		if (reduceLower(values) != 0.)
			reduceUpper();
		for (int i = 0; i < n; ++i)
			a[i] = Arrays.copyOfRange(a[i], n, m);
	}

	/**
	 * 
	 * @param a
	 */
	public void multiply(Array a, Array b) {
		double[][] av = a.values;
		double[][] bv = b.values;
		double[][] r = values;
		int n = av.length;
		int p = av[0].length;
		int m = bv[0].length;
		for (int i = 0; i < n; ++i) {
			for (int j = 0; j < m; ++j) {
				double t = 0;
				for (int k = 0; k < p; ++k) {
					t += av[i][k] * bv[k][j];
				}
				r[i][j] = t;
			}
		}
	}

	/**
	 * 
	 */
	public void negate() {
		double[][] v = values;
		int n = v.length;
		for (int i = 0; i < n; ++i) {
			double[] rv = v[i];
			int m = rv.length;
			for (int j = 0; j < m; ++j) {
				rv[j] = -rv[j];
			}
		}
	}

	/**
	 *
	 */
	private double reduceLower(double[][] a) {
		int n = a.length;
		int m = a[0].length;
		double det = 1;
		for (int k = 0; k < n; ++k) {
			if (k < n - 1) {
				/*
				 * Find and swap largest pivot
				 */
				int i_max = k;
				double max = Math.abs(a[k][k]);
				for (int i = k + 1; i < n; ++i) {
					double v = Math.abs(a[i][k]);
					if (v > max) {
						i_max = i;
						max = v;
					}
				}
				if (k != i_max) {
					double[] t = a[i_max];
					a[i_max] = a[k];
					a[k] = t;
					det = -det;
				}
			}
			double pivot = a[k][k];
			if (pivot == 0.) {
				for (int i = 0; i < n; ++i)
					Arrays.fill(a[i], Double.NaN);
				return 0.;
			}
			for (int i = k + 1; i < n; ++i) {
				if (a[i][k] != 0) {
					double s = a[i][k] / pivot;
					for (int j = k + 1; j < m; ++j)
						a[i][j] -= a[k][j] * s;
					a[i][k] = 0;
					det *= s;
				}
			}
			det *= pivot;
		}
		return det;
	}

	/**
	 *
	 */
	private void reduceUpper() {
		double[][] a = values;
		int n = a.length;
		int m = a[0].length;
		for (int k = n - 1; k >= 0; --k) {
			double pivot = a[k][k];
			for (int i = 0; i < k; ++i) {
				if (a[i][k] != 0) {
					double s = a[i][k] / pivot;
					for (int j = i; j < m; ++j)
						if (j == k)
							a[i][j] = 0;
						else
							a[i][j] -= a[k][j] * s;
				}
			}
			for (int i = n; i < m; ++i)
				a[k][i] /= pivot;
			a[k][k] = 1;
		}
	}

	/**
	 * 
	 * @param scale
	 */
	public void scale(double scale) {
		double[][] v = values;
		int n = v.length;
		for (int i = 0; i < n; ++i) {
			double[] rv = v[i];
			int m = rv.length;
			for (int j = 0; j < m; ++j) {
				rv[j] *= scale;
			}
		}
	}

	/**
	 * 
	 * @param array
	 */
	public void setArray(Array array) {
		double[][] a = array.values;
		int n = a.length;
		values = new double[n][];
		for (int i = 0; i < n; ++i) {
			double[] r = a[i];
			values[i] = Arrays.copyOf(r, r.length);
		}
	}

	/**
	 * 
	 */
	public void setIdentity() {
		double[][] v = values;
		int n = v.length;
		for (int i = 0; i < n; ++i) {
			double[] rv = v[i];
			int m = rv.length;
			for (int j = 0; j < m; ++j) {
				if (i == j)
					rv[j] = 1;
				else
					rv[j] = 0;
			}
		}
	}

	/**
	 * 
	 * @param i
	 * @param j
	 * @param value
	 */
	public void setValues(int i, int j, double value) {
		values[i][j] = value;
	}

	/**
	 * 
	 * @param array
	 */
	public void subtract(Array array) {
		double[][] v = values;
		double[][] av = array.values;
		int n = v.length;
		for (int i = 0; i < n; ++i) {
			double[] rv = v[i];
			double[] rav = av[i];
			int m = rv.length;
			for (int j = 0; j < m; ++j) {
				rv[j] -= rav[j];
			}
		}
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		StringBuilder bfr = new StringBuilder();
		bfr.append("[");
		boolean next = false;
		for (double[] r : values) {
			if (next)
				bfr.append(";");
			else
				next = true;
			bfr.append(Arrays.toString(r));
		}
		bfr.append("]");
		return bfr.toString();
	}

	/**
	 * 
	 */
	public void transpose() {
		double[][] v = values;
		int n = v.length;
		int m = v[0].length;
		if (n == m) {
			for (int i = 0; i < n; ++i) {
				for (int j = 0; j < i; ++j) {
					double t = v[i][j];
					v[i][j] = v[j][i];
					v[j][i] = t;
				}
			}
		} else {
			double r[][] = new double[m][n];
			for (int i = 0; i < n; ++i)
				for (int j = 0; j < m; ++j)
					r[j][i] = v[i][j];
			values = r;
		}
	}
}
