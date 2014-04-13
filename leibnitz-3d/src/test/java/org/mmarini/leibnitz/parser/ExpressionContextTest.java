package org.mmarini.leibnitz.parser;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

import org.junit.Before;
import org.junit.Test;

public class ExpressionContextTest {

	private ExpressionInterpreter ctx;

	/**
	 * @param e
	 */
	protected void assertContains(final String text, final Exception e) {
		assertTrue(e.getMessage(), e.getMessage().indexOf(text) >= 0);
	}

	@Before
	public void setUp() {
		ctx = new ExpressionInterpreter();
	}

	@Test
	public void testChar() throws FunctionParserException {
		ctx.init("(");
		assertThat(ctx, hasProperty("token", equalTo("(")));
		assertThat(ctx.isInteger(), equalTo(false));
		assertThat(ctx.isNumber(), equalTo(false));
	}

	@Test
	public void testIdentifier() throws FunctionParserException {
		ctx.init("identifier");
		assertThat(ctx, hasProperty("token", equalTo("identifier")));
		assertThat(ctx.isInteger(), equalTo(false));
		assertThat(ctx.isNumber(), equalTo(false));
	}

	@Test
	public void testIsNumber1() throws FunctionParserException {
		ctx.init("123");
		assertThat(ctx, hasProperty("token", equalTo("123")));
		assertThat(ctx.isInteger(), equalTo(true));
		assertThat(ctx.isNumber(), equalTo(true));
	}

	@Test
	public void testIsNumber10() throws FunctionParserException {
		ctx.init("1.1e+1");
		assertThat(ctx, hasProperty("token", equalTo("1.1e+1")));
		assertThat(ctx.isInteger(), equalTo(false));
		assertThat(ctx.isNumber(), equalTo(true));
	}

	@Test
	public void testIsNumber11() throws FunctionParserException {
		ctx.init("1.1e-1");
		assertThat(ctx, hasProperty("token", equalTo("1.1e-1")));
		assertThat(ctx.isInteger(), equalTo(false));
		assertThat(ctx.isNumber(), equalTo(true));
	}

	@Test
	public void testIsNumber2() throws FunctionParserException {
		ctx.init("123.");
		assertThat(ctx, hasProperty("token", equalTo("123.")));
		assertThat(ctx.isInteger(), equalTo(false));
		assertThat(ctx.isNumber(), equalTo(true));
	}

	@Test
	public void testIsNumber4() throws FunctionParserException {
		ctx.init("123.123");
		assertThat(ctx, hasProperty("token", equalTo("123.123")));
		assertThat(ctx.isInteger(), equalTo(false));
		assertThat(ctx.isNumber(), equalTo(true));
	}

	@Test
	public void testIsNumber5() throws FunctionParserException {
		ctx.init(".123");
		assertThat(ctx, hasProperty("token", equalTo(".123")));
		assertThat(ctx.isInteger(), equalTo(false));
		assertThat(ctx.isNumber(), equalTo(true));
	}

	@Test
	public void testIsNumber6() throws FunctionParserException {
		ctx.init("1e1");
		assertThat(ctx, hasProperty("token", equalTo("1e1")));
		assertThat(ctx.isInteger(), equalTo(false));
		assertThat(ctx.isNumber(), equalTo(true));
	}

	@Test
	public void testIsNumber7() throws FunctionParserException {
		ctx.init("1.e1");
		assertThat(ctx, hasProperty("token", equalTo("1.e1")));
		assertThat(ctx.isInteger(), equalTo(false));
		assertThat(ctx.isNumber(), equalTo(true));
	}

	@Test
	public void testIsNumber8() throws FunctionParserException {
		ctx.init(".1e1");
		assertThat(ctx, hasProperty("token", equalTo(".1e1")));
		assertThat(ctx.isInteger(), equalTo(false));
		assertThat(ctx.isNumber(), equalTo(true));
	}

	@Test
	public void testIsNumber9() throws FunctionParserException {
		ctx.init("1.1e1");
		assertThat(ctx, hasProperty("token", equalTo("1.1e1")));
		assertThat(ctx.isInteger(), equalTo(false));
		assertThat(ctx.isNumber(), equalTo(true));
	}

	@Test
	public void testNextToken() throws FunctionParserException {
		ctx.init("a b c");
		assertThat(ctx, hasProperty("token", equalTo("a")));
		ctx.nextToken();
		assertThat(ctx, hasProperty("token", equalTo("b")));
		ctx.nextToken();
		assertThat(ctx, hasProperty("token", equalTo("c")));
		ctx.nextToken();
		assertThat(ctx, hasProperty("token", nullValue()));
	}

	@Test
	public void testSkipWhitespaces() throws FunctionParserException {
		ctx.init("   a");
		assertThat(ctx, hasProperty("token", equalTo("a")));
	}
}
