/**
 * 
 */
package org.mamrini.leibnitz.j3d;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Container;
import java.awt.GraphicsConfiguration;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.media.j3d.AmbientLight;
import javax.media.j3d.Background;
import javax.media.j3d.BoundingSphere;
import javax.media.j3d.BranchGroup;
import javax.media.j3d.Canvas3D;
import javax.media.j3d.DirectionalLight;
import javax.media.j3d.Transform3D;
import javax.media.j3d.TransformGroup;
import javax.swing.JApplet;
import javax.vecmath.Color3f;
import javax.vecmath.Point3d;
import javax.vecmath.Vector3f;
import javax.xml.parsers.ParserConfigurationException;

import org.mmarini.leibnitz.FunctionGenerator;
import org.mmarini.leibnitz.commands.Command;
import org.mmarini.leibnitz.commands.Command.Type;
import org.mmarini.leibnitz.commands.TypeDimensions;
import org.mmarini.leibnitz.parser.LeibnitzParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.xml.sax.SAXException;

import com.sun.j3d.utils.applet.JMainFrame;
import com.sun.j3d.utils.universe.SimpleUniverse;
import com.sun.j3d.utils.universe.ViewingPlatform;

/**
 * @author US00852
 * 
 */
public class Main extends JApplet {

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
	private static final String[] DEFAULT_ARGUMENTS = {
			"filename=rotazione.xml", "corpe=R,q" };

	private static Logger log = LoggerFactory.getLogger(Main.class);

	/**
	 * @param args
	 * @throws IOException
	 * @throws SAXException
	 * @throws ParserConfigurationException
	 */
	public static void main(String[] args) throws ParserConfigurationException,
			SAXException, IOException {
		Main main = new Main();
		main.load(args);
		main.createFrame();
	}

	private JMainFrame mainframe;
	private SimpleUniverse universe;
	private BranchGroup scene;
	private LeibnitzBehaviour behaviour;
	private FunctionGenerator generator;

	private List<AbstractCorpe> corpes;
	private String filename;
	private Map<String, String[]> corpeMap;
	private List<String> corpeNames;

	/**
	 * 
	 */
	public Main() {
		behaviour = new LeibnitzBehaviour();
		corpes = new ArrayList<AbstractCorpe>();
		corpeNames = new ArrayList<>();
		corpeMap = new HashMap<>();
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
		BoundingSphere bounds = new BoundingSphere(new Point3d(), 100.0);

		Vector3f lDir1 = new Vector3f(-1.0f, -1.0f, -1.0f);
		Vector3f lDir2 = new Vector3f(0.5f, -0.5f, -2.0f);
		Vector3f lDir3 = new Vector3f(1.0f, -4.0f, 1.0f);

		AmbientLight ambientLight = new AmbientLight(AMBIENT_COLOR_LIGHT);

		DirectionalLight light1 = new DirectionalLight(LIGHT1_COLOR, lDir1);
		DirectionalLight light2 = new DirectionalLight(LIGHT2_COLOR, lDir2);
		DirectionalLight light3 = new DirectionalLight(LIGHT3_COLOR, lDir3);

		Background bg = new Background(BACKGROUND_COLOR);

		bg.setApplicationBounds(bounds);

		// Set up the global lights
		ambientLight.setInfluencingBounds(bounds);
		light1.setInfluencingBounds(bounds);
		light2.setInfluencingBounds(bounds);
		light3.setInfluencingBounds(bounds);

		behaviour.setSchedulingBounds(bounds);
		behaviour.setGenerator(generator);

		scene.addChild(bg);
		scene.addChild(ambientLight);
		scene.addChild(light1);
		scene.addChild(light2);
		scene.addChild(light3);
		scene.addChild(behaviour);

		for (AbstractCorpe c : corpes) {
			behaviour.add(c);
			scene.addChild(c);
		}

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
		Container contentPane = getContentPane();
		contentPane.setLayout(new BorderLayout());
		GraphicsConfiguration config = SimpleUniverse
				.getPreferredConfiguration();

		Canvas3D c = new Canvas3D(config);
		contentPane.add(c, BorderLayout.CENTER);

		// Create a simple scene and attach it to the virtual universe
		createSceneGraph();
		universe = new SimpleUniverse(c);

		// This will move the ViewPlatform back a bit so the
		// objects in the scene can be viewed.
		ViewingPlatform viewingPlatform = universe.getViewingPlatform();
		// viewingPlatform.setNominalViewingTransform();
		TransformGroup tg = viewingPlatform.getViewPlatformTransform();

		Transform3D tr = new Transform3D();
		tr.setTranslation(new Vector3f(0, EYES_HEIGHT, EYES_DISTANCE));
		tg.setTransform(tr);

		universe.addBranchGraph(scene);
	}

	/**
	 * 
	 * @param args
	 * @throws IOException
	 * @throws SAXException
	 * @throws ParserConfigurationException
	 */
	private void load(String[] args) throws ParserConfigurationException,
			SAXException, IOException {
		if (args.length == 0) {
			args = DEFAULT_ARGUMENTS;
		}
		try {
			parseArgs(args);
		} catch (IllegalArgumentException e) {
			log.error(e.getMessage());
			usage();
			throw e;
		}

		if (filename == null) {
			throw new IllegalArgumentException("Missing filename argument");
		}

		/*
		 * First arguments is the function xml file
		 */
		generator = new LeibnitzParser().parse(filename);

		Command cmd = generator.getFunction("dt");
		if (cmd == null)
			throw new IllegalArgumentException("Undefined function \"dt\"");
		if (cmd.getType() != Type.SCALAR)
			throw new IllegalArgumentException(
					"Function \"dt\" is not a scalar");

		int m = corpeNames.size();
		int i = 0;
		for (String name : corpeNames) {
			/*
			 * Parameters are the specifications for each corpe. The location
			 * and optionally the rotation form the specifications. The rotation
			 * variable is separated by a comma from the location variable
			 */
			log.info("Loading " + name + " ...");
			String[] parms = corpeMap.get(name);
			AbstractCorpe corpe = null;
			String loc = parms[0];
			String rot = null;
			if (parms.length > 1)
				rot = parms[1];
			float h = 0.8f * (i - 1) / m;
			Color3f color = new Color3f(Color.getHSBColor(h, 1f, 1f));
			if (rot == null) {
				Particle particle = new Particle();
				particle.setColor(color);
				corpe = particle;
			} else {
				Diamond bar = new Diamond();
				bar.setColor(color);
				corpe = bar;
			}
			Command tfd = generator.getFunction(loc);
			if (tfd == null)
				throw new IllegalArgumentException("Function \"" + loc
						+ "\" of corpe \"" + name + "\" undefined.");
			if (tfd.getType() != Type.VECTOR)
				throw new IllegalArgumentException("Function \"" + loc
						+ "\" of corpe \"" + name + "\" is not a vector.");
			TypeDimensions dims = tfd.getDimensions();
			int dim = dims.getRowCount();
			if (dim != 3)
				throw new IllegalArgumentException("Function \"" + loc
						+ "\" of corpe \"" + name
						+ "\" is not a location vector in 3D space (" + dim
						+ "D).");
			corpe.setGenerator(generator);
			corpe.setTranslateFunction(loc);
			if (rot != null) {
				Command rfd = generator.getFunction(rot);
				if (rfd == null)
					throw new IllegalArgumentException("Function \"" + rot
							+ "\" of corpe \"" + name + "\" undefined.");
				if (rfd.getType() != Type.QUATERNION)
					throw new IllegalArgumentException("Function \"" + loc
							+ "\" of corpe \"" + name
							+ "\" is not a quaternion.");
				corpe.setRotationFunction(rot);
			}
			corpes.add(corpe);
		}
		generator.init();
	}

	/**
	 * 
	 * @param args
	 */
	private void parseArgs(String[] args) {
		for (String arg : args) {
			String[] txt = arg.split("=");
			if (txt.length != 2) {
				throw new IllegalArgumentException("Wrong argument \"" + arg
						+ "\"");
			}
			String key = txt[0];
			String value = txt[1];
			switch (key) {
			case "filename":
				filename = value;
				break;
			default:
				String[] funcs = value.split(",");
				if (corpeMap.containsKey(key)) {
					throw new IllegalArgumentException("Corpe \"" + key
							+ "\" already defined");
				}
				corpeMap.put(key, funcs);
				corpeNames.add(key);
			}
		}
	}

	/**
	 * 
	 */
	private void usage() {
		System.out.println("Usage:");
		System.out
				.println(getClass()
						+ " filename=<filename>"
						+ " [*<corpeName>=<locationFunctionName>,[<rotationFunctionName>]");
	}
}
