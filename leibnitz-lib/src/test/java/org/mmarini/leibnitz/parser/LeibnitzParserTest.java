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
			parser.parse("res/org/mmarini/leibnitz/parser/test1.xml");
		} catch (ParserConfigurationException e) {
			e.printStackTrace();
			fail(e.getMessage());
		} catch (SAXException e) {
			e.printStackTrace();
			fail(e.getMessage());
		} catch (IOException e) {
			e.printStackTrace();
			fail(e.getMessage());
		}
	}

}
