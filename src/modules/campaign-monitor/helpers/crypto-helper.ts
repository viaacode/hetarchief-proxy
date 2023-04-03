import crypto from 'crypto';

const encryptionParams = (): {
	key: string;
	encryptionIV: string;
	encryption_method: string;
} => {
	const secret_key = process.env.CAMPAIN_MONITOR_CONFIRM_EMAIL_TOKEN_SECRET_KEY;
	const secret_iv = process.env.CAMPAIN_MONITOR_CONFIRM_EMAIL_TOKEN_SECRET_IV;
	const encryption_method = process.env.CAMPAIN_MONITOR_CONFIRM_EMAIL_TOKEN_ECNRYPTION_METHOD;
	const key = crypto
		.createHash('sha512')
		.update(secret_key as string)
		.digest('hex')
		.substring(0, 32);
	const encryptionIV = crypto
		.createHash('sha512')
		.update(secret_iv as string)
		.digest('hex')
		.substring(0, 16);
	return { key, encryptionIV, encryption_method };
};
// Encrypt data
export const encryptData = (data: string): string => {
	const cipher = crypto.createCipheriv(
		encryptionParams().encryption_method,
		encryptionParams().key,
		encryptionParams().encryptionIV
	);
	return Buffer.from(cipher.update(data, 'utf8', 'hex') + cipher.final('hex')).toString('base64'); // Encrypts data and converts to hex and base64
};
// Decrypt data
export const decryptData = (encryptedData: string): string => {
	const buff = Buffer.from(encryptedData, 'base64');
	const decipher = crypto.createDecipheriv(
		encryptionParams().encryption_method,
		encryptionParams().key,
		encryptionParams().encryptionIV
	);
	return decipher.update(buff.toString('utf8'), 'hex', 'utf8') + decipher.final('utf8'); // Decrypts data and converts to utf8
};
