/**
 * 
 */
package org.mmarini.leibnitz.parser;

/**
 * @author US00852
 * 
 */
public class CorpeDefs {
	private final String location;
	private final String rotation;

	/**
	 * @param location
	 * @param rotation
	 */
	public CorpeDefs(final String location, final String rotation) {
		super();
		this.location = location;
		this.rotation = rotation;
	}

	/**
	 * @return the location
	 */
	public String getLocation() {
		return location;
	}

	/**
	 * @return the rotation
	 */
	public String getRotation() {
		return rotation;
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		final StringBuilder builder = new StringBuilder();
		builder.append("CorpeDefs [location=").append(location)
				.append(", rotation=").append(rotation).append("]");
		return builder.toString();
	}
}
