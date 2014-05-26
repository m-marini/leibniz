/**
 * 
 */
package org.mmarini.leibnitz.j3d;

import java.awt.BorderLayout;
import java.awt.Container;
import java.awt.event.ActionEvent;
import java.io.File;
import java.io.IOException;

import javax.media.j3d.AmbientLight;
import javax.media.j3d.Background;
import javax.media.j3d.BoundingSphere;
import javax.media.j3d.BranchGroup;
import javax.media.j3d.Canvas3D;
import javax.media.j3d.DirectionalLight;
import javax.media.j3d.Group;
import javax.media.j3d.Transform3D;
import javax.swing.AbstractAction;
import javax.swing.Action;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.filechooser.FileNameExtensionFilter;
import javax.vecmath.Color3f;
import javax.vecmath.Point3d;
import javax.vecmath.Vector3f;
import javax.xml.parsers.ParserConfigurationException;

import org.mmarini.fp.FPArrayList;
import org.mmarini.fp.FPList;
import org.mmarini.leibnitz.FunctionGenerator;
import org.mmarini.leibnitz.commands.Command;
import org.mmarini.leibnitz.commands.Command.Type;
import org.mmarini.leibnitz.parser.FunctionParserException;
import org.mmarini.leibnitz.parser.LeibnitzParser;
import org.mmarini.swing.ActionBuilder;
import org.mmarini.swing.SwingOptions;
import org.mmarini.swing.SwingTools;
import org.xml.sax.SAXException;

import com.sun.j3d.utils.universe.SimpleUniverse;

/**
 * @author US00852
 * 
 */
public class Main {

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

	/**
	 * @param args
	 * @throws IOException
	 * @throws SAXException
	 * @throws ParserConfigurationException
	 */
	public static void main(final String[] args)
			throws ParserConfigurationException, SAXException, IOException {
		new Main().run();
	}

	private final JFrame frame;

	private final SwingOptions options;
	private final Action openAction;
	private final Action exitAction;
	private final JFileChooser fileChooser;
	private BranchGroup scene;
	private FPList<AbstractCorpe> corpeList;
	private final LeibnitzBehaviour behaviour;

	/**
	 * 
	 */
	public Main() {
		frame = new JFrame();
		behaviour = new LeibnitzBehaviour();
		options = new SwingOptions(Main.class);
		fileChooser = new JFileChooser();
		corpeList = new FPArrayList<>();
		final ActionBuilder builder = ActionBuilder.create(
				Messages.RESOURCE_BUNDLE, options, frame);
		openAction = builder.setUp(new AbstractAction() {
			private static final long serialVersionUID = 4554447120464611067L;

			@Override
			public void actionPerformed(final ActionEvent e) {
				openFile();
			}

		}, "open"); //$NON-NLS-1$
		exitAction = builder.setUp(new AbstractAction() {
			private static final long serialVersionUID = 4554447120464611067L;

			@Override
			public void actionPerformed(final ActionEvent e) {
				System.exit(0);
			}

		}, "exit"); //$NON-NLS-1$

		fileChooser.setFileFilter(new FileNameExtensionFilter("Leibnitz file",
				"xml", "json"));
		frame.setTitle(Messages.getString("Main.title")); //$NON-NLS-1$
		frame.setSize(800, 600);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.setJMenuBar(builder.createMenuBar(
				"file", openAction, null, exitAction, "options", "lookAndFeel"//$NON-NLS-1$ //$NON-NLS-2$ //$NON-NLS-3$ 
		));
		SwingTools.centerOnScreen(frame);
		fileChooser.setCurrentDirectory(new File("../samples"));
		final Container c = frame.getContentPane();
		c.setLayout(new BorderLayout());
		createScene();
		c.add(createCanvas(), BorderLayout.CENTER);
	}

	/**
	 * @return
	 */
	private Canvas3D createCanvas() {
		final Canvas3D c = new Canvas3D(
				SimpleUniverse.getPreferredConfiguration());

		// Create and add branches to the universe
		final SimpleUniverse u = new SimpleUniverse(c);

		// This will move the ViewPlatform back a bit so the
		// objects in the scene can be viewed.
		// viewingPlatform.setNominalViewingTransform();
		final Transform3D tr = new Transform3D();
		tr.setTranslation(new Vector3f(0, EYES_HEIGHT, EYES_DISTANCE));
		u.getViewingPlatform().getViewPlatformTransform().setTransform(tr);

		u.addBranchGraph(scene);
		return c;
	}

	/**
	 * 
	 */
	private void createScene() {

		// Create a bounds for the background and lights
		final BoundingSphere b = new BoundingSphere(new Point3d(), 100.0);

		// Set up the global lights
		final AmbientLight al = new AmbientLight(AMBIENT_COLOR_LIGHT);
		al.setInfluencingBounds(b);

		final DirectionalLight l1 = new DirectionalLight(LIGHT1_COLOR,
				new Vector3f(-1.0f, -1.0f, -1.0f));
		l1.setInfluencingBounds(b);

		final DirectionalLight l2 = new DirectionalLight(LIGHT2_COLOR,
				new Vector3f(0.5f, -0.5f, -2.0f));
		l2.setInfluencingBounds(b);

		final DirectionalLight l3 = new DirectionalLight(LIGHT3_COLOR,
				new Vector3f(1.0f, -4.0f, 1.0f));
		l3.setInfluencingBounds(b);

		final Background bg = new Background(BACKGROUND_COLOR);
		bg.setApplicationBounds(b);

		behaviour.setSchedulingBounds(b);

		// Create the root of the branch graph
		scene = new BranchGroup();
		scene.addChild(bg);
		scene.addChild(al);
		scene.addChild(l1);
		scene.addChild(l2);
		scene.addChild(l3);
		scene.addChild(behaviour);
		scene.setCapability(BranchGroup.ALLOW_DETACH);
		scene.setCapability(Group.ALLOW_CHILDREN_WRITE);
		scene.setCapability(Group.ALLOW_CHILDREN_EXTEND);
		scene.compile();
	}

	/**
	 * 
	 */
	private void openFile() {
		if (fileChooser.showOpenDialog(frame) == JFileChooser.APPROVE_OPTION) {
			try {
				parseFile(fileChooser.getSelectedFile());
			} catch (SAXException | IOException | ParserConfigurationException
					| FunctionParserException e) {
				new SwingTools(Messages.RESOURCE_BUNDLE).alert(e);
			}
		}
	}

	/**
	 * @param f
	 * @throws ParserConfigurationException
	 * @throws IOException
	 * @throws SAXException
	 * @throws FunctionParserException
	 */
	private void parseFile(final File f) throws SAXException, IOException,
			ParserConfigurationException, FunctionParserException {
		removeCorpes();
		final FunctionGenerator g = new LeibnitzParser().parse(f);
		final Command cmd = g.getFunction("dt"); //$NON-NLS-1$
		if (cmd == null)
			throw new IllegalArgumentException("Undefined function \"dt\""); //$NON-NLS-1$
		if (cmd.getType() != Type.SCALAR)
			throw new IllegalArgumentException(
					"Function \"dt\" is not a scalar"); //$NON-NLS-1$
		behaviour.setDt(Math.round(g.getScalar("dt") * 1e9));

		corpeList = new CorpeFactory(g).build();
		behaviour.setGenerator(g);
		for (final AbstractCorpe c : corpeList) {
			c.setCapability(BranchGroup.ALLOW_DETACH);
			c.compile();
			behaviour.addCorpe(c);
			scene.addChild(c);
		}
		g.init();
	}

	/**
	 * 
	 */
	private void removeCorpes() {
		behaviour.clearCorpes();
		for (final AbstractCorpe c : corpeList)
			scene.removeChild(c);
	}

	/**
	 * 
	 */
	private void run() {
		frame.setVisible(true);
	}
}
