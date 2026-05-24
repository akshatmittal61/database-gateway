/**
 * Converts a MongoDB response to a plain JavaScript object.
 * This function is used to convert the response from a MongoDB query
 * to a plain JavaScript object that can be used by the application.
 * @param {any} response The response from a MongoDB query.
 * @returns {T | null} The converted object, or null if the response is null or undefined.
 */
export const getObjectFromMongoResponse = <T>(response: any): T | null => {
	if (response === null || response === undefined) {
		return null;
	}
	const object = response.toObject ? response.toObject() : response;

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { _id, id, __v, createdAt, updatedAt, ...rest } = object;
	const entityId = (_id ?? id).toString();
	const data = {
		...rest,
		id: entityId,
	};
	if (createdAt) {
		data.createdAt = new Date(createdAt).toISOString();
	}
	if (updatedAt) {
		data.updatedAt = new Date(updatedAt).toISOString();
	}
	return data;
};
