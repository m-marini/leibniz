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
	public Array(final Array array) {
		setArray(array);
	}

	/**
	 * 
	 * @param n
	 */
	public Array(final int n, final int m) {
		values = new double[n][m];
	}

	/**
	 * 
	 * @param v
	 */
	public Array(final Vector v) {
		values = new double[1][];
		values[0] = Arrays.copyOf(v.getValues(), v.getDimension());
	}

	/**
	 * 
	 * @param a
	 */
	public void add(final Array a) {
		final double[][] v = values;
		final double[][] av = a.values;
		final int n = v.length;
		final int m = v[0].length;
		for (int i = 0; i < n; ++i) {
			final double[] rv = v[i];
			final double[] rav = av[i];
			for (int j = 0; j < m; ++j) {
				rv[j] += rav[j];
			}
		}
	}

	/**
	 * 
	 * @param array
	 */
	public void append(final Array array) {
		final int n = values.length;
		final int m = array.values.length;
		final double[][] a = new double[n + m][];
		final int k = values[0].length;
		System.arraycopy(values, 0, a, 0, n);
		for (int i = 0; i < m; ++i)
			a[i + n] = Arrays.copyOf(array.values[i], k);
		values = a;
	}

	/**
	 * 
	 * @param v
	 */
	public void append(final Vector v) {
		final int n = values.length;
		final double[][] a = new double[n + 1][];
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
	 * @return
	 */
	public int getColCount() {
		return values[0].length;
	}

	/**
	 * 
	 */
	public double getDeterminer() {
		final int n = values.length;
		final double[][] a = new double[n][];
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
		final double[][] v = values;
		final int n = v.length;
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
	public double getValue(final int i, final int j) {
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
		final double[][] a = values;
		final int n = a.length;
		final int m = n * 2;
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
	public void multiply(final Array a, final Array b) {
		final double[][] av = a.values;
		final double[][] bv = b.values;
		final double[][] r = values;
		final int n = av.length;
		final int p = av[0].length;
		final int m = bv[0].length;
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
		final double[][] v = values;
		final int n = v.length;
		for (int i = 0; i < n; ++i) {
			final double[] rv = v[i];
			final int m = rv.length;
			for (int j = 0; j < m; ++j) {
				rv[j] = -rv[j];
			}
		}
	}

	/**
	 *
	 */
	private double reduceLower(final double[][] a) {
		final int n = a.length;
		final int m = a[0].length;
		double det = 1;
		for (int k = 0; k < n; ++k) {
			if (k < n - 1) {
				/*
				 * Find and swap largest pivot
				 */
				int i_max = k;
				double max = Math.abs(a[k][k]);
				for (int i = k + 1; i < n; ++i) {
					final double v = Math.abs(a[i][k]);
					if (v > max) {
						i_max = i;
						max = v;
					}
				}
				if (k != i_max) {
					final double[] t = a[i_max];
					a[i_max] = a[k];
					a[k] = t;
					det = -det;
				}
			}
			final double pivot = a[k][k];
			if (pivot == 0.) {
				for (int i = 0; i < n; ++i)
					Arrays.fill(a[i], Double.NaN);
				return 0.;
			}
			for (int i = k + 1; i < n; ++i) {
				if (a[i][k] != 0) {
					final double s = a[i][k] / pivot;
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
		final double[][] a = values;
		final int n = a.length;
		final int m = a[0].length;
		for (int k = n - 1; k >= 0; --k) {
			final double pivot = a[k][k];
			for (int i = 0; i < k; ++i) {
				if (a[i][k] != 0) {
					final double s = a[i][k] / pivot;
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
	public void scale(final double scale) {
		final double[][] v = values;
		final int n = v.length;
		for (int i = 0; i < n; ++i) {
			final double[] rv = v[i];
			final int m = rv.length;
			for (int j = 0; j < m; ++j) {
				rv[j] *= scale;
			}
		}
	}

	/**
	 * 
	 * @param array
	 */
	public void setArray(final Array array) {
		final double[][] a = array.values;
		final int n = a.length;
		values = new double[n][];
		for (int i = 0; i < n; ++i) {
			final double[] r = a[i];
			values[i] = Arrays.copyOf(r, r.length);
		}
	}

	/**
	 * 
	 */
	public void setIdentity() {
		final double[][] v = values;
		final int n = v.length;
		for (int i = 0; i < n; ++i) {
			final double[] rv = v[i];
			final int m = rv.length;
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
	public void setValues(final int i, final int j, final double value) {
		values[i][j] = value;
	}

	/**
	 * 
	 * @param array
	 */
	public void subtract(final Array array) {
		final double[][] v = values;
		final double[][] av = array.values;
		final int n = v.length;
		for (int i = 0; i < n; ++i) {
			final double[] rv = v[i];
			final double[] rav = av[i];
			final int m = rv.length;
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
		final StringBuilder bfr = new StringBuilder();
		bfr.append("[");
		boolean next = false;
		for (final double[] r : values) {
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
		final double[][] v = values;
		final int n = v.length;
		final int m = v[0].length;
		if (n == m) {
			for (int i = 0; i < n; ++i) {
				for (int j = 0; j < i; ++j) {
					final double t = v[i][j];
					v[i][j] = v[j][i];
					v[j][i] = t;
				}
			}
		} else {
			final double r[][] = new double[m][n];
			for (int i = 0; i < n; ++i)
				for (int j = 0; j < m; ++j)
					r[j][i] = v[i][j];
			values = r;
		}
	}
}
