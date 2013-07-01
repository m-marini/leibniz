/**
 * 
 */
package org.mmarini.leibnitz.parser;

import org.mmarini.leibnitz.FunctionGenerator;
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
	public static final String NAME_SPACE = "http://www.mmarini.org/leibnitz-0-2-0";

	private static final String ORDER_KEY = "order";
	private static final String ID_KEY = "id";
	private static final String INIT_VALUE_KEY = "initValue";
	private static final String FUNCTION_KEY = "function";
	private static final String EQUATION_KEY = "equation";
	private static final String DIMENSION_KEY = "dimension";
	private static final String T0_KEY = "t0";
	private static final String T1_KEY = "t1";
	private static final String DT_KEY = "dt";
	private static final String OUTPUT_KEY = "output";
	private static final String LABEL_KEY = "label";

	private Locator locator;
	private StringBuilder text;
	private String id;
	private int orderParm;
	private InterpreterContext context;
	private FunctionGenerator generator;

	private String label;

	/**
	 * 
	 */
	public LeibnitzSaxHandler() {
		text = new StringBuilder();
		context = new InterpreterContext();
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
		switch (localName) {
		case DIMENSION_KEY:
			parseDimension();
			break;
		case ORDER_KEY:
			parseOrder();
			break;
		case INIT_VALUE_KEY:
			parseInitValue();
			break;
		case EQUATION_KEY:
			parseEquation();
			break;
		case FUNCTION_KEY:
			parseFunction();
			break;
		case OUTPUT_KEY:
			parseOutput();
			break;
		case T0_KEY:
			parseT0();
			break;
		case T1_KEY:
			parseT1();
			break;
		case DT_KEY:
			parseDT();
			break;
		default:
			break;
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
	 * @throws SAXParseException
	 * 
	 */
	private void parseDimension() throws SAXParseException {
		int dimension;
		try {
			dimension = Integer.parseInt(text.toString());
		} catch (NumberFormatException e) {
			throw new SAXParseException(e.getMessage(), locator, e);
		}
		context.setDimension(dimension);
	}

	/**
	 * 
	 * @throws SAXParseException
	 */
	private void parseDT() throws SAXParseException {
		double value;
		try {
			value = Double.parseDouble(text.toString());
		} catch (NumberFormatException e) {
			throw new SAXParseException(e.getMessage(), locator, e);
		}
		generator.setDt(value);
	}

	/**
	 * @throws SAXParseException
	 * 
	 */
	private void parseEquation() throws SAXParseException {
		try {
			FunctionDefinition fr = context.parse(text.toString(),
					SyntaxFactory.getInstance().getFunctionSyntax());
			if (!fr.isVector())
				throw new SAXParseException("Equation is not a vector", locator);
			int n = fr.getRowCount();
			int dim = context.getDimension();
			if (n != dim)
				throw new SAXParseException("Mismatch dimension " + n + "!="
						+ dim, locator);
			generator.setFunction(fr.getFunction());
		} catch (FunctionParserException e) {
			throw new SAXParseException(e.getMessage(), locator, e);
		}
	}

	/**
	 * @throws SAXParseException
	 * 
	 */
	private void parseFunction() throws SAXParseException {
		try {
			FunctionDefinition fr = context.parse(text.toString(),
					SyntaxFactory.getInstance().getFunctionSyntax());
			context.put(id, fr);
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
	 * @throws SAXParseException
	 * 
	 */
	private void parseInitValue() throws SAXParseException {
		try {
			FunctionDefinition fr = context.parse(text.toString(),
					SyntaxFactory.getInstance().getFunctionSyntax());
			if (!fr.isVector())
				throw new SAXParseException("Vector expected", locator);
			int n = fr.getRowCount();
			int dim = context.getDimension();
			if (n != dim)
				throw new SAXParseException("Mismatch dimension " + n + "!="
						+ dim, locator);
			fr.getFunction().apply(generator);

			generator.setQ(orderParm, generator.getVector());
		} catch (FunctionParserException e) {
			throw new SAXParseException(e.getMessage(), locator, e);
		}
	}

	/**
	 * @throws SAXParseException
	 * 
	 */
	private void parseOrder() throws SAXParseException {
		int order;
		try {
			order = Integer.parseInt(text.toString());
		} catch (NumberFormatException e) {
			throw new SAXParseException(e.getMessage(), locator, e);
		}
		context.setOrder(order);
		generator.setVariable(order, context.getDimension());
	}

	/**
	 * 
	 * @param value
	 * @throws SAXParseException
	 */
	private void parseOrderParm(String value) throws SAXParseException {
		if (value == null)
			orderParm = 0;
		else {
			try {
				orderParm = Integer.parseInt(value);
			} catch (NumberFormatException e) {
				throw new SAXParseException(e.getMessage(), locator, e);
			}
			int order = context.getOrder();
			if (orderParm >= order)
				throw new SAXParseException("Order parameter " + orderParm
						+ " >= order " + order, locator);
		}
	}

	/**
	 * @throws SAXParseException
	 * 
	 */
	private void parseOutput() throws SAXParseException {
		try {
			FunctionDefinition fr = context.parse(text.toString(),
					SyntaxFactory.getInstance().getFunctionSyntax());
			if (fr.isArray())
				throw new SAXParseException("Output must not be an array",
						locator);
			generator.addOutput(label, fr);
		} catch (FunctionParserException e) {
			throw new SAXParseException(e.getMessage(), locator, e);
		}
	}

	/**
	 * 
	 * @throws SAXParseException
	 */
	private void parseT0() throws SAXParseException {
		double value;
		try {
			value = Double.parseDouble(text.toString());
		} catch (NumberFormatException e) {
			throw new SAXParseException(e.getMessage(), locator, e);
		}
		generator.setT(value);
	}

	/**
	 * 
	 * @throws SAXParseException
	 */
	private void parseT1() throws SAXParseException {
		double value;
		try {
			value = Double.parseDouble(text.toString());
		} catch (NumberFormatException e) {
			throw new SAXParseException(e.getMessage(), locator, e);
		}
		generator.setT1(value);
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
		switch (localName) {
		case INIT_VALUE_KEY:
			parseOrderParm(attributes.getValue(ORDER_KEY));
			break;
		case FUNCTION_KEY:
			parseId(attributes.getValue(ID_KEY));
			break;
		case OUTPUT_KEY:
			label = attributes.getValue(LABEL_KEY);
			break;
		default:
			break;
		}
	}
}
