package org.mamrini.leibnitz.j3d;

import javax.media.j3d.BranchGroup;
import javax.media.j3d.Transform3D;
import javax.media.j3d.TransformGroup;
import javax.vecmath.Quat4d;
import javax.vecmath.Vector3f;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.mmarini.leibnitz.FunctionGenerator;
import org.mmarini.leibnitz.Quaternion;
import org.mmarini.leibnitz.Vector;
import org.mmarini.leibnitz.parser.FunctionParserException;

/**
 * 
 * @author US00852
 * 
 */
public class AbstractCorpe extends BranchGroup implements Corpe {
	private static Log log = LogFactory.getLog(AbstractCorpe.class);

	private TransformGroup locationGroup;
	private Transform3D transform;
	private String translateFunction;
	private String rotationFunction;
	private FunctionGenerator generator;

	/**
	 * 
	 */
	public AbstractCorpe() {
		locationGroup = new TransformGroup();
		transform = new Transform3D();
		locationGroup.setTransform(transform);
		locationGroup.setCapability(TransformGroup.ALLOW_TRANSFORM_WRITE);
	}

	/**
	 * @see org.mamrini.leibnitz.j3d.Corpe#apply()
	 */
	@Override
	public void apply() {
		try {
			if (rotationFunction != null) {
				Quaternion rot;
				rot = generator.getQuaternion(rotationFunction);
				applyRotation(rot);
			}
			if (translateFunction != null) {
				Vector vect = generator.getVector(translateFunction);
				float x = (float) vect.getValue(0);
				float y = (float) vect.getValue(1);
				float z = (float) vect.getValue(2);
				transform.setTranslation(new Vector3f(x, z, y));
			}
			locationGroup.setTransform(transform);
		} catch (FunctionParserException e) {
			log.error(e.getMessage(), e);
		}
	}

	/**
	 * 
	 * @param rot
	 */
	private void applyRotation(Quaternion rot) {
		Quat4d quat = new Quat4d(rot.getI(), rot.getK(), rot.getJ(), rot.getR());
		transform.set(quat);

		// double psi = vect.getValue(0);
		// double theta = vect.getValue(1);
		// double phi = vect.getValue(2);
		// transform.setEuler(new Vector3d(psi, phi, theta));
		// transform.rotY(psi);
		// temp.rotZ(theta);
		// transform.mul(temp);
		// temp.rotY(phi);
		// transform.mul(temp);
	}

	/**
	 * @return the locationGroup
	 */
	protected TransformGroup getLocationGroup() {
		return locationGroup;
	}

	/**
	 * @param generator
	 *            the generator to set
	 */
	public void setGenerator(FunctionGenerator generator) {
		this.generator = generator;
	}

	/**
	 * @param rotationFunction
	 *            the rotationFunction to set
	 */
	public void setRotationFunction(String rotationFunction) {
		this.rotationFunction = rotationFunction;
	}

	/**
	 * @param translateFunction
	 *            the translateFunction to set
	 */
	public void setTranslateFunction(String translateFunction) {
		this.translateFunction = translateFunction;
	}

}