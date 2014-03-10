package org.mmarini.leibnitz.parser;

import static org.junit.Assert.*;
import static org.hamcrest.Matchers.*;

import java.io.IOException;

import javax.xml.parsers.ParserConfigurationException;

import org.hamcrest.Matcher;
import org.junit.Before;
import org.junit.Test;
import org.mmarini.leibnitz.FunctionGenerator;
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

			FunctionGenerator fg = parser.parse("src/test/resources/test1.xml");
			assertThat(fg, hasProperty("corpes", contains(corpe("R", "Rot"))));

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

	/**
	 * @param loc
	 * @param rot
	 * @return
	 */
	private static Matcher<CorpeDefs> corpe(String loc, String rot) {
		return corpe(equalTo(loc), equalTo(rot));
	}

	/**
	 * @param loc
	 * @param rot
	 * @return
	 */
	private static Matcher<CorpeDefs> corpe(Matcher<String> loc,
			Matcher<String> rot) {
		return allOf(instanceOf(CorpeDefs.class), hasProperty("location", loc),
				hasProperty("rotation", rot));
	}

}
