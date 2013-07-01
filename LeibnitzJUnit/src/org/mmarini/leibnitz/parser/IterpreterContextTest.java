package org.mmarini.leibnitz.parser;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import org.junit.Before;
import org.junit.Test;

public class IterpreterContextTest {

	private InterpreterContext ctx;

	/**
	 * @param e
	 */
	protected void assertContains(String text, Exception e) {
		assertTrue(e.getMessage(), e.getMessage().indexOf(text) >= 0);
	}

	@Before
	public void setUp() {
		ctx = new InterpreterContext();
		ctx.setDimension(3);
		ctx.setOrder(2);
	}

	@Test
	public void testChar() throws FunctionParserException {
		ctx.init("(");
		assertEquals("(", ctx.getToken());
		assertFalse(ctx.isInteger());
		assertFalse(ctx.isNumber());
	}

	@Test
	public void testIdentifier() throws FunctionParserException {
		ctx.init("identifier");
		assertEquals("identifier", ctx.getToken());
		assertFalse(ctx.isInteger());
		assertFalse(ctx.isNumber());
	}

	@Test
	public void testIsNumber1() throws FunctionParserException {
		ctx.init("123");
		assertEquals("123", ctx.getToken());
		assertTrue(ctx.isNumber());
		assertTrue(ctx.isInteger());
	}

	@Test
	public void testIsNumber10() throws FunctionParserException {
		ctx.init("1.1e+1");
		assertEquals("1.1e+1", ctx.getToken());
		assertTrue(ctx.isNumber());
		assertFalse(ctx.isInteger());
	}

	@Test
	public void testIsNumber11() throws FunctionParserException {
		ctx.init("1.1e-1");
		assertEquals("1.1e-1", ctx.getToken());
		assertTrue(ctx.isNumber());
		assertFalse(ctx.isInteger());
	}

	@Test
	public void testIsNumber2() throws FunctionParserException {
		ctx.init("123.");
		assertEquals("123.", ctx.getToken());
		assertTrue(ctx.isNumber());
		assertFalse(ctx.isInteger());
	}

	@Test
	public void testIsNumber3() throws FunctionParserException {
		ctx.init("123.");
		assertEquals("123.", ctx.getToken());
		assertTrue(ctx.isNumber());
		assertFalse(ctx.isInteger());
	}

	@Test
	public void testIsNumber4() throws FunctionParserException {
		ctx.init("123.123");
		assertEquals("123.123", ctx.getToken());
		assertTrue(ctx.isNumber());
		assertFalse(ctx.isInteger());
	}

	@Test
	public void testIsNumber5() throws FunctionParserException {
		ctx.init(".123");
		assertEquals(".123", ctx.getToken());
		assertTrue(ctx.isNumber());
		assertFalse(ctx.isInteger());
	}

	@Test
	public void testIsNumber6() throws FunctionParserException {
		ctx.init("1e1");
		assertEquals("1e1", ctx.getToken());
		assertTrue(ctx.isNumber());
		assertFalse(ctx.isInteger());
	}

	@Test
	public void testIsNumber7() throws FunctionParserException {
		ctx.init("1.e1");
		assertEquals("1.e1", ctx.getToken());
		assertTrue(ctx.isNumber());
		assertFalse(ctx.isInteger());
	}

	@Test
	public void testIsNumber8() throws FunctionParserException {
		ctx.init(".1e1");
		assertEquals(".1e1", ctx.getToken());
		assertTrue(ctx.isNumber());
		assertFalse(ctx.isInteger());
	}

	@Test
	public void testIsNumber9() throws FunctionParserException {
		ctx.init("1.1e1");
		assertEquals("1.1e1", ctx.getToken());
		assertTrue(ctx.isNumber());
		assertFalse(ctx.isInteger());
	}

	@Test
	public void testNextToken() throws FunctionParserException {
		ctx.init("a b c");
		assertEquals("a", ctx.getToken());
		ctx.nextToken();
		assertEquals("b", ctx.getToken());
		ctx.nextToken();
		assertEquals("c", ctx.getToken());
		ctx.nextToken();
		assertNull(ctx.getToken());
	}

	@Test
	public void testSkipWhitespaces() throws FunctionParserException {
		ctx.init("   a");
		assertEquals("a", ctx.getToken());
	}
}
