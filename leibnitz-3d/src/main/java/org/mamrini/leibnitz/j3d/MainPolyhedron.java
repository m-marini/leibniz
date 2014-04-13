/**
 * 
 */
package org.mamrini.leibnitz.j3d;

import java.awt.BorderLayout;
import java.awt.Container;
import java.awt.GraphicsConfiguration;
import java.io.IOException;

import javax.media.j3d.Alpha;
import javax.media.j3d.AmbientLight;
import javax.media.j3d.Background;
import javax.media.j3d.BoundingSphere;
import javax.media.j3d.BranchGroup;
import javax.media.j3d.Canvas3D;
import javax.media.j3d.DirectionalLight;
import javax.media.j3d.RotationInterpolator;
import javax.media.j3d.Transform3D;
import javax.media.j3d.TransformGroup;
import javax.swing.JApplet;
import javax.vecmath.Color3f;
import javax.vecmath.Point3d;
import javax.vecmath.Vector3f;
import javax.xml.parsers.ParserConfigurationException;

import org.xml.sax.SAXException;

import com.sun.j3d.utils.applet.JMainFrame;
import com.sun.j3d.utils.geometry.Primitive;
import com.sun.j3d.utils.universe.SimpleUniverse;
import com.sun.j3d.utils.universe.ViewingPlatform;

/**
 * @author US00852
 * 
 */
public class MainPolyhedron extends JApplet {

	private static final Color3f BLACK = new Color3f(0f, 0f, 0f);
	private static final Color3f WHITE = new Color3f(1f, 1f, 1f);
	private static final Color3f AMBIENT_COLOR_LIGHT = new Color3f(0.1f, 0.1f,
			0.1f);
	private static final Color3f BACKGROUND_COLOR = BLACK;
	private static final Color3f LIGHT1_COLOR = WHITE;
	private static final Color3f LIGHT2_COLOR = new Color3f(0.5f, 0.5f, 0.5f);
	private static final Color3f LIGHT3_COLOR = new Color3f(0.4f, 0.4f, 0.4f);
	private static final float EYES_HEIGHT = 0.5f;
	private static final float EYES_DISTANCE = 10f;

	private static final long serialVersionUID = 1L;
	private static final int K = 500;

	/**
	 * @param args
	 * @throws IOException
	 * @throws SAXException
	 * @throws ParserConfigurationException
	 */
	public static void main(final String[] args)
			throws ParserConfigurationException, SAXException, IOException {
		final MainPolyhedron main = new MainPolyhedron();
		main.createFrame();
	}

	private JMainFrame mainframe;
	private SimpleUniverse universe;

	private BranchGroup scene;

	/**
	 * 
	 */
	public MainPolyhedron() {
	}

	/**
	 * 
	 */
	private void createFrame() {
		mainframe = new JMainFrame(this, 800, 600);
		mainframe.setTitle("Leibnitz3D");
	}

	/**
	 * 
	 */
	private void createSceneGraph() {

		// Create the root of the branch graph
		scene = new BranchGroup();

		// Create a bounds for the background and lights
		final BoundingSphere bounds = new BoundingSphere(new Point3d(), 100.0);

		final Vector3f lDir1 = new Vector3f(-1.0f, -1.0f, -1.0f);
		final Vector3f lDir2 = new Vector3f(0.5f, -0.5f, -2.0f);
		final Vector3f lDir3 = new Vector3f(1.0f, -4.0f, 1.0f);

		final AmbientLight ambientLight = new AmbientLight(AMBIENT_COLOR_LIGHT);

		final DirectionalLight light1 = new DirectionalLight(LIGHT1_COLOR,
				lDir1);
		final DirectionalLight light2 = new DirectionalLight(LIGHT2_COLOR,
				lDir2);
		final DirectionalLight light3 = new DirectionalLight(LIGHT3_COLOR,
				lDir3);

		final Background bg = new Background(BACKGROUND_COLOR);

		bg.setApplicationBounds(bounds);

		// Set up the global lights
		ambientLight.setInfluencingBounds(bounds);
		light1.setInfluencingBounds(bounds);
		light2.setInfluencingBounds(bounds);
		light3.setInfluencingBounds(bounds);

		scene.addChild(bg);
		scene.addChild(ambientLight);
		scene.addChild(light1);
		scene.addChild(light2);
		scene.addChild(light3);

		final Primitive s = new Dodecahedron(1f);

		final TransformGroup tg1 = new TransformGroup();
		tg1.setCapability(TransformGroup.ALLOW_TRANSFORM_WRITE);
		tg1.addChild(s);

		final Alpha alpha1 = new Alpha(-1, 1 * K);
		final RotationInterpolator rotor1 = new RotationInterpolator(alpha1,
				tg1);
		rotor1.setSchedulingBounds(bounds);

		final TransformGroup tg2 = new TransformGroup();
		tg2.setCapability(TransformGroup.ALLOW_TRANSFORM_WRITE);
		tg2.addChild(tg1);
		final Alpha alpha2 = new Alpha(-1, 60 * K);
		final RotationInterpolator rotor2 = new RotationInterpolator(alpha2,
				tg2);
		final Transform3D ta = new Transform3D();
		ta.rotX(Math.PI / 2);
		rotor2.setTransformAxis(ta);
		rotor2.setSchedulingBounds(bounds);

		final TransformGroup tg3 = new TransformGroup();
		tg3.setCapability(TransformGroup.ALLOW_TRANSFORM_WRITE);
		tg3.addChild(tg2);

		final Alpha alpha3 = new Alpha(-1, 10 * K);

		final Transform3D ta3 = new Transform3D();
		ta3.rotY(Math.PI / 2);

		final RotationInterpolator rotor3 = new RotationInterpolator(alpha3,
				tg3);
		rotor3.setTransformAxis(ta3);
		rotor3.setSchedulingBounds(bounds);

		scene.addChild(tg3);
		scene.addChild(rotor1);
		scene.addChild(rotor2);
		scene.addChild(rotor3);
		scene.compile();
	}

	/**
	 * @see java.applet.Applet#destroy()
	 */
	@Override
	public void destroy() {
		universe.cleanup();
	}

	/**
	 * @see java.applet.Applet#init()
	 */
	@Override
	public void init() {
		final Container contentPane = getContentPane();
		contentPane.setLayout(new BorderLayout());
		final GraphicsConfiguration config = SimpleUniverse
				.getPreferredConfiguration();

		final Canvas3D c = new Canvas3D(config);
		contentPane.add(c, BorderLayout.CENTER);

		// Create a simple scene and attach it to the virtual universe
		createSceneGraph();
		universe = new SimpleUniverse(c);

		// This will move the ViewPlatform back a bit so the
		// objects in the scene can be viewed.
		final ViewingPlatform viewingPlatform = universe.getViewingPlatform();
		// viewingPlatform.setNominalViewingTransform();
		final TransformGroup tg = viewingPlatform.getViewPlatformTransform();

		final Transform3D tr = new Transform3D();
		tr.setTranslation(new Vector3f(0, EYES_HEIGHT, EYES_DISTANCE));
		tg.setTransform(tr);

		universe.addBranchGraph(scene);
	}
}
