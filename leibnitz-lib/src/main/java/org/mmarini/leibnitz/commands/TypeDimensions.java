/**
 * 
 */
package org.mmarini.leibnitz.commands;

/**
 * @author us00852
 * 
 */
public class TypeDimensions {
	public static final TypeDimensions ARRAY3D = new TypeDimensions(3, 3);

	private int rowCount;
	private int colCount;

	/**
	 * 
	 * @param rowCount2
	 */
	public TypeDimensions(int rowCount) {
		this(rowCount, 1);
	}

	/**
	 * @param rowCount
	 * @param colCount
	 */
	public TypeDimensions(int rowCount, int colCount) {
		this.rowCount = rowCount;
		this.colCount = colCount;
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
		TypeDimensions other = (TypeDimensions) obj;
		if (colCount != other.colCount)
			return false;
		if (rowCount != other.rowCount)
			return false;
		return true;
	}

	/**
	 * @return the colCount
	 */
	public int getColCount() {
		return colCount;
	}

	/**
	 * @return the rowCount
	 */
	public int getRowCount() {
		return rowCount;
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + colCount;
		result = prime * result + rowCount;
		return result;
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return new StringBuilder("[").append(rowCount).append(" x ")
				.append(colCount).append("]").toString();
	}

}
