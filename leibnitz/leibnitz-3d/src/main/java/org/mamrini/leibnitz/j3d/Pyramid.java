/**
 * 
 */
package org.mamrini.leibnitz.j3d;

import javax.media.j3d.Appearance;
import javax.media.j3d.Geometry;
import javax.media.j3d.Material;
import javax.media.j3d.Shape3D;
import javax.media.j3d.TransformGroup;
import javax.vecmath.Color3f;

import com.sun.j3d.utils.geometry.GeometryInfo;
import com.sun.j3d.utils.geometry.NormalGenerator;

/**
 * @author US00852
 * 
 */
public class Pyramid extends AbstractCorpe implements Corpe {

	private static final float HALF_SIZE = 0.02f;
	private static final float LOWER_HEIGHT = -0.02f;
	private static final float UPPER_HEIGHT = 0.04f;
	private static final float SHININESS = 80f;
	private static final float[] COORDINATES = new float[] { 0f, UPPER_HEIGHT,
			0f, HALF_SIZE, 0f, 0f, 0f, 0f, -HALF_SIZE, -HALF_SIZE, 0f, 0f, 0f,
			0f, HALF_SIZE, 0f, LOWER_HEIGHT, 0f };
	private static final int[] INDEXES = new int[] { 0, 2, 1, 0, 3, 2, 0, 4, 3,
			0, 1, 4, 5, 0, 1, 5, 1, 2, 5, 2, 3, 5, 3, 4, 5, 4, 1 };

	private final Material material;

	/**
	 * 
	 */
	public Pyramid() {
		material = new Material();

		final Color3f objColor = new Color3f(0.0f, 0.0f, 1f);
		final Color3f black = new Color3f();
		final Color3f white = new Color3f(1f, 1f, 1f);

		material.setAmbientColor(objColor);
		material.setEmissiveColor(black);
		material.setDiffuseColor(objColor);
		material.setSpecularColor(white);
		material.setShininess(SHININESS);

		final Appearance appearance = new Appearance();
		appearance.setMaterial(material);

		final Shape3D shape = new Shape3D();
		final Geometry geometry = createGeometry();
		shape.addGeometry(geometry);
		shape.setAppearance(appearance);

		final TransformGroup locationGroup = getLocationGroup();
		locationGroup.addChild(shape);
		addChild(locationGroup);
	}

	/**
	 * 
	 * @return
	 */
	private Geometry createGeometry() {
		final GeometryInfo gi = new GeometryInfo(GeometryInfo.TRIANGLE_ARRAY);
		gi.setCoordinates(COORDINATES);
		gi.setCoordinateIndices(INDEXES);
		final NormalGenerator ng = new NormalGenerator();
		ng.generateNormals(gi);
		return gi.getIndexedGeometryArray(true);
	}

	/**
	 * 
	 * @param color
	 */
	public void setColor(final Color3f color) {
		material.setAmbientColor(color);
		material.setDiffuseColor(color);
	}
}
