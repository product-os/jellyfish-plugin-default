/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

const _ = require('lodash')

const defaultCardMixins = require('./mixins')

module.exports = ({
	mixin, initialize, ...coreMixins
}) => {
	const mixins = {
		mixin,
		...coreMixins,
		...defaultCardMixins
	}

	const defaultCards = [
		// Users
		require('./contrib/user-guest.json'),

		// Roles
		require('./contrib/role-user-community.json'),
		require('./contrib/role-user-operator.json'),
		require('./contrib/role-user-guest.json'),
		require('./contrib/role-user-test.json'),
		require('./contrib/role-user-external-support.json'),

		// Internal views
		require('./contrib/view-active-triggered-actions.json'),
		require('./contrib/view-active.json'),
		require('./contrib/view-non-executed-action-requests.json'),

		// Types
		require('./contrib/account.js')(mixins),
		require('./contrib/blog-post.js')(mixins),
		require('./contrib/brainstorm-call.js')(mixins),
		require('./contrib/brainstorm-topic')(mixins),
		require('./contrib/changelog.js')(mixins),
		require('./contrib/checkin.js')(mixins),
		require('./contrib/contact.js')(mixins),
		require('./contrib/email-sequence.json'),
		require('./contrib/external-event.json'),
		require('./contrib/faq.json'),
		require('./contrib/feedback-item.json'),
		require('./contrib/form-response.json'),
		require('./contrib/form-response-curation.json'),
		require('./contrib/user-feedback.json'),
		require('./contrib/issue.js')(mixins),
		require('./contrib/message.js')(mixins),
		require('./contrib/first-time-login.json'),
		require('./contrib/opportunity.js')(mixins),
		require('./contrib/password-reset.json'),
		require('./contrib/pattern.js')(mixins),
		require('./contrib/ping.json'),
		require('./contrib/pipeline.json'),
		require('./contrib/milestone.json'),
		require('./contrib/notification.json'),
		require('./contrib/product-improvement')(mixins),
		require('./contrib/product.json'),
		require('./contrib/project.json'),
		require('./contrib/pull-request')(mixins),
		require('./contrib/push.json'),
		require('./contrib/rating.js')(mixins),
		require('./contrib/repository.js')(mixins),
		require('./contrib/specification.json'),
		require('./contrib/subscription.json'),
		require('./contrib/sales-thread.js')(mixins),
		require('./contrib/support-issue')(mixins),
		require('./contrib/support-thread')(mixins),
		require('./contrib/tag.json'),
		require('./contrib/thread')(mixins),
		require('./contrib/view-all-pipelines.json'),
		require('./contrib/whisper.js')(mixins),
		require('./contrib/workflow.json'),
		require('./contrib/web-push-subscription.json'),
		require('./contrib/group.json'),
		require('./contrib/summary.json'),

		// Triggered actions
		require('./contrib/triggered-action-github-issue-link.json'),
		require('./contrib/triggered-action-hangouts-link.json'),
		require('./contrib/triggered-action-increment-tag.json'),
		require('./contrib/triggered-action-user-contact.json'),
		require('./contrib/triggered-action-integration-import-event.json'),
		require('./contrib/triggered-action-integration-github-mirror-event.json'),
		require('./contrib/triggered-action-integration-front-mirror-event.json'),
		require('./contrib/triggered-action-integration-discourse-mirror-event.json'),
		require('./contrib/triggered-action-integration-outreach-mirror-event.json'),
		require('./contrib/triggered-action-set-user-avatar.json'),
		require('./contrib/triggered-action-support-summary.json'),
		require('./contrib/triggered-action-support-reopen.json'),
		require('./contrib/triggered-action-support-closed-issue-reopen.json'),
		require('./contrib/triggered-action-support-closed-pull-request-reopen.json'),
		require('./contrib/triggered-action-sync-thread-post-link-whisper.json'),
		require('./contrib/triggered-action-update-event-edited-at.json'),

		// User facing views
		require('./contrib/view-all-views.json'),
		require('./contrib/view-my-orgs.json'),
		require('./contrib/view-my-conversations.json'),
		require('./contrib/view-all-by-type.json'),
		require('./contrib/view-all-pull-requests.json'),
		require('./contrib/view-all-ratings.json'),

		// Balena org cards
		require('./balena/org-balena.json'),
		require('./balena/os-test-result')(mixins),
		require('./balena/product-balena-cloud.json'),
		require('./balena/product-jellyfish.json'),
		require('./balena/view-all-blog-posts.json'),
		require('./balena/view-all-users-feedback.json'),
		require('./balena/view-new-users-feedback.json'),
		require('./balena/view-curated-users-feedback.json'),
		require('./balena/view-typeform-responses.json'),
		require('./balena/view-curate-typeform-responses.json'),
		require('./balena/view-all-brainstorm-calls.json'),
		require('./balena/view-all-brainstorm-topics.json'),
		require('./balena/view-all-checkins.json'),
		require('./balena/view-all-contacts.json'),
		require('./balena/view-all-customers.json'),
		require('./balena/view-all-faqs.json'),
		require('./balena/view-all-groups.json'),
		require('./balena/view-all-issues.json'),
		require('./balena/view-all-jellyfish-support-threads.json'),
		require('./balena/view-all-messages.json'),
		require('./balena/view-all-opportunities.json'),
		require('./balena/view-my-opportunities.json'),
		require('./balena/view-all-patterns.json'),
		require('./balena/view-all-product-improvements.json'),
		require('./balena/view-all-products.json'),
		require('./balena/view-all-projects.json'),
		require('./balena/view-all-sales-threads.json'),
		require('./balena/view-all-specifications.json'),
		require('./balena/view-all-support-issues.json'),
		require('./balena/view-balena-chat.json'),
		require('./balena/view-support-knowledge-base.json'),
		require('./balena/view-support-threads-participation.json'),
		require('./balena/view-all-forum-threads.json'),
		require('./balena/view-all-support-threads.json'),
		require('./balena/view-paid-support-threads.json'),
		require('./balena/view-all-users.json'),
		require('./balena/view-changelogs.json'),
		require('./balena/view-customer-success-support-threads.json'),
		require('./balena/view-devices-support-threads.json'),
		require('./balena/view-fleetops-support-threads.json'),
		require('./balena/view-os-test-results.json'),
		require('./balena/view-product-specs.json'),
		require('./balena/view-security-support-threads.json'),
		require('./balena/view-support-threads-pending-update.json'),
		require('./balena/view-support-threads-to-audit.json'),
		require('./balena/view-workflows.json')
	]

	return _.reduce(defaultCards, (cardMap, card) => {
		const initializedCard = initialize(card)
		if (cardMap[initializedCard.slug]) {
			throw new Error(`Duplicate cards with slug '${initializedCard.slug}' found`)
		}
		cardMap[initializedCard.slug] = initializedCard
		return cardMap
	}, {})
}
