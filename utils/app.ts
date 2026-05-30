import crypto from "crypto";

export class AppUtils {
	/**
	 * Generate a new API key for a registered app.
	 *
	 * Key format:  dgw_<identifier>_<32-random-bytes-hex>
	 * Example:     dgw_my-portfolio_a3f8c2d1e4b79f0c...
	 *
	 * Returns:
	 *   fullKey  — the complete key, shown to the user ONCE, never stored
	 *   prefix   — "dgw_<identifier>_", stored plain, used to find the DB row
	 *   hash     — SHA-256(fullKey) as hex, stored for verification
	 */
	public static generateApiKey(identifier: string): {
		fullKey: string;
		prefix: string;
		hash: string;
	} {
		const secret = crypto.randomBytes(32).toString("hex");
		const prefix = `dgw_${identifier}_`;
		const fullKey = `${prefix}${secret}`;
		return { fullKey, prefix, hash: this.hashApiKey(fullKey) };
	}

	/** SHA-256 hash a key. Used both when storing and when verifying. */
	public static hashApiKey(key: string): string {
		return crypto.createHash("sha256").update(key).digest("hex");
	}

	/**
	 * Timing-safe string comparison.
	 * Prevents timing attacks where an attacker infers partial hash matches
	 * from the time it takes the server to reject a request.
	 */
	public static timingSafeCompare(a: string, b: string): boolean {
		// Pad to same length — timingSafeEqual requires equal-length buffers
		const len = Math.max(a.length, b.length);
		const bufA = Buffer.from(a.padEnd(len, "\0"));
		const bufB = Buffer.from(b.padEnd(len, "\0"));
		// Always compare full buffers even if lengths differ (length mismatch = false)
		return a.length === b.length && crypto.timingSafeEqual(bufA, bufB);
	}

	/**
	 * Parse the identifier out of an incoming API key.
	 * Returns null if the key does not match the expected format.
	 *
	 * Format:  dgw_<identifier>_<secret>
	 * Parts:   ["dgw", "<identifier>", "<secret>"]  (secret may not contain underscores)
	 */
	public static parseKeyIdentifier(key: string): string | null {
		if (!key.startsWith("dgw_")) return null;
		const withoutPrefix = key.slice(4); // remove "dgw_"
		const underscoreIdx = withoutPrefix.indexOf("_");
		if (underscoreIdx === -1) return null;
		const identifier = withoutPrefix.slice(0, underscoreIdx);
		return identifier.length > 0 ? identifier : null;
	}
}
