/**
 * A class that provides utility functions for validating objects and arrays.
 */
export class Validators {
	/**
	 * Checks if two objects are the same.
	 * @param {T} obj1 The first object to compare.
	 * @param {T} obj2 The second object to compare.
	 * @returns {boolean} True if the objects are the same, false otherwise.
	 */
	public static isSameObject<T extends object>(obj1: T, obj2: T): boolean {
		if (Object.keys(obj1).length !== Object.keys(obj2).length) {
			return false;
		}
		for (const key in obj1) {
			if (typeof obj1[key] !== typeof obj2[key]) {
				return false;
			}
			if (typeof obj1[key] === "object") {
				if (!Validators.isSameObject<any>(obj1[key], obj2[key])) {
					return false;
				}
			} else if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
				if (!Validators.isSameArray<any>(obj1[key], obj2[key])) {
					return false;
				}
			} else {
				if (obj1[key] !== obj2[key]) {
					return false;
				}
			}
		}
		return true;
	}

	/**
	 * Checks if two arrays are the same.
	 * @param {T[]} arr1 The first array to compare.
	 * @param {T[]} arr2 The second array to compare.
	 * @returns {boolean} True if the arrays are the same, false otherwise.
	 */
	public static isSameArray<T>(arr1: T[], arr2: T[]): boolean {
		if (arr1.length !== arr2.length) {
			return false;
		}
		// arrays can be in different order
		const sortedArr1 = [...arr1].sort();
		const sortedArr2 = [...arr2].sort();
		for (let i = 0; i < arr1.length; i++) {
			const type1 = typeof sortedArr1[i];
			const type2 = typeof sortedArr2[i];
			if (type1 !== type2) {
				return false;
			}
			const type = type1;
			if (
				type === "string" ||
				type === "number" ||
				type === "bigint" ||
				type === "boolean"
			) {
				if (sortedArr1[i] !== sortedArr2[i]) {
					return false;
				}
			} else if (type === "object") {
				if (
					!Validators.isSameObject<any>(sortedArr1[i], sortedArr2[i])
				) {
					return false;
				}
			} else {
				if (
					type !== typeof sortedArr1[i] ||
					sortedArr1[i] !== sortedArr2[i]
				) {
					return false;
				}
			}
		}
		return true;
	}
}
