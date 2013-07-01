package org.mmarini.leibnitz.parser;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import org.junit.Before;
import org.junit.Test;
import org.mmarini.leibnitz.Array;
import org.mmarini.leibnitz.FunctionGenerator;
import org.mmarini.leibnitz.Vector;
import org.mmarini.leibnitz.function.ArrayFunction;
import org.mmarini.leibnitz.function.Function;
import org.mmarini.leibnitz.function.ScalarFunction;
import org.mmarini.leibnitz.function.VectorFunction;

public class FunctionEvaluatorTest {
	private FunctionGenerator generator;
	private InterpreterContext ctx;
	private AbstractExpression functionSyntax;

	private void assertMessageContains(String msg, String pattern, Exception ex) {
		if (!ex.getMessage().contains(pattern)) {
			ex.printStackTrace();
			fail(msg + " Missing message " + pattern + " in " + ex.getMessage());
		}
	}

	/**
	 * 
	 * @param exp
	 * @param row
	 * @param col
	 * @param v00
	 */
	private void runArrayTest(String exp, int row, int col, double... v00) {
		assertEquals(exp, row * col, v00.length);
		FunctionDefinition res = null;
		try {
			res = ctx.parse(exp, functionSyntax);
		} catch (FunctionParserException e) {
			e.printStackTrace();
			fail(e.getMessage());
		}
		assertTrue(exp, res.isArray());
		assertEquals(exp, row, res.getRowCount());
		assertEquals(exp, col, res.getColCount());
		Function function = res.getFunction();
		function.apply(generator);
		Array a = generator.getArray();
		int idx = 0;
		for (int i = 0; i < row; ++i)
			for (int j = 0; j < col; ++j)
				assertEquals(exp + " i=" + i + ",j=" + j, v00[idx++],
						a.getValue(i, j), 1e-10);
	}

	private void runExceptionTest(String exp, String pattern) {
		try {
			ctx.parse(exp, functionSyntax);
			fail(exp + " Missing exception");
		} catch (FunctionParserException e) {
			assertMessageContains(exp, pattern, e);
		}
	}

	private void runScalarTest(String exp, double v) {
		FunctionDefinition res = null;
		try {
			res = ctx.parse(exp, functionSyntax);
		} catch (FunctionParserException e) {
			e.printStackTrace();
			fail(e.getMessage());
		}
		assertTrue(exp, res.isScalar());
		Function function = res.getFunction();
		function.apply(generator);
		assertEquals(exp, v, generator.getScalar(), 1e-10);
	}

	/**
	 * 
	 * @param exp
	 * @param v0
	 */
	private void runVectorTest(String exp, double... v0) {
		FunctionDefinition res = null;
		try {
			res = ctx.parse(exp, functionSyntax);
		} catch (FunctionParserException e) {
			e.printStackTrace();
			fail(e.getMessage());
		}
		assertTrue(exp, res.isVector());
		assertEquals(exp, v0.length, res.getRowCount());
		Function function = res.getFunction();
		function.apply(generator);
		Vector v = generator.getVector();
		for (int i = 0; i < v0.length; ++i)
			assertEquals(exp + " i=" + i, v0[i], v.getValue(i), 1e-10);
	}

	@Before
	public void setUp() throws Exception {
		generator = new FunctionGenerator();
		generator.setVariable(2, 3);

		Vector v124 = new Vector(3);
		v124.setValues(0, 1);
		v124.setValues(1, 2);
		v124.setValues(2, 4);

		Vector v248 = new Vector(3);
		v248.setValues(0, 2);
		v248.setValues(1, 4);
		v248.setValues(2, 8);

		generator.setParameter(0, v124);
		generator.setParameter(1, v248);

		ctx = new InterpreterContext();
		ctx.setDimension(3);
		ctx.setOrder(2);
		functionSyntax = SyntaxFactory.getInstance().getFunctionSyntax();

		ctx.put("s", new FunctionDefinition(new ScalarFunction(2)));

		ctx.put("V", new FunctionDefinition(new VectorFunction(v124), 3));

		Array a = new Array(3, 3);
		a.setValues(0, 0, 4);
		a.setValues(1, 1, 4);
		a.setValues(2, 2, 4);
		ctx.put("A", new FunctionDefinition(new ArrayFunction(a), 3, 3));
	}

	@Test
	public void testACosA() {
		runExceptionTest("acos I3", "check for scalar");
	}

	@Test
	public void testACosS() {
		runScalarTest("acos 0.5", Math.PI / 3);
	}

	@Test
	public void testACosV() {
		runExceptionTest("acos e0", "check for scalar");
	}

	@Test
	public void testAddAA() {
		runArrayTest("I3+I3", 3, 3, 2, 0, 0, 0, 2, 0, 0, 0, 2);
	}

	@Test
	public void testAddAA3334() {
		runExceptionTest("I3+T(I3;e2)", "add mismatch dimension 3x3!=3x4");
	}

	@Test
	public void testAddAA3343() {
		runExceptionTest("I3+(I3;e2)", "add mismatch dimension 3x3!=4x3");
	}

	@Test
	public void testAddAA4343() {
		runArrayTest("(I3;e2)+(I3;e2)", 4, 3, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0,
				2);
	}

	@Test
	public void testAddAS() {
		runExceptionTest("I3+1", "check for array");
	}

	@Test
	public void testAddAV() {
		runExceptionTest("I3+e1", "check for array");
	}

	@Test
	public void testAddSA() {
		runExceptionTest("1+I3", "check for scalar");
	}

	@Test
	public void testAddSS() {
		runScalarTest("1+2", 3);
	}

	@Test
	public void testAddSV() {
		runExceptionTest("1+e0", "check for scalar");
	}

	@Test
	public void testAddVS() {
		runExceptionTest("e2+1", "check for vector");
	}

	@Test
	public void testAddVV() {
		runVectorTest("e0+e2", 1, 0, 1);
	}

	@Test
	public void testAppendAA() {
		runArrayTest("I3;I3", 6, 3, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1,
				0, 0, 0, 1);
	}

	@Test
	public void testAppendAA3334() {
		runExceptionTest("I3;T(I3;e2)", "append mismatch dimension 3!=4");
	}

	@Test
	public void testAppendAS() {
		runExceptionTest("I3;1", "check for not scalar");
	}

	@Test
	public void testAppendAV() {
		runArrayTest("I3;e2", 4, 3, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1);
	}

	@Test
	public void testAppendAV332() {
		runExceptionTest("I3;T(I3;e1)", "append mismatch dimension 3!=2");
	}

	@Test
	public void testAppendSA() {
		runExceptionTest("1;I3", "check for not scalar");
	}

	@Test
	public void testAppendSS() {
		runExceptionTest("1;1", "check for not scalar");
	}

	@Test
	public void testAppendSV() {
		runExceptionTest("1;e2", "check for not scalar");
	}

	@Test
	public void testAppendVA() {
		runExceptionTest("e2;I3", "check for vector");
	}

	@Test
	public void testAppendVS() {
		runExceptionTest("e2;1", "check for not scalar");
	}

	@Test
	public void testAppendVV() {
		runArrayTest("e2;e2", 2, 3, 0, 0, 1, 0, 0, 1);
	}

	@Test
	public void testAppendVV13() {
		runExceptionTest("e0;e2", "append mismatch dimension 1!=3");
	}

	@Test
	public void testAppendVV31() {
		runExceptionTest("e2;e0", "append mismatch dimension 3!=1");
	}

	@Test
	public void testASinA() {
		runExceptionTest("asin I3", "check for scalar");
	}

	@Test
	public void testASinS() {
		runScalarTest("asin(0.5)", Math.PI / 6);
	}

	@Test
	public void testASinV() {
		runExceptionTest("asin e0", "check for scalar");
	}

	@Test
	public void testATanA() {
		runExceptionTest("atan I3", "check for scalar");
	}

	@Test
	public void testATanS() {
		runScalarTest("atan 1", Math.PI / 4);
	}

	@Test
	public void testATanV() {
		runExceptionTest("atan e0", "check for scalar");
	}

	@Test
	public void testBase0() {
		runVectorTest("e0", 1);
	}

	@Test
	public void testBase2() {
		runVectorTest("e2", 0, 0, 1);
	}

	@Test
	public void testCosA() {
		runExceptionTest("cos I3", "check for scalar");
	}

	@Test
	public void testCoshA() {
		runExceptionTest("cosh I3", "check for scalar");
	}

	@Test
	public void testCoshS() {
		runScalarTest("cosh 0", 1);
	}

	@Test
	public void testCoshV() {
		runExceptionTest("cosh e0", "check for scalar");
	}

	@Test
	public void testCosS() {
		runScalarTest("cos(PI/3)", 0.5);
	}

	@Test
	public void testCosV() {
		runExceptionTest("cos e0", "check for scalar");
	}

	@Test
	public void testDeterminerA() {
		runScalarTest("det(e0-e1+e2;e0+e1-e2;2*(e0+e1+e2))", 2);
	}

	@Test
	public void testDeterminerA23() {
		runExceptionTest("det(e0-e1+e2;e0+e1-e2)",
				"determiner mismatch dimension 2!=3");
	}

	@Test
	public void testDeterminerAnAn() {
		runScalarTest("det(e0+e1+e2;2*(e0+e1+e2);e0-e1+e2)", 0);
	}

	@Test
	public void testDeterminerS() {
		runExceptionTest("det 0", "check for array");
	}

	@Test
	public void testDeterminerV() {
		runExceptionTest("det e0", "check for array");
	}

	@Test
	public void testDivAA() {
		runExceptionTest("I3/I3", "check for scalar");
	}

	@Test
	public void testDivAS() {
		runArrayTest("I3/2", 3, 3, 0.5, 0, 0, 0, 0.5, 0, 0, 0, 0.5);
	}

	@Test
	public void testDivAV() {
		runExceptionTest("I3/e0", "check for scalar");
	}

	@Test
	public void testDivSA() {
		runExceptionTest("2/I3", "check for scalar");
	}

	@Test
	public void testDivSS() {
		runScalarTest("1/2", 0.5);
	}

	@Test
	public void testDivSV() {
		runExceptionTest("2/e0", "check for scalar");
	}

	@Test
	public void testDivVA() {
		runExceptionTest("e0/I3", "check for scalar");
	}

	@Test
	public void testDivVS() {
		runVectorTest("e2/2", 0, 0, 0.5);
	}

	@Test
	public void testDivVV() {
		runExceptionTest("e0/e0", "check for scalar");
	}

	@Test
	public void testE() {
		runScalarTest("E", Math.E);
	}

	@Test
	public void testExpA() {
		runExceptionTest("exp I3", "check for scalar");
	}

	@Test
	public void testExpS() {
		runScalarTest("exp 0", 1);
	}

	@Test
	public void testExpV() {
		runExceptionTest("exp e0", "check for scalar");
	}

	@Test
	public void testFunctionA() {
		runArrayTest("A", 3, 3, 4, 0, 0, 0, 4, 0, 0, 0, 4);
	}

	@Test
	public void testFunctionS() {
		runScalarTest("s", 2);
	}

	@Test
	public void testFunctionUndefined() {
		runExceptionTest("S", "undefined function S");
	}

	@Test
	public void testFunctionV() {
		runVectorTest("V", 1, 2, 4);
	}

	@Test
	public void testIdentity() {
		runArrayTest("I3", 3, 3, 1, 0, 0, 0, 1, 0, 0, 0, 1);
	}

	@Test
	public void testinverseA() {
		runArrayTest("inv(e0-e1+e2;e0+e1-e2;2*(e0+e1+e2))", 3, 3, 0.5, 0.5, 0.,
				-0.5, 0, 0.25, 0, -0.5, 0.25);
	}

	@Test
	public void testinverseA43() {
		runExceptionTest("inv(I3;e2)", "inverse mismatch dimension 4!=3");
	}

	@Test
	public void testinverseAIA() {
		runArrayTest(
				"(e0-e1+e2;e0+e1-e2;2*(e0+e1+e2))*inv(e0-e1+e2;e0+e1-e2;2*(e0+e1+e2))",
				3, 3, 1, 0, 0, 0, 1, 0, 0, 0, 1);
	}

	@Test
	public void testinverseAnAn() {
		runArrayTest("inv(e0+e1+e2;2*(e0+e1+e2);e0+e1-e2)", 3, 3, Double.NaN,
				Double.NaN, Double.NaN, Double.NaN, Double.NaN, Double.NaN,
				Double.NaN, Double.NaN, Double.NaN);
	}

	@Test
	public void testinverseIAA() {
		runArrayTest(
				"inv(e0-e1+e2;e0+e1-e2;2*(e0+e1+e2))*(e0-e1+e2;e0+e1-e2;2*(e0+e1+e2))",
				3, 3, 1, 0, 0, 0, 1, 0, 0, 0, 1);
	}

	@Test
	public void testinverseS() {
		runExceptionTest("inv 1", "check for array");
	}

	@Test
	public void testinverseV() {
		runExceptionTest("inv e0", "check for array");
	}

	@Test
	public void testLogA() {
		runExceptionTest("log I3", "check for scalar");
	}

	@Test
	public void testLogS() {
		runScalarTest("log 1", 0);
	}

	@Test
	public void testLogV() {
		runExceptionTest("log e0", "check for scalar");
	}

	@Test
	public void testModuleA() {
		runExceptionTest("|I3|", "check for not array");
	}

	@Test
	public void testModuleS() {
		runScalarTest("|2|", 2);
	}

	@Test
	public void testModuleV() {
		runScalarTest("|e0+e2|", Math.sqrt(2));
	}

	@Test
	public void testMulAA() {
		runArrayTest("I3*I3", 3, 3, 1, 0, 0, 0, 1, 0, 0, 0, 1);
	}

	@Test
	public void testMulAA3343() {
		runExceptionTest("I3*(I3;e2)", "product mismatch dimension 3!=4");
	}

	@Test
	public void testMulAA3443() {
		runArrayTest("(T(I3;e2))*(I3;e2)", 3, 3, 1, 0, 0, 0, 1, 0, 0, 0, 2);
	}

	@Test
	public void testMulAS() {
		runArrayTest("I3*2", 3, 3, 2, 0, 0, 0, 2, 0, 0, 0, 2);
	}

	@Test
	public void testMulSA() {
		runArrayTest("2*I3", 3, 3, 2, 0, 0, 0, 2, 0, 0, 0, 2);
	}

	@Test
	public void testMulSS() {
		runScalarTest("2*3", 6);
	}

	@Test
	public void testMulSV() {
		runVectorTest("2*e2", 0, 0, 2);
	}

	@Test
	public void testMulVS() {
		runVectorTest("e2*2", 0, 0, 2);
	}

	@Test
	public void testMulVV() {
		runScalarTest("e2*e2", 1);
	}

	@Test
	public void testMulVV13() {
		runExceptionTest("e0*e2", "product mismatch dimension 1!=3");
	}

	@Test
	public void testnegateA() {
		runArrayTest("-I3", 3, 3, -1, 0, 0, 0, -1, 0, 0, 0, -1);
	}

	@Test
	public void testnegateS() {
		runScalarTest("-1", -1);
	}

	@Test
	public void testnegateV() {
		runVectorTest("-e2", 0, 0, -1);
	}

	@Test
	public void testnumber() {
		runScalarTest("0", 0);
	}

	@Test
	public void testPI() {
		runScalarTest("PI", Math.PI);
	}

	@Test
	public void testPowerAA() {
		runExceptionTest("I3^I3", "check for scalar");
	}

	@Test
	public void testPowerAS() {
		runExceptionTest("I3^2", "check for scalar");
	}

	@Test
	public void testPowerAV() {
		runExceptionTest("I3^e0", "check for scalar");
	}

	@Test
	public void testPowerSA() {
		runExceptionTest("2^I3", "check for scalar");
	}

	@Test
	public void testPowerSS() {
		runScalarTest("2^4", 16);
	}

	@Test
	public void testPowerSV() {
		runExceptionTest("2^e0", "check for scalar");
	}

	@Test
	public void testPowerVA() {
		runExceptionTest("e0^I3", "check for scalar");
	}

	@Test
	public void testPowerVS() {
		runExceptionTest("e0^2", "check for scalar");
	}

	@Test
	public void testQ() {
		runVectorTest("q", 1, 2, 4);
	}

	@Test
	public void testQ1() {
		runVectorTest("q1", 2, 4, 8);
	}

	@Test
	public void testQ2() {
		runExceptionTest("q2", ">= order");
	}

	@Test
	public void testSinA() {
		runExceptionTest("sin I3", "check for scalar");
	}

	@Test
	public void testSinhA() {
		runExceptionTest("sinh I3", "check for scalar");
	}

	@Test
	public void testSinhS() {
		runScalarTest("sinh 0", 0);
	}

	@Test
	public void testSinhV() {
		runExceptionTest("sinh e0", "check for scalar");
	}

	@Test
	public void testSinS() {
		runScalarTest("sin(PI/6)", 0.5);
	}

	@Test
	public void testSinV() {
		runExceptionTest("sin e0", "check for scalar");
	}

	@Test
	public void testSqrtA() {
		runExceptionTest("sqrt I3", "check for scalar");
	}

	@Test
	public void testSqrtS() {
		runScalarTest("sqrt 4", 2);
	}

	@Test
	public void testSqrtV() {
		runExceptionTest("sqrt e0", "check for scalar");
	}

	@Test
	public void testSubAA() {
		runArrayTest("I3-I3", 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0);
	}

	@Test
	public void testSubAA3334() {
		runExceptionTest("I3-T(I3;e2)", "subtract mismatch dimension 3x3!=3x4");
	}

	@Test
	public void testSubAA3343() {
		runExceptionTest("I3-(I3;e2)", "subtract mismatch dimension 3x3!=4x3");
	}

	@Test
	public void testSubAA4343() {
		runArrayTest("(I3;e2)-(I3;e2)", 4, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
				0);
	}

	@Test
	public void testSubAS() {
		runExceptionTest("I3-1", "check for array");
	}

	@Test
	public void testSubAV() {
		runExceptionTest("I3-e1", "check for array");
	}

	@Test
	public void testSubSA() {
		runExceptionTest("1-I3", "check for scalar");
	}

	@Test
	public void testSubSS() {
		runScalarTest("1-2", -1);
	}

	@Test
	public void testSubSV() {
		runExceptionTest("1-e2", "check for scalar");
	}

	@Test
	public void testSubVS() {
		runExceptionTest("e2-1", "check for vector");
	}

	@Test
	public void testSubVV() {
		runVectorTest("e0-e2", 1, 0, -1);
	}

	@Test
	public void testTanA() {
		runExceptionTest("tan I3", "check for scalar");
	}

	@Test
	public void testTanhA() {
		runExceptionTest("tanh I3", "check for scalar");
	}

	@Test
	public void testTanhS() {
		runScalarTest("tanh 0", 0);
	}

	@Test
	public void testTanhV() {
		runExceptionTest("tanh e0", "check for scalar");
	}

	@Test
	public void testTanS() {
		runScalarTest("tan(PI/4)", 1);
	}

	@Test
	public void testTanV() {
		runExceptionTest("tan e0", "check for scalar");
	}

	@Test
	public void testTParm() {
		runScalarTest("t", 0);
	}

	@Test
	public void testTraceA() {
		runScalarTest("tr(I3)", 3);
	}

	@Test
	public void testTraceA34() {
		runExceptionTest("tr(I3;e2)", "trace mismatch dimension 4!=3");
	}

	@Test
	public void testTraceS() {
		runScalarTest("tr(2)", 4.);
	}

	@Test
	public void testTraceV() {
		runScalarTest("tr(e2)", 1);
	}

	@Test
	public void testTransposeA() {
		runArrayTest("T(e0+e1+e2;0*e2)", 3, 2, 1, 0, 1, 0, 1, 0);
	}

	@Test
	public void testTransposeS() {
		runExceptionTest("T 1", "check for array");
	}

	@Test
	public void testTransposeV() {
		runExceptionTest("T e0", "check for array");
	}

	@Test
	public void testVersusA() {
		runExceptionTest("n(I3)", "check for vector");
	}

	@Test
	public void testVersusS() {
		runExceptionTest("n(1)", "check for vector");
	}

	@Test
	public void testVersusV() {
		runVectorTest("n(e0+e1+e2)", Math.sqrt(1. / 3), Math.sqrt(1. / 3),
				Math.sqrt(1. / 3));
	}
}