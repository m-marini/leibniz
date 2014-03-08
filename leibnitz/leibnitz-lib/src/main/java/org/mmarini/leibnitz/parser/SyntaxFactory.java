/**
 * 
 */
package org.mmarini.leibnitz.parser;

import org.mmarini.leibnitz.Array;
import org.mmarini.leibnitz.Vector;
import org.mmarini.leibnitz.commands.AcosCommand;
import org.mmarini.leibnitz.commands.AddACommand;
import org.mmarini.leibnitz.commands.AddQCommand;
import org.mmarini.leibnitz.commands.AddSCommand;
import org.mmarini.leibnitz.commands.AddSQCommand;
import org.mmarini.leibnitz.commands.AddSVCommand;
import org.mmarini.leibnitz.commands.AddVCommand;
import org.mmarini.leibnitz.commands.AddVQCommand;
import org.mmarini.leibnitz.commands.AngleCommand;
import org.mmarini.leibnitz.commands.AppendAACommand;
import org.mmarini.leibnitz.commands.AppendACommand;
import org.mmarini.leibnitz.commands.AppendVCommand;
import org.mmarini.leibnitz.commands.AsinCommand;
import org.mmarini.leibnitz.commands.AtanCommand;
import org.mmarini.leibnitz.commands.Command;
import org.mmarini.leibnitz.commands.Command.Type;
import org.mmarini.leibnitz.commands.ConstACommand;
import org.mmarini.leibnitz.commands.ConstSCommand;
import org.mmarini.leibnitz.commands.ConstVCommand;
import org.mmarini.leibnitz.commands.CosCommand;
import org.mmarini.leibnitz.commands.CoshCommand;
import org.mmarini.leibnitz.commands.Cylindric1Command;
import org.mmarini.leibnitz.commands.CylindricCommand;
import org.mmarini.leibnitz.commands.DeterminerCommand;
import org.mmarini.leibnitz.commands.DivACommand;
import org.mmarini.leibnitz.commands.DivQCommand;
import org.mmarini.leibnitz.commands.DivSCommand;
import org.mmarini.leibnitz.commands.DivVCommand;
import org.mmarini.leibnitz.commands.ExpCommand;
import org.mmarini.leibnitz.commands.InverseCommand;
import org.mmarini.leibnitz.commands.LogCommand;
import org.mmarini.leibnitz.commands.ModuleVCommand;
import org.mmarini.leibnitz.commands.MulAACommand;
import org.mmarini.leibnitz.commands.MulAVCommand;
import org.mmarini.leibnitz.commands.MulQQCommand;
import org.mmarini.leibnitz.commands.MulSACommand;
import org.mmarini.leibnitz.commands.MulSQCommand;
import org.mmarini.leibnitz.commands.MulSSCommand;
import org.mmarini.leibnitz.commands.MulSVCommand;
import org.mmarini.leibnitz.commands.MulVVCommand;
import org.mmarini.leibnitz.commands.NegateACommand;
import org.mmarini.leibnitz.commands.NegateQCommand;
import org.mmarini.leibnitz.commands.NegateSCommand;
import org.mmarini.leibnitz.commands.NegateVCommand;
import org.mmarini.leibnitz.commands.PowerCommand;
import org.mmarini.leibnitz.commands.QRotCommand;
import org.mmarini.leibnitz.commands.SinCommand;
import org.mmarini.leibnitz.commands.SinhCommand;
import org.mmarini.leibnitz.commands.Spherical1Command;
import org.mmarini.leibnitz.commands.SphericalCommand;
import org.mmarini.leibnitz.commands.SqrtCommand;
import org.mmarini.leibnitz.commands.SubACommand;
import org.mmarini.leibnitz.commands.SubQCommand;
import org.mmarini.leibnitz.commands.SubQSCommand;
import org.mmarini.leibnitz.commands.SubQVCommand;
import org.mmarini.leibnitz.commands.SubSCommand;
import org.mmarini.leibnitz.commands.SubSVCommand;
import org.mmarini.leibnitz.commands.SubVCommand;
import org.mmarini.leibnitz.commands.TanCommand;
import org.mmarini.leibnitz.commands.TanhCommand;
import org.mmarini.leibnitz.commands.TraceACommand;
import org.mmarini.leibnitz.commands.TraceSCommand;
import org.mmarini.leibnitz.commands.TraceVCommand;
import org.mmarini.leibnitz.commands.TransposeCommand;
import org.mmarini.leibnitz.commands.TypeDimensions;
import org.mmarini.leibnitz.commands.VersusCommand;

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
 * unary := 'cyl' unary
 * unary := 'sphere' unary
 * unary := 'cyl1' unary
 * unary := 'sphere1' unary
 * unary := 'qrot' unary
 * unary := power
 * 
 * power := term powerSuffix
 * 
 * powerSuffix := '^' term powerSuffix
 * powerSuffix := EMPTY
 * 
 * term := '(' exp ')'
 * term := '|' exp '|'
 * term := 'I' dimension
 * constTerm := 'e' index
 * constTerm := 'E'
 * constTerm := 'PI'
 * term := id
 * term := number
 * 
 * dimension := digits
 * 
 * index := digits
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
	private static final TokenExpression OPT_ANGLE_TOKEN = new TokenExpression(
			"angle", false);
	private static final TokenExpression OPT_QROT_TOKEN = new TokenExpression(
			"qrot", false);
	private static final TokenExpression OPT_CYL_TOKEN = new TokenExpression(
			"cyl", false);
	private static final TokenExpression OPT_CYL1_TOKEN = new TokenExpression(
			"cyl1", false);
	private static final TokenExpression OPT_SPHERE_TOKEN = new TokenExpression(
			"sphere", false);
	private static final TokenExpression OPT_SPHERE1_TOKEN = new TokenExpression(
			"sphere1", false);
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
	private static final UnaryFunctionClassExpression VERSUS_CMD = new UnaryFunctionClassExpression(
			"versusCommand", VersusCommand.class);
	private static final UnaryFunctionClassExpression SIN_CMD = new UnaryFunctionClassExpression(
			"sin", SinCommand.class);
	private static final UnaryFunctionClassExpression COS_CMD = new UnaryFunctionClassExpression(
			"cos", CosCommand.class);
	private static final UnaryFunctionClassExpression TAN_CMD = new UnaryFunctionClassExpression(
			"tan", TanCommand.class);
	private static final UnaryFunctionClassExpression ASIN_CMD = new UnaryFunctionClassExpression(
			"asin", AsinCommand.class);
	private static final UnaryFunctionClassExpression ACOS_CMD = new UnaryFunctionClassExpression(
			"acos", AcosCommand.class);
	private static final UnaryFunctionClassExpression ATAN_CMD = new UnaryFunctionClassExpression(
			"atan", AtanCommand.class);
	private static final UnaryFunctionClassExpression SINH_CMD = new UnaryFunctionClassExpression(
			"sinh", SinhCommand.class);
	private static final UnaryFunctionClassExpression COSH_CMD = new UnaryFunctionClassExpression(
			"cosh", CoshCommand.class);
	private static final UnaryFunctionClassExpression TANH_CMD = new UnaryFunctionClassExpression(
			"tanh", TanhCommand.class);
	private static final UnaryFunctionClassExpression EXP_CMD = new UnaryFunctionClassExpression(
			"exp", ExpCommand.class);
	private static final UnaryFunctionClassExpression LOG_CMD = new UnaryFunctionClassExpression(
			"log", LogCommand.class);
	private static final UnaryFunctionClassExpression SQRT_CMD = new UnaryFunctionClassExpression(
			"sqrt", SqrtCommand.class);
	private static final UnaryFunctionClassExpression QROT_CMD = new UnaryFunctionClassExpression(
			"qrot", QRotCommand.class);
	private static final UnaryFunctionClassExpression ANGLE_CMD = new UnaryFunctionClassExpression(
			"angle", AngleCommand.class);
	private static final UnaryFunctionClassExpression CYL_CMD = new UnaryFunctionClassExpression(
			"cyl", CylindricCommand.class);
	private static final UnaryFunctionClassExpression SPHERE_CMD = new UnaryFunctionClassExpression(
			"sphere", SphericalCommand.class);
	private static final AbstractExpression CYL1_CMD = new AbstractExpression(
			"cyl1") {

		@Override
		public boolean interpret(final InterpreterContext context)
				throws FunctionParserException {
			final Command p = context.pool();
			context.push(new Cylindric1Command(p));
			return true;
		}
	};
	private static final AbstractExpression SPHERE1_CMD = new AbstractExpression(
			"sphere1") {

		@Override
		public boolean interpret(final InterpreterContext context)
				throws FunctionParserException {
			final Command p = context.pool();
			context.push(new Spherical1Command(p));
			return true;
		}
	};
	private static final AbstractExpression END_EXPRESSION = new AbstractExpression(
			"<eof>") {

		/**
		 * @see org.mmarini.leibnitz.parser.AbstractExpression#interpret(org.mmarini
		 *      .leibnitz.parser.InterpreterContext)
		 */
		@Override
		public boolean interpret(final InterpreterContext context)
				throws FunctionParserException {
			if (context.getToken() != null)
				context.generateParseException(this);
			return true;
		}
	};
	private static final AbstractExpression NUMBER = new AbstractExpression(
			"number") {

		@Override
		public boolean interpret(final InterpreterContext context)
				throws FunctionParserException {
			if (!context.isNumber())
				context.generateParseException(this);
			final String token = context.getToken();
			context.nextToken();
			final double value = Double.parseDouble(token);
			context.push(new ConstSCommand(value));
			return true;
		}
	};

	private static final AbstractExpression NONE = new AbstractExpression(
			"none") {

		@Override
		public boolean interpret(final InterpreterContext context)
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
		public boolean interpret(final InterpreterContext context)
				throws FunctionParserException {
			if (!super.interpret(context))
				return false;
			final int n = getIndex();
			final Array i = new Array(n, n);
			i.setIdentity();
			context.push(new ConstACommand(i));
			return true;
		}
	};

	private static final AbstractExpression CHECK_FOR_QUATERNION = new AbstractExpression(
			"check for quaternion") {

		@Override
		public boolean interpret(final InterpreterContext context)
				throws FunctionParserException {
			if (context.peek().getType() != Type.QUATERNION)
				context.generateParseException(this);
			return true;
		}
	};
	private static final AbstractExpression CHECK_FOR_VECTOR = new AbstractExpression(
			"check for vector") {

		@Override
		public boolean interpret(final InterpreterContext context)
				throws FunctionParserException {
			if (context.peek().getType() != Type.VECTOR)
				context.generateParseException(this);
			return true;
		}
	};
	private static final AbstractExpression CHECK_FOR_3D_VECTOR = new AbstractExpression(
			"check for 3D vector") {

		@Override
		public boolean interpret(final InterpreterContext context)
				throws FunctionParserException {
			final Command fd = context.peek();
			if (fd.getType() != Type.VECTOR)
				context.generateParseException(this);
			final int dim = fd.getDimensions().getRowCount();
			if (dim != 3)
				context.generateParseException(getName()
						+ " mismatch dimension " + dim + "!=3");
			return true;
		}
	};
	private static final AbstractExpression CHECK_FOR_ARRAY = new AbstractExpression(
			"check for array") {

		@Override
		public boolean interpret(final InterpreterContext context)
				throws FunctionParserException {
			if (context.peek().getType() != Command.Type.ARRAY)
				context.generateParseException(this);
			return true;
		}
	};
	private static final AbstractExpression CHECK_FOR_NOT_ARRAY = new AbstractExpression(
			"check for not array") {

		@Override
		public boolean interpret(final InterpreterContext context)
				throws FunctionParserException {
			if (context.peek().getType() == Command.Type.ARRAY)
				context.generateParseException(this);
			return true;
		}
	};

	private static final AbstractExpression CHECK_FOR_SCALAR = new AbstractExpression(
			"check for scalar") {

		@Override
		public boolean interpret(final InterpreterContext context)
				throws FunctionParserException {
			if (context.peek().getType() != Command.Type.SCALAR)
				context.generateParseException(this);
			return true;
		}
	};
	private static final AbstractExpression CHECK_FOR_ARRAY_OR_VECTOR = new AbstractExpression(
			"check for array or vector") {

		@Override
		public boolean interpret(final InterpreterContext context)
				throws FunctionParserException {
			switch (context.peek().getType()) {
			case ARRAY:
			case VECTOR:
				break;
			default:
				context.generateParseException(this);
				break;
			}
			return true;
		}
	};
	private static final AbstractExpression MODULE_CMD = new AbstractExpression(
			"module") {

		/**
		 * @see org.mmarini.leibnitz.parser.TokenExpression#interpret(org.mmarini.leibnitz.parser.InterpreterContext)
		 */
		@Override
		public boolean interpret(final InterpreterContext context)
				throws FunctionParserException {
			Command p1 = context.pool();
			switch (p1.getType()) {
			case SCALAR:
				break;
			case VECTOR:
				p1 = new ModuleVCommand(p1);
				break;
			case QUATERNION:
				context.generateParseException("check for not quaternion");
				break;
			case ARRAY:
				break;
			default:
				break;
			}
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
		public boolean interpret(final InterpreterContext context)
				throws FunctionParserException {
			final Command exp = context.pool();
			final Command base = context.pool();
			context.push(new PowerCommand(base, exp));
			return true;
		}
	};
	private static final AbstractExpression E_CMD = new AbstractExpression(
			"eCommand") {

		/**
		 * @see org.mmarini.leibnitz.parser.TokenExpression#interpret(org.mmarini.leibnitz.parser.InterpreterContext)
		 */
		@Override
		public boolean interpret(final InterpreterContext context)
				throws FunctionParserException {
			context.push(new ConstSCommand(Math.E));
			return true;
		}
	};
	private static final AbstractExpression PI_CMD = new AbstractExpression(
			"piCommand") {

		/**
		 * @see org.mmarini.leibnitz.parser.TokenExpression#interpret(org.mmarini.leibnitz.parser.InterpreterContext)
		 */
		@Override
		public boolean interpret(final InterpreterContext context)
				throws FunctionParserException {
			context.push(new ConstSCommand(Math.PI));
			return true;
		}
	};
	private static final AbstractExpression TRACE_CMD = new AbstractExpression(
			"trace") {

		/**
		 * @see org.mmarini.leibnitz.parser.TokenExpression#interpret(org.mmarini.leibnitz.parser.InterpreterContext)
		 */
		@Override
		public boolean interpret(final InterpreterContext context)
				throws FunctionParserException {
			final Command p1 = context.pool();
			Command result = null;
			switch (p1.getType()) {
			case SCALAR:
				result = new TraceSCommand(p1);
				break;
			case VECTOR:
				result = new TraceVCommand(p1);
				break;
			case ARRAY:
				final TypeDimensions type = p1.getDimensions();
				final int c = type.getColCount();
				final int r = type.getRowCount();
				if (c != r)
					context.generateParseException("trace mismatch dimension "
							+ r + "!=" + c);
				result = new TraceACommand(p1);
				break;
			default:
				break;
			}
			context.push(result);
			return true;
		}
	};
	private static final AbstractExpression TRANSPOSE_CMD = new AbstractExpression(
			"transposeCommand") {

		/**
		 * @see org.mmarini.leibnitz.parser.TokenExpression#interpret(org.mmarini.leibnitz.parser.InterpreterContext)
		 */
		@Override
		public boolean interpret(final InterpreterContext context)
				throws FunctionParserException {
			final Command p = context.pool();
			context.push(new TransposeCommand(p));
			return true;
		}
	};
	private static final AbstractExpression INVERSE_CMD = new AbstractExpression(
			"inverseCommand") {

		/**
		 * @see org.mmarini.leibnitz.parser.TokenExpression#interpret(org.mmarini.leibnitz.parser.InterpreterContext)
		 */
		@Override
		public boolean interpret(final InterpreterContext context)
				throws FunctionParserException {
			final Command p = context.pool();
			final TypeDimensions type = p.getDimensions();
			final int r = type.getRowCount();
			final int c = type.getColCount();
			if (r != c)
				context.generateParseException("inverse mismatch dimension "
						+ r + "!=" + c);
			context.push(new InverseCommand(p));
			return true;
		}
	};
	private static final AbstractExpression NEGATE_CMD = new AbstractExpression(
			"negateCommand") {

		/**
		 * @see org.mmarini.leibnitz.parser.TokenExpression#interpret(org.mmarini.leibnitz.parser.InterpreterContext)
		 */
		@Override
		public boolean interpret(final InterpreterContext context)
				throws FunctionParserException {
			final Command p1 = context.pool();
			Command function = null;
			switch (p1.getType()) {
			case SCALAR:
				function = new NegateSCommand(p1);
				break;
			case VECTOR:
				function = new NegateVCommand(p1);
				break;
			case QUATERNION:
				function = new NegateQCommand(p1);
				break;
			case ARRAY:
				function = new NegateACommand(p1);
				break;
			}
			context.push(function);
			return true;
		}
	};
	private static final AbstractExpression DIV_CMD = new AbstractExpression(
			"divide") {

		/**
		 * @see org.mmarini.leibnitz.parser.TokenExpression#interpret(org.mmarini.leibnitz.parser.InterpreterContext)
		 */
		@Override
		public boolean interpret(final InterpreterContext context)
				throws FunctionParserException {
			final Command d = context.pool();
			final Command n = context.pool();
			Command function = null;
			switch (n.getType()) {
			case SCALAR:
				function = new DivSCommand(n, d);
				break;
			case QUATERNION:
				function = new DivQCommand(n, d);
				break;
			case VECTOR:
				function = new DivVCommand(n, d);
				break;
			case ARRAY:
				function = new DivACommand(n, d);
				break;
			}
			context.push(function);
			return true;
		}
	};
	private static final AbstractExpression MUL_CMD = new AbstractExpression(
			"multiply") {

		/**
		 * @see org.mmarini.leibnitz.parser.TokenExpression#interpret(org.mmarini.leibnitz.parser.InterpreterContext)
		 */
		@Override
		public boolean interpret(final InterpreterContext context)
				throws FunctionParserException {
			final Command p2 = context.pool();
			final Command p1 = context.pool();
			Command mul = null;
			switch (p1.getType()) {
			case SCALAR:
				mul = mulScalar(context, p1, p2);
				break;
			case VECTOR:
				mul = mulVector(context, p1, p2);
				break;
			case QUATERNION:
				mul = mulQuaterion(context, p1, p2);
				break;
			case ARRAY:
				mul = mulArray(context, p1, p2);
				break;
			}
			context.push(mul);
			return true;
		}

		/**
		 * 
		 * @param context
		 * @param p1
		 * @param p2
		 * @return
		 * @throws FunctionParserException
		 */
		private Command mulArray(final InterpreterContext context, final Command p1,
				final Command p2) throws FunctionParserException {
			final TypeDimensions d1 = p1.getDimensions();
			final int c1 = d1.getColCount();
			TypeDimensions d2;
			int r2;
			switch (p2.getType()) {
			case SCALAR:
				return new MulSACommand(p2, p1);
			case VECTOR:
				d2 = p2.getDimensions();
				r2 = d2.getRowCount();
				if (c1 != r2)
					context.generateParseException("product mismatch dimension "
							+ d1 + " by " + d2);
				return new MulAVCommand(p1, p2);
			case QUATERNION:
				context.generateParseException("check for not quaternion");
				break;
			case ARRAY:
				d2 = p2.getDimensions();
				r2 = d2.getRowCount();
				if (c1 != r2)
					context.generateParseException("product mismatch dimension "
							+ d1 + " by " + d2);
				return new MulAACommand(p1, p2);
			}
			return null;
		}

		/**
		 * 
		 * @param context
		 * @param p1
		 * @param p2
		 * @return
		 * @throws FunctionParserException
		 */
		private Command mulQuaterion(final InterpreterContext context, final Command p1,
				final Command p2) throws FunctionParserException {
			switch (p2.getType()) {
			case SCALAR:
				return new MulSQCommand(p2, p1);
			case QUATERNION:
				return new MulQQCommand(p1, p2);
			default:
				context.generateParseException("check for scalar or quaternion");
			}
			return null;
		}

		/**
		 * 
		 * @param context
		 * @param p1
		 * @param p2
		 * @return
		 */
		private Command mulScalar(final InterpreterContext context, final Command p1,
				final Command p2) {
			switch (p2.getType()) {
			case SCALAR:
				return new MulSSCommand(p1, p2);
			case VECTOR:
				return new MulSVCommand(p1, p2);
			case QUATERNION:
				return new MulSQCommand(p1, p2);
			case ARRAY:
				return new MulSACommand(p1, p2);
			}
			return null;
		}

		/**
		 * 
		 * @param context
		 * @param p1
		 * @param p2
		 * @return
		 * @throws FunctionParserException
		 */
		private Command mulVector(final InterpreterContext context, final Command p1,
				final Command p2) throws FunctionParserException {
			switch (p2.getType()) {
			case SCALAR:
				return new MulSVCommand(p2, p1);
			case VECTOR:
				final TypeDimensions d1 = p1.getDimensions();
				final TypeDimensions d2 = p2.getDimensions();
				if (d1.getRowCount() != d2.getRowCount())
					context.generateParseException("check for dimension " + d1
							+ "!=" + d2);
				return new MulVVCommand(p1, p2);
			default:
				context.generateParseException("check for scalar or vector");
				break;
			}
			return null;
		}
	};
	private static final AbstractExpression ADD_CMD = new AbstractExpression(
			"add") {

		/**
		 * @see org.mmarini.leibnitz.parser.TokenExpression#interpret(org.mmarini.leibnitz.parser.InterpreterContext)
		 */
		@Override
		public boolean interpret(final InterpreterContext context)
				throws FunctionParserException {
			final Command p2 = context.pool();
			final Command p1 = context.pool();
			Command cmd = null;
			switch (p1.getType()) {
			case SCALAR:
				cmd = processS(context, p1, p2);
				break;
			case VECTOR:
				cmd = processV(context, p1, p2);
				break;
			case QUATERNION:
				cmd = processQ(context, p1, p2);
				break;
			case ARRAY:
				cmd = processA(context, p1, p2);
				break;
			}
			context.push(cmd);
			return true;
		}

		/**
		 * 
		 * @param context
		 * @param p1
		 * @param p2
		 * @return
		 * @throws FunctionParserException
		 */
		private Command processA(final InterpreterContext context, final Command p1,
				final Command p2) throws FunctionParserException {
			if (p2.getType() != Type.ARRAY)
				context.generateParseException("check for type " + p2 + " != "
						+ Type.ARRAY);
			final TypeDimensions d1 = p1.getDimensions();
			final TypeDimensions d2 = p2.getDimensions();
			if (!d1.equals(d2))
				context.generateParseException("check for dimensions " + d1
						+ " != " + d2);
			return new AddACommand(p1, p2);
		}

		/**
		 * 
		 * @param context
		 * @param p1
		 * @param p2
		 * @return
		 * @throws FunctionParserException
		 */
		private Command processQ(final InterpreterContext context, final Command p1,
				final Command p2) throws FunctionParserException {
			final Type t2 = p2.getType();
			switch (t2) {
			case SCALAR:
				return new AddSQCommand(p2, p1);
			case VECTOR:
				final TypeDimensions d2 = p2.getDimensions();
				if (d2.getRowCount() > 3)
					context.generateParseException("check for dimension " + d2
							+ " != [3 x 1]");
				return new AddVQCommand(p2, p1);
			case QUATERNION:
				return new AddQCommand(p1, p2);
			case ARRAY:
				context.generateParseException("check for type " + t2);
				break;
			}
			return null;
		}

		/**
		 * 
		 * @param context
		 * @param p1
		 * @param p2
		 * @return
		 * @throws FunctionParserException
		 */
		private Command processS(final InterpreterContext context, final Command p1,
				final Command p2) throws FunctionParserException {
			final Type t2 = p2.getType();
			switch (t2) {
			case SCALAR:
				return new AddSCommand(p1, p2);
			case VECTOR:
				final TypeDimensions d2 = p2.getDimensions();
				if (d2.getRowCount() > 3)
					context.generateParseException("check for dimension " + d2
							+ " != [3 x 1]");
				return new AddSVCommand(p1, p2);
			case QUATERNION:
				return new AddSQCommand(p1, p2);
			case ARRAY:
				context.generateParseException("check for type " + t2);
				break;
			}
			return null;
		}

		/**
		 * 
		 * @param context
		 * @param p1
		 * @param p2
		 * @return
		 * @throws FunctionParserException
		 */
		private Command processV(final InterpreterContext context, final Command p1,
				final Command p2) throws FunctionParserException {
			final Type t2 = p2.getType();
			final int rc = p1.getDimensions().getRowCount();
			switch (t2) {
			case SCALAR:
				if (rc > 3)
					context.generateParseException("check for dimension " + rc
							+ " > 3");
				return new AddSVCommand(p2, p1);
			case VECTOR:
				return new AddVCommand(p1, p2);
			case QUATERNION:
				if (rc > 3)
					context.generateParseException("check for dimension " + rc
							+ " > 3");
				return new AddVQCommand(p1, p2);
			case ARRAY:
				context.generateParseException("check for type " + t2);
				break;
			}
			return null;
		}
	};
	private static final AbstractExpression SUB_CMD = new AbstractExpression(
			"subtract") {

		/**
		 * @see org.mmarini.leibnitz.parser.TokenExpression#interpret(org.mmarini.leibnitz.parser.InterpreterContext)
		 */
		@Override
		public boolean interpret(final InterpreterContext context)
				throws FunctionParserException {
			final Command p2 = context.pool();
			final Command p1 = context.pool();
			Command cmd = null;
			switch (p1.getType()) {
			case SCALAR:
				cmd = processS(context, p1, p2);
				break;
			case VECTOR:
				cmd = processV(context, p1, p2);
				break;
			case QUATERNION:
				cmd = processQ(context, p1, p2);
				break;
			case ARRAY:
				cmd = processA(context, p1, p2);
				break;
			}
			context.push(cmd);
			return true;
		}

		/**
		 * 
		 * @param context
		 * @param p1
		 * @param p2
		 * @return
		 * @throws FunctionParserException
		 */
		private Command processA(final InterpreterContext context, final Command p1,
				final Command p2) throws FunctionParserException {
			if (p2.getType() != Type.ARRAY)
				context.generateParseException("check for type " + p2 + " != "
						+ Type.ARRAY);
			final TypeDimensions d1 = p1.getDimensions();
			final TypeDimensions d2 = p2.getDimensions();
			if (!d1.equals(d2))
				context.generateParseException("check for dimensions " + d1
						+ " != " + d2);
			return new SubACommand(p1, p2);
		}

		/**
		 * 
		 * @param context
		 * @param p1
		 * @param p2
		 * @return
		 * @throws FunctionParserException
		 */
		private Command processQ(final InterpreterContext context, final Command p1,
				final Command p2) throws FunctionParserException {
			final Type t2 = p2.getType();
			switch (t2) {
			case SCALAR:
				return new SubQSCommand(p1, p2);
			case VECTOR:
				final TypeDimensions d2 = p2.getDimensions();
				if (d2.getRowCount() > 3)
					context.generateParseException("check for dimension " + d2
							+ " != [3 x 1]");
				return new SubQVCommand(p1, p2);
			case QUATERNION:
				return new SubQCommand(p1, p2);
			case ARRAY:
				context.generateParseException("check for type " + t2);
				break;
			}
			return null;
		}

		/**
		 * 
		 * @param context
		 * @param p1
		 * @param p2
		 * @return
		 * @throws FunctionParserException
		 */
		private Command processS(final InterpreterContext context, final Command p1,
				final Command p2) throws FunctionParserException {
			final Type t2 = p2.getType();
			switch (t2) {
			case SCALAR:
				return new SubSCommand(p1, p2);
			case VECTOR:
				final TypeDimensions d2 = p2.getDimensions();
				if (d2.getRowCount() > 3)
					context.generateParseException("check for dimension " + d2
							+ " != [3 x 1]");
				return new SubSVCommand(p1, p2);
			case QUATERNION:
			case ARRAY:
				context.generateParseException("check for type " + t2);
				break;
			}
			return null;
		}

		/**
		 * 
		 * @param context
		 * @param p1
		 * @param p2
		 * @return
		 * @throws FunctionParserException
		 */
		private Command processV(final InterpreterContext context, final Command p1,
				final Command p2) throws FunctionParserException {
			final Type t2 = p2.getType();
			switch (t2) {
			case SCALAR:
			case QUATERNION:
			case ARRAY:
				context.generateParseException("check for type " + t2);
			case VECTOR:
				return new SubVCommand(p1, p2);
			}
			return null;
		}
	};
	private static final AbstractExpression DET_CMD = new AbstractExpression(
			"detCommand") {

		/**
		 * @see org.mmarini.leibnitz.parser.TokenExpression#interpret(org.mmarini.leibnitz.parser.InterpreterContext)
		 */
		@Override
		public boolean interpret(final InterpreterContext context)
				throws FunctionParserException {
			final Command p = context.pool();
			final TypeDimensions type = p.getDimensions();
			final int r = type.getRowCount();
			final int c = type.getColCount();
			if (r != c)
				context.generateParseException("determiner mismatch dimension "
						+ r + "!=" + c);
			context.push(new DeterminerCommand(p));
			return true;
		}
	};
	private static final AbstractExpression APPEND_CMD = new AbstractExpression(
			"appendCommand") {

		/**
		 * @see org.mmarini.leibnitz.parser.TokenExpression#interpret(org.mmarini.leibnitz.parser.InterpreterContext)
		 */
		@Override
		public boolean interpret(final InterpreterContext context)
				throws FunctionParserException {
			final Command p2 = context.pool();
			final Command p1 = context.pool();
			final TypeDimensions dim1 = p1.getDimensions();
			final TypeDimensions dim2 = p2.getDimensions();
			final int r1 = dim1.getRowCount();
			final int r2 = dim2.getRowCount();
			final int c1 = dim1.getColCount();
			final int c2 = dim2.getColCount();
			Command command = null;
			if (p1.getType() == Type.ARRAY) {
				if (p2.getType() == Type.ARRAY) {
					// Array ; Array
					if (c2 != c1)
						context.generateParseException("append mismatch dimension "
								+ c1 + "!=" + c2);
					command = new AppendAACommand(p1, p2);
				} else {
					// Array ; Vector
					if (r2 != c1)
						context.generateParseException("append mismatch dimension "
								+ c1 + "!=" + r2);
					command = new AppendACommand(p1, p2);
				}
			} else if (p2.getType() == Type.ARRAY)
				context.generateParseException("check for vector");
			else {
				if (r1 != r2)
					context.generateParseException("append mismatch dimension "
							+ r1 + "!=" + r2);
				command = new AppendVCommand(p1, p2);
			}
			context.push(command);
			return true;
		}
	};
	private static final AbstractExpression OPT_IDENTIFIER = new AbstractExpression(
			"identifier") {

		@Override
		public boolean interpret(final InterpreterContext context)
				throws FunctionParserException {
			if (!context.isIdentifier())
				return false;
			final String token = context.getToken();
			context.nextToken();
			final Command result = context.getFunction(token);
			if (result == null)
				context.generateParseException(" undefined function " + token);
			context.push(result);
			return true;
		}
	};
	private static final IndexedIdentifier BASE_TERM = new IndexedIdentifier(
			"base", "e") {

		@Override
		public boolean interpret(final InterpreterContext context)
				throws FunctionParserException {
			if (!super.interpret(context))
				return false;
			final int idx = getIndex();
			final Vector vector = new Vector(idx + 1);
			vector.setValues(idx, 1);
			context.push(new ConstVCommand(vector));
			return true;
		}
	};
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
		final SequenceExpression expr = new SequenceExpression("expr");
		final SequenceExpression sum = new SequenceExpression("sum");
		final ChoiceExpression expSuffix = new ChoiceExpression("expSuffix");
		expr.add(sum);
		expr.add(expSuffix);

		expSuffix.add(new OptExpression("append", OPT_SEMICOMMA_TOKEN,
				CHECK_FOR_ARRAY_OR_VECTOR, sum, CHECK_FOR_ARRAY_OR_VECTOR,
				APPEND_CMD, expSuffix));
		expSuffix.add(NONE);

		final SequenceExpression factor = new SequenceExpression("factor");
		final ChoiceExpression sumSuffix = new ChoiceExpression("sumSuffix");
		sum.add(factor);
		sum.add(sumSuffix);

		sumSuffix.add(new OptExpression("add", OPT_PLUS_TOKEN, factor, ADD_CMD,
				sumSuffix));
		sumSuffix.add(new OptExpression("subtract", OPT_MINUS_TOKEN, factor,
				SUB_CMD, sumSuffix));
		sumSuffix.add(NONE);

		final ChoiceExpression unary = new ChoiceExpression("unary");
		final ChoiceExpression factorSuffix = new ChoiceExpression("factorSuffix");
		factor.add(unary);
		factor.add(factorSuffix);

		factorSuffix.add(new OptExpression("multiply", OPT_STAR_TOKEN, unary,
				MUL_CMD, factorSuffix));
		factorSuffix.add(new OptExpression("divide", OPT_SLASH_TOKEN, unary,
				CHECK_FOR_SCALAR, DIV_CMD, factorSuffix));
		factorSuffix.add(NONE);

		final SequenceExpression power = new SequenceExpression("power");
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
		unary.add(new OptExpression("cyl", OPT_CYL_TOKEN, unary,
				CHECK_FOR_3D_VECTOR, CYL_CMD));
		unary.add(new OptExpression("angle", OPT_ANGLE_TOKEN, unary,
				CHECK_FOR_QUATERNION, ANGLE_CMD));
		unary.add(new OptExpression("qrot", OPT_QROT_TOKEN, unary,
				CHECK_FOR_3D_VECTOR, QROT_CMD));
		unary.add(new OptExpression("cyl1", OPT_CYL1_TOKEN, unary,
				CHECK_FOR_3D_VECTOR, CYL1_CMD));
		unary.add(new OptExpression("sphere1", OPT_SPHERE1_TOKEN, unary,
				CHECK_FOR_3D_VECTOR, SPHERE1_CMD));
		unary.add(new OptExpression("sphere", OPT_SPHERE_TOKEN, unary,
				CHECK_FOR_3D_VECTOR, SPHERE_CMD));
		unary.add(power);

		final ChoiceExpression term = new ChoiceExpression("term");
		final ChoiceExpression powerSuffix = new ChoiceExpression("powerSuffix");
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
		term.add(E_CONST);
		term.add(PI_CONST);
		term.add(OPT_IDENTIFIER);
		term.add(NUMBER);

		final SequenceExpression mainExp = new SequenceExpression("function");
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
