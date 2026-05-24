/**
 * Generates a random number between the given min and max values, inclusive.
 * @param {number} min - The minimum value to return.
 * @param {number} max - The maximum value to return.
 * @returns {number} A random number between min and max, inclusive.
 */
export const random = (min: number, max: number): number =>
	Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Implements a sleep function that holds the current thread for a given number of seconds.
 * Creates a promise that resolves after the given number of seconds.
 * @param {number} seconds - The number of seconds to wait.
 * @returns {Promise<void>} A promise that resolves after the given number of seconds.
 */
export const sleep = (seconds: number): Promise<void> =>
	new Promise((resolve) => setTimeout(resolve, seconds * 1000));

// function for finding max and min of two numbers
export const max = (a: number, b: number) => (a > b ? a : b);
export const min = (a: number, b: number) => (a < b ? a : b);

/**
 * Creates a debounced version of a function.
 * Debouncing is a technique that prevents a function from being called
 * more than once within a certain time window. If the function is called
 * multiple times within the time window, the function passed to debounce
 * will only be called once after the time window has passed.
 * @param {Function} fn - The function to debounce.
 * @param {number} delay - The time window in milliseconds.
 * @returns {Function} A debounced version of the function.
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const debounce = (fn: Function, delay: number): Function => {
	let timeoutId: ReturnType<typeof setTimeout>;
	return (...args: any) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			fn(...args);
		}, delay);
	};
};

// function to get a random ID
export const randomId = () => Math.floor(Math.random() * 1000000000);

/**
 * Creates a slug from the given text.
 * A slug is a string that is used to identify a resource. It is usually
 * a URL-friendly version of the title of the resource. For example, a
 * blog post with the title "Hello World" would have a slug of "hello-world".
 * @param {string} text - The text to create a slug from.
 * @returns {string} The slugified text.
 */
export const slugify = (text: string): string =>
	text
		.toString()
		.toLowerCase()
		.replace(/\s+/g, "-") // Replace spaces with -
		.replace(/[^\w-]+/g, "") // Remove all non-word chars
		.replace(/--+/g, "-") // Replace multiple - with single -
		.replace(/^-+/, "") // Trim - from start of text
		.replace(/-+$/, ""); // Trim - from end of text

/**
 * Omits the given keys from the object.
 * @param {Object} obj The object to omit keys from.
 * @param {string[]} keys The keys to omit.
 * @returns {Object} The new object with the omitted keys.
 */
export const omitKeys = (obj: any, keys: string[]): any => {
	const newObj: any = {};
	Object.keys(obj).forEach((key) => {
		if (!keys.includes(key)) {
			newObj[key] = obj[key];
		}
	});
	return newObj;
};

/**
 * Rounds off a number to a specified number of decimal places.
 * @param {number} num The number to round off.
 * @param {number} decimalPlaces The number of decimal places to round to.
 * @returns {number} The rounded off number.
 */
export const roundOff = (num: number, decimalPlaces: number): number =>
	Math.round(num * 10 ** decimalPlaces) / 10 ** decimalPlaces;

/**
 * Returns a new array containing all elements that are present in both the given arrays.
 * @param {Array<T>} a - The first array to find the intersection of.
 * @param {Array<T>} b - The second array to find the intersection of.
 * @returns {Array<T>} A new array containing all elements that are present in both the given arrays.
 */
export const intersection = <T>(a: Array<T>, b: Array<T>): Array<T> => {
	const s = new Set(b);
	return a.filter((x) => s.has(x));
};

/**
 * Converts an enumeration value to a readable string format.
 * For example, USER_STATUS_JUST_JOINED would be converted to "User Status Just Joined".
 * @param {string} text The enumeration value to convert.
 * @returns {string} The converted string.
 */
export const enumToText = (text: string): string => {
	return text
		.split("_")
		.map((word) => word[0] + word.slice(1).toLowerCase())
		.join(" ");
};

/**
 * Checks whether a given date string is in UTC or Locale format.
 * @param {string} date The date string to check.
 * @returns {"utc" | "locale"} The format of the given date string.
 */
export const checkDateFormat = (date: string): "utc" | "locale" => {
	if (date.includes("T") && date.includes("Z")) {
		return "utc";
	} else {
		return "locale";
	}
};

/**
 * Switches the given date string from one format to another.
 * @param {string} date The date string to switch.
 * @param {"utc" | "locale"} from The format of the given date string.
 * @param {"utc" | "locale"} to The format to switch the date string to.
 * @returns {string} The switched date string.
 */
export const switchDateFormat = (
	date: string,
	from: "utc" | "locale",
	to: "utc" | "locale"
): string => {
	if (from === "utc" && to === "locale") {
		const utcSeconds = new Date(date).getTime() / 1000;
		const isoLocal = new Date(
			utcSeconds * 1000 - new Date().getTimezoneOffset() * 60000
		)
			.toISOString()
			.slice(0, -1);
		return isoLocal;
	} else if (from === "locale" && to === "utc") {
		return new Date(date).toISOString();
	} else {
		return date;
	}
};

/**
 * Sanitizes a given timestamp from a Date object or a string.
 * If the given timestamp is in UTC format, it will be converted to locale format.
 * If the given timestamp is in locale format, it will be left as is.
 * @param {string} timestamp The timestamp to sanitize.
 * @returns {string} The sanitized timestamp.
 */
export const sanitizeTimestampToDate = (timestamp: string) => {
	return checkDateFormat(timestamp) === "utc"
		? switchDateFormat(timestamp, "utc", "locale").split("T")[0]
		: timestamp.split("T")[0];
};

/**
 * Creates an object where every key is a value from the given array and has itself as the value.
 * This is useful for creating enumerations.
 * @example
 * const enumFromString = getEnumeration(["a", "b", "c"]);
 * // enumFromString = { a: "a", b: "b", c: "c" }
 * @returns {Object} An object with the given values as keys and values.
 */
export const getEnumeration = <T extends string>(
	arr: Array<T>
): { [K in T]: K } => {
	const enumeration: { [K in T]: K } = arr.reduce((acc, key) => {
		acc[key] = key;
		return acc;
	}, {} as any);
	return enumeration;
};

/**
 * Tries to extract a search parameter from a given URI. The search parameter
 * is looked up in the following order:
 * 1. The URI is parsed as a URL and the search parameter is looked up in the
 *    URL's searchParams.
 * 2. If the URI is not a valid URL, the search parameter is looked up in the
 *    query string part of the URI.
 * @param {string | undefined} uri The URI to look up the search parameter in.
 * @param {string} param The name of the search parameter to look up.
 * @returns {string | null} The value of the search parameter if it exists, or
 * null if it does not exist.
 */
export const getSearchParam = (
	uri: string | undefined,
	param: string
): string | null => {
	try {
		if (uri === undefined || uri.length === 0) return null;
		const url = (() => {
			try {
				return new URL(uri);
			} catch {
				return null;
			}
		})();
		if (url !== null) {
			const searchParams = url.searchParams;
			const value = searchParams.get(param);
			if (value !== null && value.length !== 0) {
				return value;
			}
		}

		const paramsStr = uri.split("?").length > 1 ? uri.split("?")[1] : "";
		const params = new URLSearchParams(paramsStr);
		return params.get(param);
	} catch {
		return null;
	}
};
