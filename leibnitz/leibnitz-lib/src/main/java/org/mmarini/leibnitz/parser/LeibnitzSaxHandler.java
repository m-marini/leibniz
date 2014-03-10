/**
 * 
 */
package org.mmarini.leibnitz.parser;

import java.util.HashMap;
import java.util.Map;

import org.mmarini.leibnitz.FunctionGenerator;
import org.mmarini.leibnitz.commands.AbstractCachedCommand;
import org.mmarini.leibnitz.commands.AbstractVariableCommand;
import org.mmarini.leibnitz.commands.Command;
import org.mmarini.leibnitz.commands.Command.Type;
import org.mmarini.leibnitz.commands.TypeDimensions;
import org.mmarini.leibnitz.commands.VariableCommand;
import org.xml.sax.Attributes;
import org.xml.sax.Locator;
import org.xml.sax.SAXException;
import org.xml.sax.SAXParseException;
import org.xml.sax.helpers.DefaultHandler;

/**
 * @author US00852
 * 
 */
public class LeibnitzSaxHandler extends DefaultHandler {
	/**
	 * 
	 */
	private static final String DEFINITIONS_KEY = "definitions";

	public static final String NAME_SPACE = "http://www.mmarini.org/leibnitz-2-0-0";

	private static final String ID_KEY = "id";
	private static final String VARIABLE_KEY = "variable";
	private static final String UPDATE_KEY = "update";
	private static final String FUNCTION_KEY = "function";
	private static final String CORPE_KEY = "corpe";

	// private static final String DEFINITIONS_KEY = "definitions";

	private interface StartHandler {
		public abstract void apply(Attributes attributes) throws SAXException;
	};

	private interface EndHandler {
		public abstract void apply() throws SAXException;
	};

	private Locator locator;
	private final StringBuilder text;
	private String id;
	private final ExpressionInterpreter context;
	private final FunctionGenerator generator;
	private final Map<String, StartHandler> startHandler;
	private final Map<String, EndHandler> endHandler;

	private boolean contentFound;

	/**
	 * 
	 */
	public LeibnitzSaxHandler() {
		text = new StringBuilder();
		context = new ExpressionInterpreter();
		generator = new FunctionGenerator();
		startHandler = new HashMap<>();
		endHandler = new HashMap<>();

		final StartHandler parseIdHandler = new StartHandler() {

			@Override
			public void apply(final Attributes attributes) throws SAXException {
				final String i = attributes.getValue(ID_KEY);
				validateId(i);
				id = i;
			}
		};

		startHandler.put(DEFINITIONS_KEY, new StartHandler() {
			
			@Override
			public void apply(Attributes attributes) throws SAXException {
				contentFound=true;
			}
		});
		startHandler.put(VARIABLE_KEY, parseIdHandler);
		startHandler.put(UPDATE_KEY, parseIdHandler);
		startHandler.put(FUNCTION_KEY, parseIdHandler);
		startHandler.put(CORPE_KEY, new StartHandler() {

			@Override
			public void apply(final Attributes attributes) throws SAXException {
				final String l = attributes.getValue("location");
				final Command tfd = generator.getFunction(l);
				if (tfd == null)
					throw new SAXParseException("Function \"" + l
							+ "\" undefined.", locator);
				if (tfd.getType() != Type.VECTOR)
					throw new SAXParseException("Function \"" + l
							+ "\" is not a vector.", locator);
				final TypeDimensions dims = tfd.getDimensions();
				final int dim = dims.getRowCount();
				if (dim != 3)
					throw new SAXParseException("Function \"" + l
							+ "\" is not a location vector in 3D space (" + dim
							+ "D).", locator);

				final String r = attributes.getValue("rotation");
				if (r != null) {
					final Command rfd = generator.getFunction(r);
					if (rfd == null)
						throw new SAXParseException("Function \"" + r
								+ "\" undefined.", locator);
					if (rfd.getType() != Type.QUATERNION)
						throw new SAXParseException("Function \"" + r
								+ "\" is not a quaternion.", locator);
				}

				generator.add(new CorpeDefs(l, r));
			}
		});

		endHandler.put(FUNCTION_KEY, new EndHandler() {
			@Override
			public void apply() throws SAXParseException {
				try {
					final Command fr = context.parse(text.toString(),
							SyntaxFactory.getInstance().getFunctionSyntax());
					final AbstractCachedCommand function = AbstractCachedCommand
							.create(fr);
					context.put(id, fr);
					generator.add(id, function);
				} catch (final FunctionParserException e) {
					throw new SAXParseException(e.getMessage(), locator, e);
				}
			}
		});
		endHandler.put(VARIABLE_KEY, new EndHandler() {
			@Override
			public void apply() throws SAXParseException {
				try {
					final Command fr = context.parse(text.toString(),
							SyntaxFactory.getInstance().getFunctionSyntax());
					final AbstractVariableCommand variable = AbstractVariableCommand
							.create(id, fr);
					context.put(id, variable);
					generator.add(id, variable);
				} catch (final FunctionParserException e) {
					throw new SAXParseException(e.getMessage(), locator, e);
				}
			}
		});
		endHandler.put(UPDATE_KEY, new EndHandler() {
			@Override
			public void apply() throws SAXParseException {
				try {
					final VariableCommand v = generator.getVariable(id);
					if (v == null)
						throw new SAXParseException("Variable \"" + id
								+ "\" not found", locator);
					final Command fr = context.parse(text.toString(),
							SyntaxFactory.getInstance().getFunctionSyntax());
					if (fr.getType() != v.getType()) {
						throw new SAXParseException("Update function return a "
								+ id + "\" not found", locator);
					}
					v.setUpdateFunction(fr);
				} catch (final FunctionParserException e) {
					throw new SAXParseException(e.getMessage(), locator, e);
				}
			}
		});
	}

	/**
	 * @see org.xml.sax.helpers.DefaultHandler#endDocument()
	 */
	@Override
	public void endDocument() throws SAXException {
		if (!contentFound)
			throw new SAXParseException("Missing " + DEFINITIONS_KEY
					+ " element", locator);
	}

	/**
	 * @see org.xml.sax.helpers.DefaultHandler#characters(char[], int, int)
	 */
	@Override
	public void characters(final char[] ch, final int start, final int length)
			throws SAXException {
		text.append(ch, start, length);
	}

	/**
	 * @see org.xml.sax.helpers.DefaultHandler#endElement(java.lang.String,
	 *      java.lang.String, java.lang.String)
	 */
	@Override
	public void endElement(final String uri, final String localName,
			final String qName) throws SAXException {
		if (!NAME_SPACE.equals(uri))
			return;
		final EndHandler h = endHandler.get(localName);
		if (h != null)
			h.apply();
	}

	/**
	 * @see org.xml.sax.helpers.DefaultHandler#error(org.xml.sax.SAXParseException)
	 */
	@Override
	public void error(final SAXParseException e) throws SAXException {
		throw e;
	}

	/**
	 * 
	 * @return
	 */
	public FunctionGenerator getGenerator() {
		return generator;
	}

	/**
	 * 
	 * @param id
	 * @throws SAXParseException
	 */
	private void validateId(final String id) throws SAXParseException {
		final char[] bfr = id.toCharArray();
		if (bfr.length == 0 || !Character.isJavaIdentifierStart(bfr[0]))
			throw new SAXParseException(id + " is not a valid identifier",
					locator);
		for (int i = 1; i < bfr.length; ++i)
			if (!Character.isJavaIdentifierPart(bfr[i]))
				throw new SAXParseException(id + " is not a valid identifier",
						locator);
	}

	/**
	 * @see org.xml.sax.helpers.DefaultHandler#setDocumentLocator(org.xml.sax.Locator
	 *      )
	 */
	@Override
	public void setDocumentLocator(final Locator locator) {
		this.locator = locator;
	}

	/**
	 * @see org.xml.sax.helpers.DefaultHandler#startDocument()
	 */
	@Override
	public void startDocument() throws SAXException {
		contentFound = false;
	}

	/**
	 * @see org.xml.sax.helpers.DefaultHandler#startElement(java.lang.String,
	 *      java.lang.String, java.lang.String, org.xml.sax.Attributes)
	 */
	@Override
	public void startElement(final String uri, final String localName,
			final String qName, final Attributes attributes)
			throws SAXException {
		text.setLength(0);
		if (!NAME_SPACE.equals(uri))
			return;
		final StartHandler h = startHandler.get(localName);
		if (h != null)
			h.apply(attributes);
	}
}
