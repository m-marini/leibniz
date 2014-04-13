/**
 * 
 */
package org.mmarini.leibnitz;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.InvalidPropertiesFormatException;

import javax.xml.parsers.ParserConfigurationException;

import org.mmarini.leibnitz.commands.Command;
import org.mmarini.leibnitz.parser.FunctionParserException;
import org.mmarini.leibnitz.parser.LeibnitzParser;
import org.xml.sax.SAXException;

/**
 * @author US00852
 * 
 */
public class Compute {
	/**
	 * <pre>
	 * y(2)+ 10 y(1) + 500 y = 0
	 * y(2) = -(10*y(1)+500*y)
	 * </pre>
	 */
	private static final String[] DEFAULT_ARGS = { "leibnitz.xml", "10", "t",
			"r", "v" };

	/**
	 * @param args
	 * @throws FileNotFoundException
	 */
	public static void main(final String[] args) throws Exception {
		new Compute().run(args);
	}

	private PrintWriter out;
	private FunctionGenerator generator;
	private String[] outFunctions;
	private int count;

	/**
	 * 
	 */
	public Compute() {
	}

	/**
	 * 
	 */
	private void dumpHeader() {
		boolean more = false;
		int n, m;
		for (final String id : outFunctions) {
			final Command cmd = generator.getFunction(id);
			switch (cmd.getType()) {
			case SCALAR:
				if (more)
					out.print(" ");
				out.print(id);
				more = true;
				break;
			case QUATERNION:
				if (more)
					out.print(" ");
				out.print(id);
				out.print("[r] ");
				out.print(id);
				out.print("[i] ");
				out.print(id);
				out.print("[j] ");
				out.print(id);
				out.print("[k]");
				more = true;
				break;
			case VECTOR:
				n = cmd.getDimensions().getRowCount();
				for (int i = 0; i < n; ++i) {
					if (more)
						out.print(" ");
					out.print(id);
					out.print("[");
					out.print(i);
					out.print("]");
					more = true;
				}
				break;
			case ARRAY:
				n = cmd.getDimensions().getRowCount();
				m = cmd.getDimensions().getColCount();
				for (int i = 0; i < n; ++i) {
					for (int j = 0; j < m; ++j) {
						if (more)
							out.print(" ");
						out.print(id);
						out.print("[");
						out.print(i);
						out.print("]");
						out.print("[");
						out.print(j);
						out.print("]");
						more = true;
					}
				}
				break;
			}
		}
		out.println();
	}

	/**
	 * @throws FunctionParserException
	 * 
	 */
	private void dumpValue() throws FunctionParserException {
		boolean more = false;
		int n, m;
		for (final String id : outFunctions) {
			final Command cmd = generator.getFunction(id);

			switch (cmd.getType()) {
			case SCALAR:
				if (more)
					out.print(" ");
				out.print(generator.getScalar(id));
				more = true;
				break;
			case QUATERNION:
				if (more)
					out.print(" ");
				final Quaternion q = generator.getQuaternion(id);
				out.print(q.getR());
				out.print(" ");
				out.print(q.getI());
				out.print(" ");
				out.print(q.getJ());
				out.print(" ");
				out.print(q.getK());
				more = true;
				break;
			case VECTOR:
				final Vector v = generator.getVector(id);
				n = cmd.getDimensions().getRowCount();
				for (int i = 0; i < n; ++i) {
					if (more)
						out.print(" ");
					out.print(v.getValue(i));
					more = true;
				}
				break;
			case ARRAY:
				final double[][] values = generator.getArray(id).getValues();
				n = cmd.getDimensions().getRowCount();
				m = cmd.getDimensions().getColCount();
				for (int i = 0; i < n; ++i) {
					for (int j = 0; j < m; ++j) {
						if (more)
							out.print(" ");
						out.print(values[i][j]);
						more = true;
					}
				}
				break;
			}
		}
		out.println();
	}

	/**
	 * out.println(t + " " + x + " " + v);
	 * 
	 * Compute graph for
	 * 
	 * <pre>
	 * d^2 x/dt^2 + k2 dx/dt + k1 x + k0 = 0
	 * </pre>
	 * 
	 * @throws FunctionParserException
	 * @throws IOException
	 * @throws InvalidPropertiesFormatException
	 * @throws SAXException
	 * @throws ParserConfigurationException
	 * @throws FunctionException
	 */
	private void parseArgs(String[] args) throws FunctionParserException,
			InvalidPropertiesFormatException, IOException,
			ParserConfigurationException, SAXException {
		if (args == null || args.length == 0)
			args = DEFAULT_ARGS;

		int idx = 0;
		final int n = args.length;

		if (idx < n && "-o".equals(args[idx])) {
			++idx;
			if (idx >= n) {
				System.err.println("Missing filename parameters.");
				usage();
				System.exit(1);
			}
			out = new PrintWriter(args[idx++]);
		}
		if (out == null)
			out = new PrintWriter(System.out);

		/*
		 * Mandatory parameters
		 */
		if (idx >= n) {
			System.err.println("Missing mandatory parameters.");
			usage();
			System.exit(1);
		}
		generator = new LeibnitzParser().parse(args[idx++]);

		if (idx >= n) {
			System.err.println("Missing mandatory parameters.");
			usage();
			System.exit(1);
		}
		count = Integer.parseInt(args[idx++]);

		final int m = n - idx;
		if (m == 0) {
			System.err.println("Missing mandatory parameters.");
			usage();
			System.exit(1);
		}
		outFunctions = new String[m];
		for (int i = 0; i < m; ++i) {
			final String exp = args[idx++];
			if (generator.getFunction(exp) == null) {
				System.err.println("Function \"" + exp + "\" not found");
				usage();
				System.exit(1);
			}
			outFunctions[i] = exp;
		}
	}

	/**
	 * out.println(t + " " + x + " " + v);
	 * 
	 * Compute graph for
	 * 
	 * <pre>
	 * d^2 x/dt^2 + k2 dx/dt + k1 x + k0 = 0
	 * </pre>
	 * 
	 * @throws FunctionParserException
	 * @throws IOException
	 * @throws InvalidPropertiesFormatException
	 * @throws SAXException
	 * @throws ParserConfigurationException
	 * @throws FunctionException
	 */
	private void run(final String[] args) throws FunctionParserException,
			InvalidPropertiesFormatException, IOException,
			ParserConfigurationException, SAXException {

		parseArgs(args);

		generator.init();
		dumpHeader();
		for (int i = 0; i < count; ++i) {
			dumpValue();
			generator.apply();
		}
		out.close();
	}

	/**
	 * 
	 */
	private void usage() {
		System.err.println("Usage: " + getClass().getName()
				+ " [-o outputFile] config count function1 [function_n]");
		System.err.println("Example:");
		System.err.print(getClass().getName());
		for (int i = 0; i < DEFAULT_ARGS.length; ++i)
			System.err.print(" " + DEFAULT_ARGS[i]);
		System.err.println();
	}
}
