/**
 * 
 */
package org.mmarini.leibnitz.j3d;

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
public class Icosahedron extends Primitive {
	private static final double PI_2_5 = 2 * Math.PI / 5;
	private static final double PI_1_5 = Math.PI / 5;
	private static final double S11 = Math.sin(PI_2_5);
	private static final double C11 = Math.cos(PI_2_5);
	private static final double S12 = Math.sin(PI_2_5 * 2);
	private static final double C12 = Math.cos(PI_2_5 * 2);
	private static final double S13 = Math.sin(PI_2_5 * 3);
	private static final double C13 = Math.cos(PI_2_5 * 3);
	private static final double S14 = Math.sin(PI_2_5 * 4);
	private static final double C14 = Math.cos(PI_2_5 * 4);

	private static final double S20 = Math.sin(PI_1_5);
	private static final double C20 = Math.cos(PI_1_5);
	private static final double S21 = Math.sin(PI_1_5 + PI_2_5);
	private static final double C21 = Math.cos(PI_1_5 + PI_2_5);
	private static final double S22 = Math.sin(PI_1_5 + PI_2_5 * 2);
	private static final double C22 = Math.cos(PI_1_5 + PI_2_5 * 2);
	private static final double S23 = Math.sin(PI_1_5 + PI_2_5 * 3);
	private static final double C23 = Math.cos(PI_1_5 + PI_2_5 * 3);
	private static final double S24 = Math.sin(PI_1_5 + PI_2_5 * 4);
	private static final double C24 = Math.cos(PI_1_5 + PI_2_5 * 4);

	private static final float SHININESS = 80f;

	private static final float X_LENGTH = (float) (2 / Math.sqrt(5));
	private static final float Y_LENGTH = (float) (1 / Math.sqrt(5));

	private static final float[] COORDINATES = new float[] { 0f, 1f, 0f,

	X_LENGTH, Y_LENGTH, 0f,

	(float) (X_LENGTH * C11), Y_LENGTH, (float) (X_LENGTH * S11),

	(float) (X_LENGTH * C12), Y_LENGTH, (float) (X_LENGTH * S12),

	(float) (X_LENGTH * C13), Y_LENGTH, (float) (X_LENGTH * S13),

	(float) (X_LENGTH * C14), Y_LENGTH, (float) (X_LENGTH * S14),

	(float) (X_LENGTH * C20), -Y_LENGTH, (float) (X_LENGTH * S20),

	(float) (X_LENGTH * C21), -Y_LENGTH, (float) (X_LENGTH * S21),

	(float) (X_LENGTH * C22), -Y_LENGTH, (float) (X_LENGTH * S22),

	(float) (X_LENGTH * C23), -Y_LENGTH, (float) (X_LENGTH * S23),

	(float) (X_LENGTH * C24), -Y_LENGTH, (float) (X_LENGTH * S24),

	0f, -1f, 0f };

	private static final int[] INDEXES = new int[] { 0, 2, 1,

	0, 3, 2,

	0, 4, 3,

	0, 5, 4,

	0, 1, 5,

	1, 2, 6,

	2, 3, 7,

	3, 4, 8,

	4, 5, 9,

	5, 1, 10,

	2, 7, 6,

	3, 8, 7,

	4, 9, 8,

	5, 10, 9,

	1, 6, 10,

	6, 7, 11,

	7, 8, 11,

	8, 9, 11,

	9, 10, 11,

	10, 6, 11,

	};

	private Appearance appearance;
	private Shape3D shape;

	/**
	 * 
	 */
	public Icosahedron() {
		this(1f);
	}

	/**
	 * 
	 * @param radius
	 */
	public Icosahedron(final float radius) {
		createDefault(radius);
	}

	/**
	 * @param radius
	 * 
	 */
	private void createDefault(final float radius) {
		final Material material = new Material();

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

		shape = new Shape3D();
		final Geometry geometry = createGeometry(radius);
		shape.addGeometry(geometry);
		shape.setAppearance(appearance);

		addChild(shape);
	}

	/**
	 * 
	 * @param radius
	 * @return
	 */
	private Geometry createGeometry(final float radius) {
		final GeometryInfo gi = new GeometryInfo(GeometryInfo.TRIANGLE_ARRAY);
		final float[] coordinates = Arrays.copyOf(COORDINATES,
				COORDINATES.length);
		for (int i = 0; i < coordinates.length; ++i)
			coordinates[i] *= radius;
		gi.setCoordinates(coordinates);
		gi.setCoordinateIndices(INDEXES);
		final NormalGenerator ng = new NormalGenerator();
		ng.generateNormals(gi);
		new Stripifier().stripify(gi);
		return gi.getIndexedGeometryArray(true);
	}

	/**
	 * 
	 */
	@Override
	public Appearance getAppearance(final int arg0) {
		return appearance;
	}

	/**
	 * 
	 */
	@Override
	public Shape3D getShape(final int arg0) {
		return shape;
	}

	/**
	 * 
	 */
	@Override
	public void setAppearance(final Appearance arg0) {
		appearance = arg0;
	}
}
