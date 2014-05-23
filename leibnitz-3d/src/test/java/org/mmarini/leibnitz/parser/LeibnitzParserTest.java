package org.mmarini.leibnitz.parser;

import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.instanceOf;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.fail;

import java.io.File;
import java.io.IOException;

import javax.xml.parsers.ParserConfigurationException;

import org.hamcrest.Matcher;
import org.junit.Before;
import org.junit.Test;
import org.mmarini.leibnitz.FunctionGenerator;
import org.xml.sax.SAXException;

public class LeibnitzParserTest {

	/**
	 * @param loc
	 * @param rot
	 * @return
	 */
	private static Matcher<CorpeDefs> corpe(final Matcher<String> loc,
			final Matcher<String> rot) {
		return allOf(instanceOf(CorpeDefs.class), hasProperty("location", loc),
				hasProperty("rotation", rot));
	}

	/**
	 * @param loc
	 * @param rot
	 * @return
	 */
	private static Matcher<CorpeDefs> corpe(final String loc, final String rot) {
		return corpe(equalTo(loc), equalTo(rot));
	}

	private LeibnitzParser parser;

	@Before
	public void setUp() throws Exception {
		parser = new LeibnitzParser();
	}

	@Test
	public void testParse() {
		try {

			final FunctionGenerator fg = parser
					.parse("src/test/resources/test1.xml");
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
		} catch (final FunctionParserException e) {
			e.printStackTrace();
			fail(e.getMessage());
		}
	}

	@Test
	public void testParseJson() {
		try {
			final FunctionGenerator fg = new LeibnitzJsonHandler()
					.parse(new File("src/test/resources/test1.json"));
			assertThat(fg, hasProperty("corpes", contains(corpe("R", "Rot"))));
		} catch (IOException | FunctionParserException e) {
			e.printStackTrace();
			fail(e.getMessage());
		}
	}
}
