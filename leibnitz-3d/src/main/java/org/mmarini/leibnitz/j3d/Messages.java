/**
 * 
 */
package org.mmarini.leibnitz.j3d;

import java.util.MissingResourceException;
import java.util.ResourceBundle;

/**
 * @author US00852
 * 
 */
public class Messages {
	private static final String BUNDLE_NAME = "org.mmarini.leibnitz.j3d.messages"; //$NON-NLS-1$

	public static final ResourceBundle RESOURCE_BUNDLE = ResourceBundle
			.getBundle(BUNDLE_NAME);

	public static String getString(final String key) {
		try {
			return RESOURCE_BUNDLE.getString(key);
		} catch (final MissingResourceException e) {
			return '!' + key + '!';
		}
	}

	private Messages() {
	}
}
