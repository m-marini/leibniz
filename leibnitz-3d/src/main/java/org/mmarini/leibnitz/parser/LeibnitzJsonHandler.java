/**
 * 
 */
package org.mmarini.leibnitz.parser;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.mmarini.leibnitz.FunctionGenerator;
import org.mmarini.leibnitz.commands.AbstractCachedCommand;
import org.mmarini.leibnitz.commands.AbstractVariableCommand;
import org.mmarini.leibnitz.commands.Command;
import org.mmarini.leibnitz.commands.Command.Type;
import org.mmarini.leibnitz.commands.TypeDimensions;
import org.mmarini.leibnitz.commands.VariableCommand;

/**
 * @author us00852
 * 
 */
public class LeibnitzJsonHandler {

	private final ExpressionInterpreter context;
	private final FunctionGenerator generator;

	/**
	 * 
	 */
	public LeibnitzJsonHandler() {
		context = new ExpressionInterpreter();
		generator = new FunctionGenerator();
	}

	/**
	 * 
	 * @param file
	 * @return
	 * @throws IOException
	 * @throws JsonMappingException
	 * @throws JsonParseException
	 * @throws FunctionParserException
	 */
	public FunctionGenerator parse(final File file) throws JsonParseException,
			JsonMappingException, IOException, FunctionParserException {

		@SuppressWarnings("unchecked")
		final Map<String, Object> data = new ObjectMapper().readValue(file,
				Map.class);

		/*
		 * Parse defs
		 */
		@SuppressWarnings("unchecked")
		final List<Map<String, String>> defs = (List<Map<String, String>>) data
				.get("defs");
		if (defs == null)
			throw new FunctionParserException("Missing value for \"defs\"");
		int idx = 0;
		for (final Map<String, String> d : defs) {
			final String id = d.get("id");
			if (id == null)
				throw new FunctionParserException("Missing id at defs[" + idx
						+ "]");

			final String t = d.get("type");
			if (t == null)
				throw new FunctionParserException("Missing type at defs[" + idx
						+ "]");
			final String ex = d.get("exp");
			if (ex == null)
				throw new FunctionParserException("Missing exp at defs[" + idx
						+ "]");

			final Command fr;
			try {
				fr = context.parse(ex, SyntaxFactory.getInstance()
						.getFunctionSyntax());
			} catch (final FunctionParserException e) {
				throw new FunctionParserException("Error in \"" + id + "\": "
						+ e.getMessage(), e);
			}
			switch (t) {
			case "var":
				final AbstractVariableCommand vr = AbstractVariableCommand
						.create(id, fr);
				context.put(id, vr);
				generator.add(id, vr);
				break;
			case "func":
				final AbstractCachedCommand function = AbstractCachedCommand
						.create(fr);
				context.put(id, fr);
				generator.add(id, function);
				break;
			default:
				throw new FunctionParserException("Wrong type \"" + t + "\"");
			}
		}

		/*
		 * Parse update
		 */
		@SuppressWarnings("unchecked")
		final List<Map<String, String>> u = (List<Map<String, String>>) data
				.get("update");
		if (u != null) {
			idx = 0;
			for (final Map<String, String> d : u) {
				final String id = d.get("id");
				if (id == null)
					throw new FunctionParserException("Missing id for update["
							+ idx + "]");
				final String ex = d.get("exp");
				if (ex == null)
					throw new FunctionParserException("Missing exp for update["
							+ idx + "]");
				final VariableCommand v = generator.getVariable(id);
				if (v == null)
					throw new FunctionParserException("Variable \"" + id
							+ "\" not found for update[" + idx + "]");
				final Command fr = context.parse(ex, SyntaxFactory
						.getInstance().getFunctionSyntax());
				if (fr.getType() != v.getType()) {
					throw new FunctionParserException(
							"Update function return a " + fr.getType()
									+ " for update[" + idx + "]");
				}
				v.setUpdateFunction(fr);
			}
		}

		/*
		 * Parse update
		 */
		@SuppressWarnings("unchecked")
		final List<Map<String, String>> c = (List<Map<String, String>>) data
				.get("corpe");
		if (c != null) {
			int i = 0;
			for (final Map<String, String> d : c) {
				final String l = d.get("location");
				if (l == null)
					throw new FunctionParserException(
							"Location undefined for corpse #" + i + ".");

				final Command tfd = generator.getFunction(l);
				if (tfd == null)
					throw new FunctionParserException("Function \"" + l
							+ "\" undefined.");
				if (tfd.getType() != Type.VECTOR)
					throw new FunctionParserException("Function \"" + l
							+ "\" is not a vector.");
				final TypeDimensions dims = tfd.getDimensions();
				final int dim = dims.getRowCount();
				if (dim != 3)
					throw new FunctionParserException("Function \"" + l
							+ "\" is not a location vector in 3D space (" + dim
							+ "D).");

				final String r = d.get("rotation");
				if (r != null) {
					final Command rfd = generator.getFunction(r);
					if (rfd == null)
						throw new FunctionParserException("Function \"" + r
								+ "\" undefined.");
					if (rfd.getType() != Type.QUATERNION)
						throw new FunctionParserException("Function \"" + r
								+ "\" is not a quaternion.");
				}

				generator.add(new CorpeDefs(l, r));
				++i;
			}
		}
		return generator;
	}
}
