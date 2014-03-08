package org.mmarini.leibnitz.parser;

import static org.junit.Assert.fail;

import java.io.IOException;

import javax.xml.parsers.ParserConfigurationException;

import org.junit.Before;
import org.junit.Test;
import org.xml.sax.SAXException;

public class LeibnitzParserTest {

	private LeibnitzParser parser;

	@Before
	public void setUp() throws Exception {
		parser = new LeibnitzParser();
	}

	@Test
	public void testParse() {
		try {
			parser.parse("src/test/resources/org/mmarini/leibnitz/parser/test1.xml");
		} catch (final ParserConfigurationException e) {
			e.printStackTrace();
			fail(e.getMessage());
		} catch (final SAXException e) {
			e.printStackTrace();
			fail(e.getMessage());
		} catch (final IOException e) {
			e.printStackTrace();
			fail(e.getMessage());
		}
	}

}
