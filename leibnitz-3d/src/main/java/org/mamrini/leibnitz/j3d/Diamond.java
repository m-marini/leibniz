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
import com.sun.j3d.utils.geometry.Stripifier;

/**
 * @author US00852
 * 
 */
public class Diamond extends AbstractCorpe implements Corpe {

	private static final float HALF_SIZE = 0.02f;
	private static final float LOWER_HEIGHT = -0.02f;
	private static final float UPPER_HEIGHT = 0.04f;
	private static final float SHININESS = 80f;
	private static final float[] COORDINATES = new float[] { 0f, UPPER_HEIGHT,
			0f, HALF_SIZE, 0f, 0f, 0f, 0f, -HALF_SIZE, -HALF_SIZE, 0f, 0f, 0f,
			0f, HALF_SIZE, 0f, LOWER_HEIGHT, 0f };
	private static final int[] INDEXES = new int[] { 0, 1, 2, 0, 2, 3, 0, 3, 4,
			0, 4, 1, 5, 2, 1, 5, 3, 2, 5, 4, 3, 5, 1, 4 };

	private Material material;

	/**
	 * 
	 */
	public Diamond() {
		material = new Material();

		Color3f objColor = new Color3f(0.0f, 0.0f, 1f);
		Color3f black = new Color3f();
		Color3f white = new Color3f(1f, 1f, 1f);

		material.setAmbientColor(objColor);
		material.setEmissiveColor(black);
		material.setDiffuseColor(objColor);
		material.setSpecularColor(white);
		material.setShininess(SHININESS);

		Appearance appearance = new Appearance();
		appearance.setMaterial(material);

		Shape3D shape = new Shape3D();
		Geometry geometry = createGeometry();
		shape.addGeometry(geometry);
		shape.setAppearance(appearance);

		TransformGroup locationGroup = getLocationGroup();
		locationGroup.addChild(shape);
		addChild(locationGroup);
	}

	/**
	 * 
	 * @return
	 */
	private Geometry createGeometry() {
		GeometryInfo gi = new GeometryInfo(GeometryInfo.TRIANGLE_ARRAY);
		gi.setCoordinates(COORDINATES);
		gi.setCoordinateIndices(INDEXES);
		NormalGenerator ng = new NormalGenerator();
		ng.generateNormals(gi);
		new Stripifier().stripify(gi);
		return gi.getIndexedGeometryArray(true);
	}

	/**
	 * 
	 * @param color
	 */
	public void setColor(Color3f color) {
		material.setAmbientColor(color);
		material.setDiffuseColor(color);
	}
}
