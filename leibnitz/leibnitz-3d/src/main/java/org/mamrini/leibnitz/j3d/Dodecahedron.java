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
public class Dodecahedron extends Primitive {

	private static final double SQRT3 = Math.sqrt(3);
	private static final double PHI = 0.5 + Math.sqrt(5) * 0.5;
	private static final float K1 = (float) (1 / SQRT3);
	private static final float K_PHI = (float) (PHI / SQRT3);
	private static final float K_INV_PHI = (float) (1 / SQRT3 / PHI);

	private static final float SHININESS = 80f;

	private static final float[] COORDINATES = new float[] {
			// Face 0
			// 0 Orange
			K1, K1, K1,
			// 1 Pink
			K_PHI, 0f, K_INV_PHI,
			// 2 Pink
			K_PHI, 0f, -K_INV_PHI,
			// 3 Orange
			K1, K1, -K1,
			// 4 Blue
			K_INV_PHI, K_PHI, 0f,

			// Face 1
			// 5 Blue
			-K_INV_PHI, K_PHI, 0f,
			// 6 Orange
			-K1, K1, K1,
			// 7 Green
			0f, K_INV_PHI, K_PHI,

			// Face 2
			// 8 Orange
			-K1, K1, -K1,
			// 9 Pink
			-K_PHI, 0, -K_INV_PHI,
			// 10 Pink
			-K_PHI, 0, +K_INV_PHI,

			// Face 3
			// 11 Green
			0f, K_INV_PHI, -K_PHI,

			// Face 4
			// 12 Green
			0f, -K_INV_PHI, K_PHI,
			// 13 Orange
			K1, -K1, K1,

			// Face 5
			// 14 Orange
			-K1, -K1, K1,

			// Face 6
			// 15 Green
			0f, -K_INV_PHI, -K_PHI,
			// 16 Orange
			-K1, -K1, -K1,

			// Face 7
			// 17 Orange
			K1, -K1, -K1,

			// Face 8
			// 18 Blue
			K_INV_PHI, -K_PHI, 0f,

			// Face 9
			// 19 Blue
			-K_INV_PHI, -K_PHI, 0f,

	};

	private static final int[] INDEXES = new int[] {
			// Face 0
			0, 1, 2, 3, 4,
			// Face 1
			0, 4, 5, 6, 7,
			// Face 2
			5, 8, 9, 10, 6,
			// Face 3
			3, 11, 8, 5, 4,
			// Face 4
			0, 7, 12, 13, 1,
			// Face 5
			6, 10, 14, 12, 7,
			// Face 6
			8, 11, 15, 16, 9,
			// Face 7
			2, 17, 15, 11, 3,
			// Face 8
			1, 13, 18, 17, 2,
			// Face 9
			12, 14, 19, 18, 13,
			// Face 10
			9, 16, 19, 14, 10,
			// Face 11
			15, 17, 18, 19, 16

	};

	private static final int[] STRIP_COUNTS = new int[] { 5, 5, 5, 5, 5, 5, 5,
			5, 5, 5, 5, 5 };

	private Appearance appearance;
	private Shape3D shape;

	/**
	 * 
	 */
	public Dodecahedron() {
		this(1f);
	}

	/**
	 * 
	 * @param radius
	 */
	public Dodecahedron(final float radius) {
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
		final GeometryInfo gi = new GeometryInfo(GeometryInfo.POLYGON_ARRAY);
		final float[] coordinates = Arrays.copyOf(COORDINATES,
				COORDINATES.length);
		for (int i = 0; i < coordinates.length; ++i)
			coordinates[i] *= radius;
		gi.setCoordinates(coordinates);
		gi.setCoordinateIndices(INDEXES);
		gi.setStripCounts(STRIP_COUNTS);

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
