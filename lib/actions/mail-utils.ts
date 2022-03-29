import { defaultEnvironment } from '@balena/jellyfish-environment';
import type { Contract } from '@balena/jellyfish-types/build/core';

const MAIL_OPTIONS = defaultEnvironment.mail.options || {
	domain: '',
};

/**
 * @summary Build and return send email request options.
 * @function
 *
 * @param userContract - user to send email to
 * @param subject - email subject
 * @param html - email body HTML
 * @returns send email request options
 */
export function buildSendEmailOptions(
	userContract: Contract,
	subject: string,
	html: string,
) {
	let userEmail = userContract.data.email;
	if (Array.isArray(userEmail)) {
		userEmail = userEmail[0];
	}

	return {
		fromAddress: `no-reply@${MAIL_OPTIONS.domain}`,
		toAddress: userEmail as string,
		subject,
		html,
	};
}
