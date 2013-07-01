/**
 * 
 */
package org.mmarini.leibnitz.parser;

import org.mmarini.leibnitz.Array;
import org.mmarini.leibnitz.Vector;
import org.mmarini.leibnitz.function.ACosFunction;
import org.mmarini.leibnitz.function.ASinFunction;
import org.mmarini.leibnitz.function.ATanFunction;
import org.mmarini.leibnitz.function.AddArrayFunction;
import org.mmarini.leibnitz.function.AddScalarFunction;
import org.mmarini.leibnitz.function.AddVectorFunction;
import org.mmarini.leibnitz.function.AppendArrayArrayFunction;
import org.mmarini.leibnitz.function.AppendArrayFunction;
import org.mmarini.leibnitz.function.AppendVectorFunction;
import org.mmarini.leibnitz.function.ArrayFunction;
import org.mmarini.leibnitz.function.ArrayProductFunction;
import org.mmarini.leibnitz.function.ArrayVectorProductFunction;
import org.mmarini.leibnitz.function.CosFunction;
import org.mmarini.leibnitz.function.CoshFunction;
import org.mmarini.leibnitz.function.DeterminerFunction;
import org.mmarini.leibnitz.function.DivideArrayFunction;
import org.mmarini.leibnitz.function.DivideScalarFunction;
import org.mmarini.leibnitz.function.DivideVectorFunction;
import org.mmarini.leibnitz.function.ExpFunction;
import org.mmarini.leibnitz.function.Function;
import org.mmarini.leibnitz.function.InverseFunction;
import org.mmarini.leibnitz.function.LogFunction;
import org.mmarini.leibnitz.function.ModuleFunction;
import org.mmarini.leibnitz.function.MultiplyFunction;
import org.mmarini.leibnitz.function.NegateArrayFunction;
import org.mmarini.leibnitz.function.NegateScalarFunction;
import org.mmarini.leibnitz.function.NegateVectorFunction;
import org.mmarini.leibnitz.function.PowerFunction;
import org.mmarini.leibnitz.function.ScalarFunction;
import org.mmarini.leibnitz.function.ScalarParameterFunction;
import org.mmarini.leibnitz.function.ScalarProduct;
import org.mmarini.leibnitz.function.ScaleArrayFunction;
import org.mmarini.leibnitz.function.ScaleVectorFunction;
import org.mmarini.leibnitz.function.SinFunction;
import org.mmarini.leibnitz.function.SinhFunction;
import org.mmarini.leibnitz.function.SqrtFunction;
import org.mmarini.leibnitz.function.SubArrayFunction;
import org.mmarini.leibnitz.function.SubScalarFunction;
import org.mmarini.leibnitz.function.SubVectorFunction;
import org.mmarini.leibnitz.function.TanFunction;
import org.mmarini.leibnitz.function.TanhFunction;
import org.mmarini.leibnitz.function.TraceArrayFunction;
import org.mmarini.leibnitz.function.TraceScalarFunction;
import org.mmarini.leibnitz.function.TraceVectFunction;
import org.mmarini.leibnitz.function.TransposeFunction;
import org.mmarini.leibnitz.function.VectorFunction;
import org.mmarini.leibnitz.function.VectorParameterFunction;
import org.mmarini.leibnitz.function.VersusFunction;

/**
 * <pre>
 * 
 * exp := sum expSuffix
 * 
 * expSuffix := ';' sum expSuffix
 * expSuffix := EMPTY
 * 
 * sum := factor sumSuffix
 * 
 * sumSuffix := '+' factor sumSuffix
 * sumSuffix := '-' factor sumSuffix
 * sumSuffix := EMPTY
 * 
 * factor := unary factorSuffix
 * 
 * factorSuffix := '*' unary factorSuffix
 * factorSuffix := '/' unary factorSuffix
 * factorSuffix := EMPTY
 * 
 * unary := '+' unary
 * unary := '-' unary
 * unary := 'tr' unary
 * unary := 'det' unary
 * unary := 'n' unary
 * unary := 'T' unary
 * unary := 'inv' unary
 * unary := 'exp' unary
 * unary := 'sinh' unary
 * unary := 'cosh' unary
 * unary := 'tanh' unary
 * unary := 'sin' unary
 * unary := 'cos' unary
 * unary := 'tan' unary
 * unary := 'asin' unary
 * unary := 'acos' unary
 * unary := 'atan' unary
 * unary := 'log' unary
 * unary := 'sqrt' unary
 * unary := power
 * 
 * power := term powerSuffix
 * 
 * powerSuffix := '^' term powerSuffix
 * powerSuffix := EMPTY
 * 
 * term := '(' exp ')'
 * term := '|' exp '|'
 * term := 't'
 * term := 'I'
 * constTerm := 'e' index
 * constTerm := 'E'
 * constTerm := 'PI'
 * term := 'q' order
 * term := id
 * term := number
 * 
 * index := digits
 * 
 * order := digitsOps
 * 
 * id := identifierChar idSuffix
 * 
 * idSuffix := identifierChar idSuffix
 * idSuffix := EMPTY
 * 
 * number := digits fractOpt exponent
 * number := fract exponent
 * 
 * fract := '.' digits
 * 
 * fractOpt := '.' digitsOpt
 * fractOpt := EMPTY
 * 
 * exponent := 'e' exponentSuffix
 * exponent := 'E' exponentSuffix
 * exponent := EMPTY
 * 
 * exponentSuffix := '+' digits
 * exponentSuffix := '-' digits
 * exponentSuffix := digits
 * 
 * digits := digit digitsOpt
 * 
 * digitsOpt := digit digitOpt
 * digitsOpt := EMPTY
 * 
 * digit := '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
 * 
 * </pre>
 * 
 * @author US00852
 * 
 */
public class SyntaxFactory {
	private static final TokenExpression OPT_Q_TOKEN = new TokenExpression("q",
			false);
	private static final TokenExpression OPT_T_LOW_TOKEN = new TokenExpression(
			"t", false);
	private static final TokenExpression OPT_SLASH_TOKEN = new TokenExpression(
			"/", false);
	private static final TokenExpression OPT_STAR_TOKEN = new TokenExpression(
			"*", false);
	private static final TokenExpression VBAR_TOKEN = new TokenExpression("|");
	private static final TokenExpression OPT_VBAR_TOKEN = new TokenExpression(
			"|", false);
	private static final TokenExpression OPT_CAP_TOKEN = new TokenExpression(
			"^", false);
	private static final TokenExpression OPT_N_TOKEN = new TokenExpression("n",
			false);
	private static final TokenExpression OPT_TRACE_TOKEN = new TokenExpression(
			"tr", false);
	private static final TokenExpression OPT_SEMICOMMA_TOKEN = new TokenExpression(
			";", false);
	private static final TokenExpression OPT_MINUS_TOKEN = new TokenExpression(
			"-", false);
	private static final TokenExpression OPT_PLUS_TOKEN = new TokenExpression(
			"+", false);
	private static final TokenExpression CLOSE_BRACKET_TOKEN = new TokenExpression(
			")");
	private static final TokenExpression OPT_OPEN_BRACKET_TOKEN = new TokenExpression(
			"(", false);
	private static final TokenExpression OPT_T_TOKEN = new TokenExpression("T",
			false);
	private static final TokenExpression OPT_PI_TOKEN = new TokenExpression(
			"PI", false);
	private static final TokenExpression OPT_E_TOKEN = new TokenExpression("E",
			false);
	private static final TokenExpression OPT_INV_TOKEN = new TokenExpression(
			"inv", false);
	private static final TokenExpression OPT_DET_TOKEN = new TokenExpression(
			"det", false);
	private static final TokenExpression OPT_SIN_TOKEN = new TokenExpression(
			"sin", false);
	private static final TokenExpression OPT_SINH_TOKEN = new TokenExpression(
			"sinh", false);
	private static final TokenExpression OPT_ASIN_TOKEN = new TokenExpression(
			"asin", false);
	private static final TokenExpression OPT_COS_TOKEN = new TokenExpression(
			"cos", false);
	private static final TokenExpression OPT_ACOS_TOKEN = new TokenExpression(
			"acos", false);
	private static final TokenExpression OPT_COSH_TOKEN = new TokenExpression(
			"cosh", false);
	private static final TokenExpression OPT_TAN_TOKEN = new TokenExpression(
			"tan", false);
	private static final TokenExpression OPT_ATAN_TOKEN = new TokenExpression(
			"atan", false);
	private static final TokenExpression OPT_TANH_TOKEN = new TokenExpression(
			"tanh", false);
	private static final TokenExpression OPT_EXP_TOKEN = new TokenExpression(
			"exp", false);
	private static final TokenExpression OPT_LOG_TOKEN = new TokenExpression(
			"log", false);
	private static final TokenExpression OPT_SQRT_TOKEN = new TokenExpression(
			"sqrt", false);
	private static final AbstractExpression END_EXPRESSION = new AbstractExpression(
			"<eof>") {

		/**
		 * @see org.mmarini.leibnitz.parser.AbstractExpression#interpret(org.mmarini
		 *      .leibnitz.parser.InterpreterContext)
		 */
		@Override
		public boolean interpret(InterpreterContext context)
				throws FunctionParserException {
			if (context.getToken() != null)
				throw context.generateParseException(this);
			return true;
		}
	};
	private static final AbstractExpression NUMBER = new AbstractExpression(
			"number") {

		@Override
		public boolean interpret(InterpreterContext context)
				throws FunctionParserException {
			if (!context.isNumber())
				throw context.generateParseException(this);
			String token = context.getToken();
			context.nextToken();
			double value = Double.parseDouble(token);
			context.push(new FunctionDefinition(new ScalarFunction(value)));
			return true;
		}
	};

	private static final AbstractExpression NONE = new AbstractExpression(
			"none") {

		@Override
		public boolean interpret(InterpreterContext context)
				throws FunctionParserException {
			return true;
		}
	};
	private static final IndexedIdentifier IDENTITY = new IndexedIdentifier(
			"identity", "I") {
		/**
		 * @see org.mmarini.leibnitz.parser.TokenExpression#interpret(org.mmarini.leibnitz.parser.InterpreterContext)
		 */
		@Override
		public boolean interpret(InterpreterContext context)
				throws FunctionParserException {
			if (!super.interpret(context))
				return false;
			int n = getIndex();
			Array i = new Array(n, n);
			i.setIdentity();
			context.push(new FunctionDefinition(new ArrayFunction(i), n, n));
			return true;
		}
	};

	private static final IndexedIdentifier Q_ORDER_PARM = new IndexedIdentifier(
			"qOrder", "q") {
		/**
		 * @see org.mmarini.leibnitz.parser.TokenExpression#interpret(org.mmarini.leibnitz.parser.InterpreterContext)
		 */
		@Override
		public boolean interpret(InterpreterContext context)
				throws FunctionParserException {
			if (!super.interpret(context))
				return false;
			int n = getIndex();
			int order = context.getOrder();
			if (n >= order)
				throw context.generateParseException("parameter order " + n
						+ " >= order " + order);
			context.push(new FunctionDefinition(new VectorParameterFunction(n),
					context.getDimension()));
			return true;
		}
	};

	private static final AbstractExpression CHECK_FOR_VECTOR = new AbstractExpression(
			"check for vector") {

		@Override
		public boolean interpret(InterpreterContext context)
				throws FunctionParserException {
			if (!context.peek().isVector())
				throw context.generateParseException(this);
			return true;
		}
	};
	private static final AbstractExpression CHECK_FOR_ARRAY = new AbstractExpression(
			"check for array") {

		@Override
		public boolean interpret(InterpreterContext context)
				throws FunctionParserException {
			if (!context.peek().isArray())
				throw context.generateParseException(this);
			return true;
		}
	};
	private static final AbstractExpression CHECK_FOR_NOT_ARRAY = new AbstractExpression(
			"check for not array") {

		@Override
		public boolean interpret(InterpreterContext context)
				throws FunctionParserException {
			if (context.peek().isArray())
				throw context.generateParseException(this);
			return true;
		}
	};

	private static final AbstractExpression CHECK_FOR_SCALAR = new AbstractExpression(
			"check for scalar") {

		@Override
		public boolean interpret(InterpreterContext context)
				throws FunctionParserException {
			if (!context.peek().isScalar())
				throw context.generateParseException(this);
			return true;
		}
	};
	private static final AbstractExpression CHECK_FOR_NOT_SCALAR = new AbstractExpression(
			"check for not scalar") {

		@Override
		public boolean interpret(InterpreterContext context)
				throws FunctionParserException {
			if (context.peek().isScalar())
				throw context.generateParseException(this);
			return true;
		}
	};
	private static final AbstractExpression MODULE_CMD = new AbstractExpression(
			"module") {

		/**
		 * @see org.mmarini.leibnitz.parser.TokenExpression#interpret(org.mmarini.leibnitz.parser.InterpreterContext)
		 */
		@Override
		public boolean interpret(InterpreterContext context)
				throws FunctionParserException {
			FunctionDefinition p1 = context.pool();
			if (p1.isVector())
				p1 = new FunctionDefinition(
						new ModuleFunction(p1.getFunction()));
			context.push(p1);
			return true;
		}
	};
	private static final AbstractExpression POWER_CMD = new AbstractExpression(
			"power") {

		/**
		 * @see org.mmarini.leibnitz.parser.TokenExpression#interpret(org.mmarini.leibnitz.parser.InterpreterContext)
		 */
		@Override
		public boolean interpret(InterpreterContext context)
				throws FunctionParserException {
			Function exp = context.pool().getFunction();
			Function base = context.pool().getFunction();
			context.push(new FunctionDefinition(new PowerFunction(base, exp)));
			return true;
		}
	};
	private static final AbstractExpression E_CMD = new AbstractExpression(
			"eCommand") {

		/**
		 * @see org.mmarini.leibnitz.parser.TokenExpression#interpret(org.mmarini.leibnitz.parser.InterpreterContext)
		 */
		@Override
		public boolean interpret(InterpreterContext context)
				throws FunctionParserException {
			context.push(new FunctionDefinition(new ScalarFunction(Math.E)));
			return true;
		}
	};
	private static final AbstractExpression PI_CMD = new AbstractExpression(
			"piCommand") {

		/**
		 * @see org.mmarini.leibnitz.parser.TokenExpression#interpret(org.mmarini.leibnitz.parser.InterpreterContext)
		 */
		@Override
		public boolean interpret(InterpreterContext context)
				throws FunctionParserException {
			context.push(new FunctionDefinition(new ScalarFunction(Math.PI)));
			return true;
		}
	};
	private static final AbstractExpression TRACE_CMD = new AbstractExpression(
			"trace") {

		/**
		 * @see org.mmarini.leibnitz.parser.TokenExpression#interpret(org.mmarini.leibnitz.parser.InterpreterContext)
		 */
		@Override
		public boolean interpret(InterpreterContext context)
				throws FunctionParserException {
			FunctionDefinition p1 = context.pool();
			int c = p1.getColCount();
			int r = p1.getRowCount();
			Function result = null;
			if (p1.isScalar())
				result = new TraceScalarFunction(p1.getFunction());
			else if (p1.isVector())
				result = new TraceVectFunction(p1.getFunction());
			else if (c == r)
				result = new TraceArrayFunction(p1.getFunction());
			else
				throw context
						.generateParseException("trace mismatch dimension " + r
								+ "!=" + c);
			context.push(new FunctionDefinition(result));
			return true;
		}
	};
	private static final UnaryFunctionClassExpression VERSUS_CMD = new UnaryFunctionClassExpression(
			"versusCommand", VersusFunction.class);
	private static final UnaryFunctionClassExpression SIN_CMD = new UnaryFunctionClassExpression(
			"sin", SinFunction.class);
	private static final UnaryFunctionClassExpression COS_CMD = new UnaryFunctionClassExpression(
			"cos", CosFunction.class);
	private static final UnaryFunctionClassExpression TAN_CMD = new UnaryFunctionClassExpression(
			"tan", TanFunction.class);
	private static final UnaryFunctionClassExpression ASIN_CMD = new UnaryFunctionClassExpression(
			"asin", ASinFunction.class);
	private static final UnaryFunctionClassExpression ACOS_CMD = new UnaryFunctionClassExpression(
			"acos", ACosFunction.class);
	private static final UnaryFunctionClassExpression ATAN_CMD = new UnaryFunctionClassExpression(
			"atan", ATanFunction.class);
	private static final UnaryFunctionClassExpression SINH_CMD = new UnaryFunctionClassExpression(
			"sinh", SinhFunction.class);
	private static final UnaryFunctionClassExpression COSH_CMD = new UnaryFunctionClassExpression(
			"cosh", CoshFunction.class);
	private static final UnaryFunctionClassExpression TANH_CMD = new UnaryFunctionClassExpression(
			"tanh", TanhFunction.class);
	private static final UnaryFunctionClassExpression EXP_CMD = new UnaryFunctionClassExpression(
			"exp", ExpFunction.class);
	private static final UnaryFunctionClassExpression LOG_CMD = new UnaryFunctionClassExpression(
			"log", LogFunction.class);
	private static final UnaryFunctionClassExpression SQRT_CMD = new UnaryFunctionClassExpression(
			"sqrt", SqrtFunction.class);
	private static final AbstractExpression TRANSPOSE_CMD = new AbstractExpression(
			"transposeCommand") {

		/**
		 * @see org.mmarini.leibnitz.parser.TokenExpression#interpret(org.mmarini.leibnitz.parser.InterpreterContext)
		 */
		@Override
		public boolean interpret(InterpreterContext context)
				throws FunctionParserException {
			FunctionDefinition p1 = context.pool();
			context.push(new FunctionDefinition(new TransposeFunction(p1
					.getFunction()), p1.getColCount(), p1.getRowCount()));
			return true;
		}
	};
	private static final AbstractExpression INVERSE_CMD = new AbstractExpression(
			"inverseCommand") {

		/**
		 * @see org.mmarini.leibnitz.parser.TokenExpression#interpret(org.mmarini.leibnitz.parser.InterpreterContext)
		 */
		@Override
		public boolean interpret(InterpreterContext context)
				throws FunctionParserException {
			FunctionDefinition p = context.pool();
			int r = p.getRowCount();
			int c = p.getColCount();
			if (r != c)
				throw context
						.generateParseException("inverse mismatch dimension "
								+ r + "!=" + c);
			context.push(p.clone(new InverseFunction(p.getFunction())));
			return true;
		}
	};
	private static final AbstractExpression NEGATE_CMD = new AbstractExpression(
			"negateCommand") {

		/**
		 * @see org.mmarini.leibnitz.parser.TokenExpression#interpret(org.mmarini.leibnitz.parser.InterpreterContext)
		 */
		@Override
		public boolean interpret(InterpreterContext context)
				throws FunctionParserException {
			FunctionDefinition p1 = context.pool();
			Function function;
			if (p1.isVector()) {
				function = new NegateVectorFunction(p1.getFunction());
			} else if (p1.isArray())
				function = new NegateArrayFunction(p1.getFunction());
			else
				function = new NegateScalarFunction(p1.getFunction());
			context.push(p1.clone(function));
			return true;
		}
	};
	private static final AbstractExpression DIV_CMD = new AbstractExpression(
			"divide") {

		/**
		 * @see org.mmarini.leibnitz.parser.TokenExpression#interpret(org.mmarini.leibnitz.parser.InterpreterContext)
		 */
		@Override
		public boolean interpret(InterpreterContext context)
				throws FunctionParserException {
			FunctionDefinition d = context.pool();
			FunctionDefinition n = context.pool();
			Function function;
			if (n.isVector())
				function = new DivideVectorFunction(n.getFunction(),
						d.getFunction());
			else if (n.isArray())
				function = new DivideArrayFunction(n.getFunction(),
						d.getFunction());
			else
				function = new DivideScalarFunction(n.getFunction(),
						d.getFunction());
			context.push(n.clone(function));
			return true;
		}
	};
	private static final AbstractExpression MUL_CMD = new AbstractExpression(
			"multiply") {

		/**
		 * @see org.mmarini.leibnitz.parser.TokenExpression#interpret(org.mmarini.leibnitz.parser.InterpreterContext)
		 */
		@Override
		public boolean interpret(InterpreterContext context)
				throws FunctionParserException {
			FunctionDefinition p2 = context.pool();
			FunctionDefinition p1 = context.pool();
			FunctionDefinition mul = null;
			int r1 = p1.getRowCount();
			int r2 = p2.getRowCount();
			int c1 = p1.getColCount();
			int c2 = p2.getColCount();
			if (p1.isArray()) {
				if (p2.isArray()) {
					if (c1 != r2)
						throw context
								.generateParseException("product mismatch dimension "
										+ c1 + "!=" + r2);
					mul = new FunctionDefinition(new ArrayProductFunction(
							p1.getFunction(), p2.getFunction()), r1, c2);
				} else if (p2.isVector()) {
					if (c1 != r2)
						throw context
								.generateParseException("product mismatch dimension "
										+ c1 + "!=" + r2);
					mul = new FunctionDefinition(
							new ArrayVectorProductFunction(p1.getFunction(),
									p2.getFunction()), r1);
				} else
					mul = p1.clone(new ScaleArrayFunction(p2.getFunction(), p1
							.getFunction()));
			} else if (p1.isVector()) {
				if (p2.isArray())
					throw context.generateParseException("check for vector");
				if (p2.isVector()) {
					if (r1 != r2)
						throw context
								.generateParseException("product mismatch dimension "
										+ r1 + "!=" + r2);
					mul = new FunctionDefinition(new ScalarProduct(
							p1.getFunction(), p2.getFunction()));
				} else
					mul = p1.clone(new ScaleVectorFunction(p2.getFunction(), p1
							.getFunction()));
			} else if (p2.isArray()) {
				mul = p2.clone(new ScaleArrayFunction(p1.getFunction(), p2
						.getFunction()));
			} else if (p2.isVector()) {
				mul = p2.clone(new ScaleVectorFunction(p1.getFunction(), p2
						.getFunction()));
			} else
				mul = p2.clone(new MultiplyFunction(p1.getFunction(), p2
						.getFunction()));
			context.push(mul);
			return true;
		}
	};
	private static final AbstractExpression ADD_CMD = new AbstractExpression(
			"subtract") {

		/**
		 * @see org.mmarini.leibnitz.parser.TokenExpression#interpret(org.mmarini.leibnitz.parser.InterpreterContext)
		 */
		@Override
		public boolean interpret(InterpreterContext context)
				throws FunctionParserException {
			FunctionDefinition p2 = context.pool();
			FunctionDefinition p1 = context.pool();
			int r1 = p1.getRowCount();
			int r2 = p2.getRowCount();
			int c1 = p1.getColCount();
			int c2 = p2.getColCount();
			FunctionDefinition mul = null;
			if (p1.isArray()) {
				if (!p2.isArray())
					throw context.generateParseException("check for array");
				if (r1 != r2 || c1 != c2)
					throw context
							.generateParseException("add mismatch dimension "
									+ r1 + "x" + c1 + "!=" + r2 + "x" + c2);
				mul = p1.clone(new AddArrayFunction(p1.getFunction(), p2
						.getFunction()));
			} else if (p1.isVector()) {
				if (!p2.isVector())
					throw context.generateParseException("check for vector");
				if (p1.getRowCount() >= p2.getRowCount())
					mul = p1;
				else
					mul = p2;
				mul = mul.clone(new AddVectorFunction(p1.getFunction(), p2
						.getFunction()));
			} else if (!p2.isScalar())
				throw context.generateParseException("check for scalar");
			else
				mul = new FunctionDefinition(new AddScalarFunction(
						p1.getFunction(), p2.getFunction()));
			context.push(mul);
			return true;
		}
	};
	private static final AbstractExpression SUB_CMD = new AbstractExpression(
			"subtract") {

		/**
		 * @see org.mmarini.leibnitz.parser.TokenExpression#interpret(org.mmarini.leibnitz.parser.InterpreterContext)
		 */
		@Override
		public boolean interpret(InterpreterContext context)
				throws FunctionParserException {
			FunctionDefinition p2 = context.pool();
			FunctionDefinition p1 = context.pool();
			int r1 = p1.getRowCount();
			int r2 = p2.getRowCount();
			int c1 = p1.getColCount();
			int c2 = p2.getColCount();
			FunctionDefinition mul = null;
			if (p1.isArray()) {
				if (!p2.isArray())
					throw context.generateParseException("check for array");
				if (r1 != r2 || c1 != c2)
					throw context
							.generateParseException("subtract mismatch dimension "
									+ r1 + "x" + c1 + "!=" + r2 + "x" + c2);
				mul = p1.clone(new SubArrayFunction(p1.getFunction(), p2
						.getFunction()));
			} else if (p1.isVector()) {
				if (!p2.isVector())
					throw context.generateParseException("check for vector");
				if (p1.getRowCount() >= p2.getRowCount())
					mul = p1;
				else
					mul = p2;
				mul = mul.clone(new SubVectorFunction(p1.getFunction(), p2
						.getFunction()));
			} else if (!p2.isScalar())
				throw context.generateParseException("check for scalar");
			else
				mul = new FunctionDefinition(new SubScalarFunction(
						p1.getFunction(), p2.getFunction()));
			context.push(mul);
			return true;
		}
	};
	private static final AbstractExpression DET_CMD = new AbstractExpression(
			"detCommand") {

		/**
		 * @see org.mmarini.leibnitz.parser.TokenExpression#interpret(org.mmarini.leibnitz.parser.InterpreterContext)
		 */
		@Override
		public boolean interpret(InterpreterContext context)
				throws FunctionParserException {
			FunctionDefinition p = context.pool();
			int r = p.getRowCount();
			int c = p.getColCount();
			if (r != c)
				throw context
						.generateParseException("determiner mismatch dimension "
								+ r + "!=" + c);
			context.push(new FunctionDefinition(new DeterminerFunction(p
					.getFunction())));
			return true;
		}
	};
	private static final AbstractExpression APPEND_CMD = new AbstractExpression(
			"appendCommand") {

		/**
		 * @see org.mmarini.leibnitz.parser.TokenExpression#interpret(org.mmarini.leibnitz.parser.InterpreterContext)
		 */
		@Override
		public boolean interpret(InterpreterContext context)
				throws FunctionParserException {
			FunctionDefinition p2 = context.pool();
			FunctionDefinition p1 = context.pool();
			int r1 = p1.getRowCount();
			int r2 = p2.getRowCount();
			int c1 = p1.getColCount();
			int c2 = p2.getColCount();
			int row = 0;
			int col = 0;
			Function function = null;
			if (p1.isArray()) {
				if (p2.isArray()) {
					// Array ; Array
					if (c2 != c1)
						throw context
								.generateParseException("append mismatch dimension "
										+ c1 + "!=" + c2);
					col = c1;
					function = new AppendArrayArrayFunction(p1.getFunction(),
							p2.getFunction());
					row = r1 + r2;
				} else {
					// Array ; Vector
					if (r2 != c1)
						throw context
								.generateParseException("append mismatch dimension "
										+ c1 + "!=" + r2);
					function = new AppendArrayFunction(p1.getFunction(),
							p2.getFunction());
					col = c1;
					row = r1 + 1;
				}
			} else if (p2.isArray())
				throw context.generateParseException("check for vector");
			else {
				if (r1 != r2)
					throw context
							.generateParseException("append mismatch dimension "
									+ r1 + "!=" + r2);
				col = r1;
				row = 2;
				function = new AppendVectorFunction(p1.getFunction(),
						p2.getFunction());
			}
			context.push(new FunctionDefinition(function, row, col));
			return true;
		}
	};
	private static final AbstractExpression T_PARM_CMD = new AbstractExpression(
			"tCommand") {

		/**
		 * @see org.mmarini.leibnitz.parser.TokenExpression#interpret(org.mmarini.leibnitz.parser.InterpreterContext)
		 */
		@Override
		public boolean interpret(InterpreterContext context)
				throws FunctionParserException {
			context.push(new FunctionDefinition(new ScalarParameterFunction()));
			return true;
		}
	};
	private static final AbstractExpression OPT_IDENTIFIER = new AbstractExpression(
			"identifier") {

		@Override
		public boolean interpret(InterpreterContext context)
				throws FunctionParserException {
			if (!context.isIdentifier())
				return false;
			String token = context.getToken();
			context.nextToken();
			FunctionDefinition result = context.getVariable(token);
			if (result == null)
				throw context.generateParseException(" undefined function "
						+ token);
			context.push(result);
			return true;
		}
	};
	private static final AbstractExpression DEFAULT_Q_PARM_CMD = new AbstractExpression(
			"QCommand") {

		/**
		 * @see org.mmarini.leibnitz.parser.TokenExpression#interpret(org.mmarini.leibnitz.parser.InterpreterContext)
		 */
		@Override
		public boolean interpret(InterpreterContext context)
				throws FunctionParserException {
			context.push(new FunctionDefinition(new VectorParameterFunction(0),
					context.getDimension()));
			return true;
		}
	};
	private static final IndexedIdentifier BASE_TERM = new IndexedIdentifier(
			"base", "e") {

		@Override
		public boolean interpret(InterpreterContext context)
				throws FunctionParserException {
			if (!super.interpret(context))
				return false;
			int idx = getIndex();
			Vector vector = new Vector(idx + 1);
			vector.setValues(idx, 1);
			context.push(new FunctionDefinition(new VectorFunction(vector),
					idx + 1));
			return true;
		}
	};
	// private static final OptExpression IDENTITY = new
	// OptExpression("identity",
	// OPT_I_TOKEN, INDEX, IDENTITY_CMD);
	private static final OptExpression E_CONST = new OptExpression("E",
			OPT_E_TOKEN, E_CMD);
	private static final OptExpression PI_CONST = new OptExpression("PI",
			OPT_PI_TOKEN, PI_CMD);

	private static SyntaxFactory instance = new SyntaxFactory();

	/**
	 * @return the instance
	 */
	public static SyntaxFactory getInstance() {
		return instance;
	}

	private AbstractExpression functionSyntax;

	/**
	 * 
	 */
	protected SyntaxFactory() {
		createFunctionSyntax();
	}

	/**
	 * 
	 */
	private void createFunctionSyntax() {
		SequenceExpression expr = new SequenceExpression("expr");
		SequenceExpression sum = new SequenceExpression("sum");
		ChoiceExpression expSuffix = new ChoiceExpression("expSuffix");
		expr.add(sum);
		expr.add(expSuffix);

		expSuffix.add(new OptExpression("append", OPT_SEMICOMMA_TOKEN,
				CHECK_FOR_NOT_SCALAR, sum, CHECK_FOR_NOT_SCALAR, APPEND_CMD,
				expSuffix));
		expSuffix.add(NONE);

		SequenceExpression factor = new SequenceExpression("factor");
		ChoiceExpression sumSuffix = new ChoiceExpression("sumSuffix");
		sum.add(factor);
		sum.add(sumSuffix);

		sumSuffix.add(new OptExpression("add", OPT_PLUS_TOKEN, factor, ADD_CMD,
				sumSuffix));
		sumSuffix.add(new OptExpression("subtract", OPT_MINUS_TOKEN, factor,
				SUB_CMD, sumSuffix));
		sumSuffix.add(NONE);

		ChoiceExpression unary = new ChoiceExpression("unary");
		ChoiceExpression factorSuffix = new ChoiceExpression("factorSuffix");
		factor.add(unary);
		factor.add(factorSuffix);

		factorSuffix.add(new OptExpression("multiply", OPT_STAR_TOKEN, unary,
				MUL_CMD, factorSuffix));
		factorSuffix.add(new OptExpression("divide", OPT_SLASH_TOKEN, unary,
				CHECK_FOR_SCALAR, DIV_CMD, factorSuffix));
		factorSuffix.add(NONE);

		SequenceExpression power = new SequenceExpression("power");
		unary.add(new OptExpression("plus", OPT_PLUS_TOKEN, unary));
		unary.add(new OptExpression("minus", OPT_MINUS_TOKEN, unary, NEGATE_CMD));
		unary.add(new OptExpression("trace", OPT_TRACE_TOKEN, unary, TRACE_CMD));
		unary.add(new OptExpression("unaryVect", OPT_N_TOKEN, unary,
				CHECK_FOR_VECTOR, VERSUS_CMD));
		unary.add(new OptExpression("t", OPT_T_TOKEN, unary, CHECK_FOR_ARRAY,
				TRANSPOSE_CMD));
		unary.add(new OptExpression("det", OPT_DET_TOKEN, unary,
				CHECK_FOR_ARRAY, DET_CMD));
		unary.add(new OptExpression("inv", OPT_INV_TOKEN, unary,
				CHECK_FOR_ARRAY, INVERSE_CMD));
		unary.add(new OptExpression("sin", OPT_SIN_TOKEN, unary,
				CHECK_FOR_SCALAR, SIN_CMD));
		unary.add(new OptExpression("cos", OPT_COS_TOKEN, unary,
				CHECK_FOR_SCALAR, COS_CMD));
		unary.add(new OptExpression("tan", OPT_TAN_TOKEN, unary,
				CHECK_FOR_SCALAR, TAN_CMD));
		unary.add(new OptExpression("asin", OPT_ASIN_TOKEN, unary,
				CHECK_FOR_SCALAR, ASIN_CMD));
		unary.add(new OptExpression("acos", OPT_ACOS_TOKEN, unary,
				CHECK_FOR_SCALAR, ACOS_CMD));
		unary.add(new OptExpression("atan", OPT_ATAN_TOKEN, unary,
				CHECK_FOR_SCALAR, ATAN_CMD));
		unary.add(new OptExpression("sinh", OPT_SINH_TOKEN, unary,
				CHECK_FOR_SCALAR, SINH_CMD));
		unary.add(new OptExpression("cosh", OPT_COSH_TOKEN, unary,
				CHECK_FOR_SCALAR, COSH_CMD));
		unary.add(new OptExpression("tanh", OPT_TANH_TOKEN, unary,
				CHECK_FOR_SCALAR, TANH_CMD));
		unary.add(new OptExpression("exp", OPT_EXP_TOKEN, unary,
				CHECK_FOR_SCALAR, EXP_CMD));
		unary.add(new OptExpression("log", OPT_LOG_TOKEN, unary,
				CHECK_FOR_SCALAR, LOG_CMD));
		unary.add(new OptExpression("sqrt", OPT_SQRT_TOKEN, unary,
				CHECK_FOR_SCALAR, SQRT_CMD));
		unary.add(power);

		ChoiceExpression term = new ChoiceExpression("term");
		ChoiceExpression powerSuffix = new ChoiceExpression("powerSuffix");
		power.add(term);
		power.add(powerSuffix);

		powerSuffix.add(new OptExpression("cap", OPT_CAP_TOKEN,
				CHECK_FOR_SCALAR, term, CHECK_FOR_SCALAR, POWER_CMD,
				powerSuffix));
		powerSuffix.add(NONE);

		term.add(new OptExpression("bracket", OPT_OPEN_BRACKET_TOKEN, expr,
				CLOSE_BRACKET_TOKEN));
		term.add(new OptExpression("module", OPT_VBAR_TOKEN, expr,
				CHECK_FOR_NOT_ARRAY, VBAR_TOKEN, MODULE_CMD));
		term.add(BASE_TERM);
		term.add(IDENTITY);
		term.add(new OptExpression("tParm", OPT_T_LOW_TOKEN, T_PARM_CMD));
		term.add(new OptExpression("qParm", OPT_Q_TOKEN, DEFAULT_Q_PARM_CMD));
		term.add(Q_ORDER_PARM);
		term.add(E_CONST);
		term.add(PI_CONST);
		term.add(OPT_IDENTIFIER);
		term.add(NUMBER);

		SequenceExpression mainExp = new SequenceExpression("function");
		mainExp.add(expr);
		mainExp.add(END_EXPRESSION);

		functionSyntax = mainExp;
	}

	/**
	 * @return the functionSyntax
	 */
	public AbstractExpression getFunctionSyntax() {
		return functionSyntax;
	}

}
