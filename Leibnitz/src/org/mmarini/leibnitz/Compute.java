/**
 * 
 */
package org.mmarini.leibnitz;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.InvalidPropertiesFormatException;

import javax.xml.parsers.ParserConfigurationException;

import org.mmarini.leibnitz.parser.FunctionDefinition;
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
	private static final String[] DEFAULT_ARGS = { "leibnitz.xml", "2", "3" };

	/**
	 * @param args
	 * @throws FileNotFoundException
	 */
	public static void main(String[] args) throws Exception {
		new Compute().run(args);
	}

	private PrintWriter out;
	private FunctionGenerator generator;

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
		for (OutputFunction of : generator.getOutput()) {
			String label = of.getLabel();
			FunctionDefinition fd = of.getDefinition();
			if (fd.isScalar()) {
				if (more)
					out.print(" ");
				out.print(label);
				more = true;
			} else {
				int n = fd.getRowCount();
				for (int i = 0; i < n; ++i) {
					if (more)
						out.print(" ");
					out.print(label);
					out.print("[");
					out.print(i);
					out.print("]");
					more = true;
				}
			}
		}
		out.println();
	}

	/**
	 * 
	 */
	private void dumpValue() {
		boolean more = false;
		for (OutputFunction of : generator.getOutput()) {
			FunctionDefinition fd = of.getDefinition();
			fd.getFunction().apply(generator);
			if (fd.isScalar()) {
				if (more)
					out.print(" ");
				out.print(generator.getScalar());
				more = true;
			} else {
				for (double value : generator.getVector().getValues()) {
					if (more)
						out.print(" ");
					out.print(value);
					more = true;
				}
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
	private void run(String[] args) throws FunctionParserException,
			InvalidPropertiesFormatException, IOException,
			ParserConfigurationException, SAXException {
		if (args == null || args.length == 0)
			args = DEFAULT_ARGS;

		/*
		 * Mandatory parameters
		 */
		if (args.length < 1) {
			System.err.println("Missing mandatory parameters.");
			usage();
			System.exit(1);
		}

		/*
		 * Optional parameters
		 */
		int idx = 1;
		if (idx < args.length) {
			if ("-o".equals(args[idx])) {
				++idx;
				if (idx >= args.length) {
					System.err.println("Missing filename parameters.");
					usage();
					System.exit(1);
				}
				out = new PrintWriter(args[idx++]);
			}
		}

		LeibnitzParser p = new LeibnitzParser();
		generator = p.parse(args[0]);

		if (out == null)
			out = new PrintWriter(System.out);

		// equation.setValues(values);

		dumpHeader();
		generator.compute();
		do {
			dumpValue();
			generator.apply();
			generator.compute();
		} while (!generator.isCompleted());
		dumpValue();
		out.close();
	}

	/**
	 * 
	 */
	private void usage() {
		System.err
				.println("Usage: "
						+ getClass().getName()
						+ " function functionOrder xmax dx [-o outputFile] [x y y(0) y(1) ...]");
		System.err.println("Example:");
		System.err.print(getClass().getName());
		for (int i = 0; i < DEFAULT_ARGS.length; ++i)
			System.err.print(" " + DEFAULT_ARGS[i]);
		System.err.println();
	}
}
