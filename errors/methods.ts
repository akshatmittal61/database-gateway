export class InaccessibleMethodError extends Error {
	constructor(methodName: string, substitute?: string) {
		let errorMessage = `Method ${methodName} is not accessible.`;
		if (substitute) {
			errorMessage += ` Use ${substitute} instead.`;
		}
		super(errorMessage);
	}
}
