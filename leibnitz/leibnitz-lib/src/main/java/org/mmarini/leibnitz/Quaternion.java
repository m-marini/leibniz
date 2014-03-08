/**
 * 
 */
package org.mmarini.leibnitz;

/**
 * @author us00852
 * 
 */
public class Quaternion implements Cloneable {
	private double r;
	private double i;
	private double j;
	private double k;

	/**
	 * 
	 */
	public Quaternion() {
		this(0., 0., 0., 0.);
	}

	/**
	 * 
	 * @param r
	 */
	public Quaternion(final double r) {
		this(r, 0., 0., 0.);
	}

	/**
	 * 
	 * @param r
	 * @param i
	 * @param j
	 * @param k
	 */
	public Quaternion(final double r, final double i, final double j, final double k) {
		this.r = r;
		this.i = i;
		this.j = j;
		this.k = k;
	}

	/**
	 * 
	 * @param r
	 * @param v
	 */
	public Quaternion(final double r, final Vector v) {
		this.r = r;
		final int n = v.getDimension();
		i = v.getValue(0);
		if (n > 1)
			j = v.getValue(1);
		if (n > 2)
			k = v.getValue(2);
	}

	/**
	 * 
	 * @param quaternion
	 */
	public Quaternion(final Quaternion quaternion) {
		setQuaternion(quaternion);
	}

	/**
	 * 
	 * @param v
	 */
	public Quaternion(final Vector v) {
		setVector(v);
	}

	/**
	 * 
	 * @param r
	 */
	public void add(final double r) {
		this.r += r;
	}

	/**
	 * 
	 * @param q
	 */
	public void add(final Quaternion q) {
		r += q.r;
		i += q.i;
		j += q.j;
		k += q.k;
	}

	/**
	 * 
	 * @param v
	 */
	public void add(final Vector v) {
		final int n = v.getDimension();
		i += v.getValue(0);
		if (n > 1)
			j += v.getValue(1);
		if (n > 2)
			k += v.getValue(2);
	}

	/**
	 * @see java.lang.Object#clone()
	 */
	@Override
	public Quaternion clone() {
		return new Quaternion(this);
	}

	/**
	 * @see java.lang.Object#equals(java.lang.Object)
	 */
	@Override
	public boolean equals(final Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		final Quaternion other = (Quaternion) obj;
		if (Double.doubleToLongBits(i) != Double.doubleToLongBits(other.i))
			return false;
		if (Double.doubleToLongBits(j) != Double.doubleToLongBits(other.j))
			return false;
		if (Double.doubleToLongBits(k) != Double.doubleToLongBits(other.k))
			return false;
		if (Double.doubleToLongBits(r) != Double.doubleToLongBits(other.r))
			return false;
		return true;
	}

	/**
	 * 
	 * @return
	 */
	public double getAngle() {
		return transformToRotation(null);
	}

	/**
	 * @return the i
	 */
	public double getI() {
		return i;
	}

	/**
	 * @return the j
	 */
	public double getJ() {
		return j;
	}

	/**
	 * @return the k
	 */
	public double getK() {
		return k;
	}

	/**
	 * @return the r
	 */
	public double getR() {
		return r;
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		long temp;
		temp = Double.doubleToLongBits(i);
		result = prime * result + (int) (temp ^ (temp >>> 32));
		temp = Double.doubleToLongBits(j);
		result = prime * result + (int) (temp ^ (temp >>> 32));
		temp = Double.doubleToLongBits(k);
		result = prime * result + (int) (temp ^ (temp >>> 32));
		temp = Double.doubleToLongBits(r);
		result = prime * result + (int) (temp ^ (temp >>> 32));
		return result;
	}

	/**
	 * 
	 */
	public void inverse() {
		r = -r;
	}

	/**
	 * 
	 * @param q
	 */
	public void multiply(final Quaternion q) {
		final double r1 = r;
		final double i1 = i;
		final double j1 = j;
		final double k1 = k;
		final double r2 = q.r;
		final double i2 = q.i;
		final double j2 = q.j;
		final double k2 = q.k;
		r = r1 * r2 - i1 * i2 - j1 * j2 - k1 * k2;
		i = r1 * i2 + i1 * r2 + j1 * k2 - k1 * j2;
		j = r1 * j2 + j1 * r2 + k1 * i2 - i1 * k2;
		k = r1 * k2 + k1 * r2 + i1 * j2 - j1 * i2;
	}

	/**
	 * 
	 * @param scale
	 */
	public void scale(final double scale) {
		r *= scale;
		i *= scale;
		j *= scale;
		k *= scale;
	}

	/**
	 * @param i
	 *            the i to set
	 */
	public void setI(final double i) {
		this.i = i;
	}

	/**
	 * @param j
	 *            the j to set
	 */
	public void setJ(final double j) {
		this.j = j;
	}

	/**
	 * @param k
	 *            the k to set
	 */
	public void setK(final double k) {
		this.k = k;
	}

	/**
	 * 
	 * @param q
	 */
	public void setQuaternion(final Quaternion q) {
		r = q.r;
		i = q.i;
		j = q.j;
		k = q.k;
	}

	/**
	 * @param r
	 *            the r to set
	 */
	public void setR(final double r) {
		this.r = r;
	}

	/**
	 * 
	 * @param v
	 */
	private void setVector(final Vector v) {
		final double x = v.getValue(0);
		final double y = v.getValue(1);
		final double z = v.getValue(2);
		final double len = Math.sqrt(x * x + y * y + z * z);
		if (len >= Double.MIN_VALUE) {
			final double hphi = len / 2.;
			r = Math.cos(hphi);
			final double sa = Math.sin(hphi);
			i = sa * x / len;
			j = sa * y / len;
			k = sa * z / len;
		} else {
			i = j = k = 0.;
			r = 1.;
		}
	}

	/**
	 * 
	 * @param r
	 */
	public void subtract(final double r) {
		this.r -= r;
	}

	/**
	 * 
	 * @param q
	 */
	public void subtract(final Quaternion q) {
		r -= q.r;
		i -= q.i;
		j -= q.j;
		k -= q.k;
	}

	/**
	 * 
	 * @param v
	 */
	public void subtract(final Vector v) {
		final int n = v.getDimension();
		i -= v.getValue(0);
		if (n > 1)
			j -= v.getValue(1);
		if (n > 2)
			k -= v.getValue(2);
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return new StringBuilder().append(r).append("+").append(i)
				.append("*i+").append(j).append("*j+").append(k).append("*k")
				.toString();
	}

	/**
	 * 
	 * @param object
	 * @return
	 */
	private double transformToRotation(final Vector versus) {
		final double ca = r;
		final double sa = Math.sqrt(i * i + j * j + k * k);
		double angle = Math.atan2(sa, ca) * 2;
		while (angle > Math.PI)
			angle -= 2 * Math.PI;
		while (angle < -Math.PI)
			angle += 2 * Math.PI;
		return angle;
	}
}
