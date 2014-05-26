/**
 * 
 */
package org.mmarini.leibnitz.j3d;

import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;

import javax.media.j3d.Behavior;
import javax.media.j3d.WakeupCriterion;
import javax.media.j3d.WakeupOnActivation;
import javax.media.j3d.WakeupOnDeactivation;
import javax.media.j3d.WakeupOnElapsedFrames;
import javax.media.j3d.WakeupOr;

import org.mmarini.leibnitz.FunctionGenerator;

/**
 * @author US00852
 * 
 */
public class LeibnitzBehaviour extends Behavior {

	private final WakeupOr activeCriterion;
	private final WakeupCriterion inactiveCriterion;
	private final List<Corpe> list;
	private FunctionGenerator generator;
	private long dt;
	private long last;

	/**
	 * 
	 */
	public LeibnitzBehaviour() {
		list = new ArrayList<Corpe>();
		inactiveCriterion = new WakeupOnActivation();
		activeCriterion = new WakeupOr(new WakeupCriterion[] {
				new WakeupOnElapsedFrames(1), new WakeupOnDeactivation() });
	}

	/**
	 * 
	 * @param string
	 * @param particle
	 */
	public void addCorpe(final Corpe particle) {
		list.add(particle);
	}

	/**
	 * 
	 */
	public void clearCorpes() {
		list.clear();
	}

	/**
	 * @see javax.media.j3d.Behavior#initialize()
	 */
	@Override
	public void initialize() {
		wakeupOn(inactiveCriterion);
	}

	/**
	 * 
	 */
	private void processLocation() {
		final long now = System.nanoTime();
		long elapsed = now - last;
		if (generator != null && elapsed >= dt) {
			/*
			 * if it has past more then the time differential between previous
			 * update, compute the new state
			 */
			/*
			 * Iterate the computing to match the elapsed time
			 */
			while (elapsed >= dt) {
				generator.apply();
				elapsed -= dt;
				last += dt;
			}
			for (final Corpe particle : list)
				particle.apply();
		}
	}

	/**
	 * @see javax.media.j3d.Behavior#processStimulus(java.util.Enumeration)
	 */
	@Override
	public void processStimulus(
			@SuppressWarnings("rawtypes") final Enumeration conds) {
		while (conds.hasMoreElements()) {
			final Object el = conds.nextElement();
			if (el instanceof WakeupOnActivation) {
				last = System.nanoTime();
				wakeupOn(activeCriterion);
			} else if (el instanceof WakeupOnElapsedFrames) {
				processLocation();
				wakeupOn(activeCriterion);
			} else if (el instanceof WakeupOnDeactivation) {
				wakeupOn(inactiveCriterion);
			}
		}
	}

	/**
	 * @param dt
	 *            the dt to set
	 */
	public void setDt(final long dt) {
		this.dt = dt;
	}

	/**
	 * @param generator
	 *            the generator to set
	 */
	public void setGenerator(final FunctionGenerator generator) {
		this.generator = generator;
	}
}
