/**
 * 
 */
package org.mamrini.leibnitz.j3d;

import java.util.Arrays;

import javax.media.j3d.Appearance;
import javax.media.j3d.Geometry;
import javax.media.j3d.Material;
import javax.media.j3d.Shape3D;
import javax.vecmath.Color3f;

import com.sun.j3d.utils.geometry.GeometryInfo;
import com.sun.j3d.utils.geometry.NormalGenerator;
import com.sun.j3d.utils.geometry.Primitive;
import com.sun.j3d.utils.geometry.Stripifier;

/**
 * @author US00852
 * 
 */
public class Tetrahedron extends Primitive {

	private static final float SHININESS = 80f;

	private static final float K = (float) (0.5 / Math.sqrt(2));

	private static final float[] COORDINATES = new float[] { K, K, K,

	-K, K, -K,

	-K, -K, K,

	K, -K, -K };

	private static final int[] INDEXES = new int[] { 0, 1, 2,

	0, 3, 1,

	0, 2, 3,

	1, 3, 2 };

	private Appearance appearance;
	private Shape3D shape;

	/**
	 * 
	 */
	public Tetrahedron() {
		this(1f);
	}

	/**
	 * 
	 * @param radius
	 */
	public Tetrahedron(float radius) {
		createDefault(radius);
	}

	/**
	 * @param radius
	 * 
	 */
	private void createDefault(float radius) {
		Material material = new Material();

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

		shape = new Shape3D();
		Geometry geometry = createGeometry(radius);
		shape.addGeometry(geometry);
		shape.setAppearance(appearance);

		addChild(shape);
	}

	/**
	 * 
	 * @param radius
	 * @return
	 */
	private Geometry createGeometry(float radius) {
		GeometryInfo gi = new GeometryInfo(GeometryInfo.TRIANGLE_ARRAY);
		float[] coordinates = Arrays.copyOf(COORDINATES, COORDINATES.length);
		for (int i = 0; i < coordinates.length; ++i)
			coordinates[i] *= radius;
		gi.setCoordinates(coordinates);
		gi.setCoordinateIndices(INDEXES);
		NormalGenerator ng = new NormalGenerator();
		ng.generateNormals(gi);
		new Stripifier().stripify(gi);
		return gi.getIndexedGeometryArray(true);
	}

	/**
	 * 
	 */
	@Override
	public Appearance getAppearance(int arg0) {
		return appearance;
	}

	/**
	 * 
	 */
	@Override
	public Shape3D getShape(int arg0) {
		return shape;
	}

	/**
	 * 
	 */
	@Override
	public void setAppearance(Appearance arg0) {
		appearance = arg0;
	}
}
