/**
 * 
 */
package org.mmarini.leibnitz.parser;

import org.mmarini.leibnitz.FunctionGenerator;
import org.mmarini.leibnitz.commands.AbstractCachedCommand;
import org.mmarini.leibnitz.commands.AbstractVariableCommand;
import org.mmarini.leibnitz.commands.Command;
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
	public static final String NAME_SPACE = "http://www.mmarini.org/leibnitz-1-0-0";

	private static final String ID_KEY = "id";
	private static final String VARIABLE_KEY = "variable";
	private static final String UPDATE_KEY = "update";
	private static final String FUNCTION_KEY = "function";
	private static final String DEFINITIONS_KEY = "definitions";

	private Locator locator;
	private StringBuilder text;
	private String id;
	private ExpressionInterpreter context;
	private FunctionGenerator generator;

	/**
	 * 
	 */
	public LeibnitzSaxHandler() {
		text = new StringBuilder();
		context = new ExpressionInterpreter();
		generator = new FunctionGenerator();
	}

	/**
	 * @see org.xml.sax.helpers.DefaultHandler#characters(char[], int, int)
	 */
	@Override
	public void characters(char[] ch, int start, int length)
			throws SAXException {
		text.append(ch, start, length);
	}

	/**
	 * @see org.xml.sax.helpers.DefaultHandler#endElement(java.lang.String,
	 *      java.lang.String, java.lang.String)
	 */
	@Override
	public void endElement(String uri, String localName, String qName)
			throws SAXException {
		if (!NAME_SPACE.equals(uri))
			return;
		if (FUNCTION_KEY.equals(localName)) {
			parseFunction();
		} else if (VARIABLE_KEY.equals(localName)) {
			parseVariable();
		} else if (UPDATE_KEY.equals(localName)) {
			parseUpdate();
		} else if (DEFINITIONS_KEY.equals(localName)) {
			parseDefinitions();
		}
	}

	/**
	 * @see org.xml.sax.helpers.DefaultHandler#error(org.xml.sax.SAXParseException)
	 */
	@Override
	public void error(SAXParseException e) throws SAXException {
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
	 */
	private void parseDefinitions() {
	}

	/**
	 * @throws SAXParseException
	 * 
	 */
	private void parseFunction() throws SAXParseException {
		try {
			Command fr = context.parse(text.toString(), SyntaxFactory
					.getInstance().getFunctionSyntax());
			AbstractCachedCommand function = AbstractCachedCommand.create(fr);
			context.put(id, fr);
			generator.add(id, function);
		} catch (FunctionParserException e) {
			throw new SAXParseException(e.getMessage(), locator, e);
		}
	}

	/**
	 * 
	 * @param id
	 * @throws SAXParseException
	 */
	private void parseId(String id) throws SAXParseException {
		char[] bfr = id.toCharArray();
		if (bfr.length == 0 || !Character.isJavaIdentifierStart(bfr[0]))
			throw new SAXParseException(id + " is not a valid identifier",
					locator);
		for (int i = 1; i < bfr.length; ++i)
			if (!Character.isJavaIdentifierPart(bfr[i]))
				throw new SAXParseException(id + " is not a valid identifier",
						locator);
		this.id = id;
	}

	/**
	 * 
	 * @throws SAXParseException
	 */
	private void parseUpdate() throws SAXParseException {
		try {
			VariableCommand v = generator.getVariable(id);
			if (v == null)
				throw new SAXParseException(
						"Variable \"" + id + "\" not found", locator);
			Command fr = context.parse(text.toString(), SyntaxFactory
					.getInstance().getFunctionSyntax());
			if (fr.getType() != v.getType()) {
				throw new SAXParseException("Update function return a " + id
						+ "\" not found", locator);
			}
			v.setUpdateFunction(fr);
		} catch (FunctionParserException e) {
			throw new SAXParseException(e.getMessage(), locator, e);
		}
	}

	/**
	 * 
	 * @throws SAXParseException
	 */
	private void parseVariable() throws SAXParseException {
		try {
			Command fr = context.parse(text.toString(), SyntaxFactory
					.getInstance().getFunctionSyntax());
			AbstractVariableCommand variable = AbstractVariableCommand.create(
					id, fr);
			context.put(id, variable);
			generator.add(id, variable);
		} catch (FunctionParserException e) {
			throw new SAXParseException(e.getMessage(), locator, e);
		}
	}

	/**
	 * @see org.xml.sax.helpers.DefaultHandler#setDocumentLocator(org.xml.sax.Locator
	 *      )
	 */
	@Override
	public void setDocumentLocator(Locator locator) {
		this.locator = locator;
	}

	/**
	 * @see org.xml.sax.helpers.DefaultHandler#startElement(java.lang.String,
	 *      java.lang.String, java.lang.String, org.xml.sax.Attributes)
	 */
	@Override
	public void startElement(String uri, String localName, String qName,
			Attributes attributes) throws SAXException {
		text.setLength(0);
		if (!NAME_SPACE.equals(uri))
			return;
		if (VARIABLE_KEY.equals(localName)) {
			parseId(attributes.getValue(ID_KEY));
		} else if (UPDATE_KEY.equals(localName)) {
			parseId(attributes.getValue(ID_KEY));
		} else if (FUNCTION_KEY.equals(localName)) {
			parseId(attributes.getValue(ID_KEY));
		}
	}
}
