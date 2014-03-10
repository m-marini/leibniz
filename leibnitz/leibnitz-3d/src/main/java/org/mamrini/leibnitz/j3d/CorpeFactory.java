/**
 * 
 */
package org.mamrini.leibnitz.j3d;

import java.awt.Color;

import javax.vecmath.Color3f;

import org.mmarini.fp.FPArrayList;
import org.mmarini.fp.FPList;
import org.mmarini.leibnitz.FunctionGenerator;
import org.mmarini.leibnitz.parser.CorpeDefs;

/**
 * @author US00852
 * 
 */
public class CorpeFactory {

	private final FunctionGenerator generator;

	/**
	 * @param generator
	 */
	public CorpeFactory(final FunctionGenerator generator) {
		this.generator = generator;
	}

	/**
	 * 
	 * @return
	 */
	public FPList<AbstractCorpe> build() {
		int i = 0;
		final FPList<AbstractCorpe> r = new FPArrayList<>();
		final int m = generator.getCorpes().size();
		final int k = m > 1 ? m - 1 : 1;
		for (final CorpeDefs cd : generator.getCorpes()) {
			final Color3f color = new Color3f(Color.getHSBColor(0.75f * i / k,
					1f, 1f));
			final String rot = cd.getRotation();
			AbstractCorpe c;
			if (rot == null) {
				final Particle o = new Particle();
				o.setColor(color);
				c = o;

			} else {
				final Diamond d = new Diamond();
				d.setColor(color);
				d.setRotationFunction(rot);
				c = d;
			}
			c.setGenerator(generator);
			c.setTranslateFunction(cd.getLocation());
			r.add(c);
			++i;
		}
		generator.init();
		return r;
	}
}
