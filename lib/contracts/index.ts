import type { ContractDefinition } from '@balena/jellyfish-types/build/core';
import { account } from './account';
import { blogPost } from './blog-post';
import { brainstormCall } from './brainstorm-call';
import { brainstormTopic } from './brainstorm-topic';
import { chartConfiguration } from './chart-configuration';
import { checkin } from './checkin';
import { externalEvent } from './external-event';
import { faq } from './faq';
import { feedbackItem } from './feedback-item';
import { firstTimeLogin } from './first-time-login';
import { group } from './group';
import { improvement } from './improvement';
import { message } from './message';
import { milestone } from './milestone';
import { notification } from './notification';
import { opportunity } from './opportunity';
import { orgBalena } from './org-balena';
import { passwordReset } from './password-reset';
import { pattern } from './pattern';
import { ping } from './ping';
import { pipeline } from './pipeline';
import { pokemon } from './pokemon';
import { product } from './product';
import { productBalenaCloud } from './product-balena-cloud';
import { productJellyfish } from './product-jellyfish';
import { project } from './project';
import { rating } from './rating';
import { relationshipAccountHasBackupOwnerUser } from './relationship-account-has-backup-owner-user';
import { relationshipAccountHasContact } from './relationship-account-has-contact';
import { relationshipAccountIsOwnedByUser } from './relationship-account-is-owned-by-user';
import { relationshipBrainstormCallHasAttachedBrainstormTopic } from './relationship-brainstorm-call-has-attached-brainstorm-topic';
import { relationshipBrainstormTopicHasAttachedImprovement } from './relationship-brainstorm-topic-has-attached-improvement';
import { relationshipBrainstormTopicHasAttachedPattern } from './relationship-brainstorm-topic-has-attached-pattern';
import { relationshipBrainstormTopicHasAttachedSalesThread } from './relationship-brainstorm-topic-has-attached-sales-thread';
import { relationshipBrainstormTopicHasAttachedSupportThread } from './relationship-brainstorm-topic-has-attached-support-thread';
import { relationshipBrainstormTopicHasAttachedThread } from './relationship-brainstorm-topic-has-attached-thread';
import { relationshipChartConfigurationIsAttachedToView } from './relationship-chart-configuration-is-attached-to-view';
import { relationshipCheckinIsAttendedByUser } from './relationship-checkin-is-attended-by-user';
import { relationshipFeedbackItemIsFeedbackForUser } from './relationship-feedback-item-is-feedback-for-user';
import { relationshipGroupHasGroupMemberUser } from './relationship-group-has-group-member-user';
import { relationshipImprovementHasAttachedMilestone } from './relationship-improvement-has-attached-milestone';
import { relationshipImprovementHasDedicatedUserUser } from './relationship-improvement-has-dedicated-user-user';
import { relationshipImprovementIsAttachedToPattern } from './relationship-improvement-is-attached-to-pattern';
import { relationshipImprovementIsContributedToByUser } from './relationship-improvement-is-contributed-to-by-user';
import { relationshipImprovementIsGuidedByUser } from './relationship-improvement-is-guided-by-user';
import { relationshipImprovementIsImplementedByProject } from './relationship-improvement-is-implemented-by-project';
import { relationshipImprovementIsOwnedByUser } from './relationship-improvement-is-owned-by-user';
import { relationshipMilestoneIsOwnedByUser } from './relationship-milestone-is-owned-by-user';
import { relationshipMilestoneRequiresMilestone } from './relationship-milestone-requires-milestone';
import { relationshipNotificationIsAttachedToAny } from './relationship-notification-is-attached-to-any';
import { relationshipNotificationIsReadByUser } from './relationship-notification-is-read-by-user';
import { relationshipOpportunityHasBackupOwnerUser } from './relationship-opportunity-has-backup-owner-user';
import { relationshipOpportunityIsAttachedToAccount } from './relationship-opportunity-is-attached-to-account';
import { relationshipOpportunityIsOwnedByUser } from './relationship-opportunity-is-owned-by-user';
import { relationshipPatternIsAttachedToSalesThread } from './relationship-pattern-is-attached-to-sales-thread';
import { relationshipPatternIsAttachedToSupportThread } from './relationship-pattern-is-attached-to-support-thread';
import { relationshipPatternIsAttachedToThread } from './relationship-pattern-is-attached-to-thread';
import { relationshipPatternIsOwnedByUser } from './relationship-pattern-is-owned-by-user';
import { relationshipPatternRelatesToPattern } from './relationship-pattern-relates-to-pattern';
import { relationshipProjectHasCheckin } from './relationship-project-has-checkin';
import { relationshipProjectHasMemberUser } from './relationship-project-has-member-user';
import { relationshipProjectImplementsMilestone } from './relationship-project-implements-milestone';
import { relationshipProjectIsContributedToByUser } from './relationship-project-is-contributed-to-by-user';
import { relationshipProjectIsGuidedByUser } from './relationship-project-is-guided-by-user';
import { relationshipProjectIsObservedByUser } from './relationship-project-is-observed-by-user';
import { relationshipProjectIsOwnedByUser } from './relationship-project-is-owned-by-user';
import { relationshipSagaHasAttachedImprovement } from './relationship-saga-has-attached-improvement';
import { relationshipSalesThreadIsAttachedToOpportunity } from './relationship-sales-thread-is-attached-to-opportunity';
import { relationshipSalesThreadIsOwnedByUser } from './relationship-sales-thread-is-owned-by-user';
import { relationshipSubscriptionIsAttachedToAny } from './relationship-subscription-is-attached-to-any';
import { relationshipSupportThreadHasAttachedRating } from './relationship-support-thread-has-attached-rating';
import { relationshipSupportThreadIsOwnedByUser } from './relationship-support-thread-is-owned-by-user';
import { relationshipSupportThreadIsSourceForFeedbackItem } from './relationship-support-thread-is-source-for-feedback-item';
import { relationshipUserOwnsRating } from './relationship-user-owns-rating';
import { roleUserExternalSupport } from './role-user-external-support';
import { saga } from './saga';
import { salesThread } from './sales-thread';
import { subscription } from './subscription';
import { summary } from './summary';
import { supportThread } from './support-thread';
import { tag } from './tag';
import { thread } from './thread';
import { triggeredActionHangoutsLink } from './triggered-action-hangouts-link';
import { triggeredActionIncrementTag } from './triggered-action-increment-tag';
import { triggeredActionIntegrationImportEvent } from './triggered-action-integration-import-event';
import { triggeredActionSetUserAvatar } from './triggered-action-set-user-avatar';
import { triggeredActionSupportCompletedImprovementReopen } from './triggered-action-support-completed-improvement-reopen';
import { triggeredActionSupportReopen } from './triggered-action-support-reopen';
import { triggeredActionSupportSummary } from './triggered-action-support-summary';
import { triggeredActionSyncThreadPostLinkWhisper } from './triggered-action-sync-thread-post-link-whisper';
import { triggeredActionUpdateEventEditedAt } from './triggered-action-update-event-edited-at';
import { triggeredActionUserContact } from './triggered-action-user-contact';
import { userGuest } from './user-guest';
import { viewActive } from './view-active';
import { viewActiveTriggeredActions } from './view-active-triggered-actions';
import { viewAllBlogPosts } from './view-all-blog-posts';
import { viewAllBrainstormCalls } from './view-all-brainstorm-calls';
import { viewAllBrainstormTopics } from './view-all-brainstorm-topics';
import { viewAllContacts } from './view-all-contacts';
import { viewAllCustomers } from './view-all-customers';
import { viewAllFaqs } from './view-all-faqs';
import { viewAllGroups } from './view-all-groups';
import { viewAllImprovements } from './view-all-improvements';
import { viewAllOpportunities } from './view-all-opportunities';
import { viewAllPatterns } from './view-all-patterns';
import { viewAllPokemons } from './view-all-pokemons';
import { viewAllProjects } from './view-all-projects';
import { viewAllSagas } from './view-all-sagas';
import { viewAllSalesThreads } from './view-all-sales-threads';
import { viewAllViews } from './view-all-views';
import { viewCustomerSuccessSupportThreads } from './view-customer-success-support-threads';
import { viewMyConversations } from './view-my-conversations';
import { viewMyOpportunities } from './view-my-opportunities';
import { viewMyOrgs } from './view-my-orgs';
import { viewNonExecutedActionRequests } from './view-non-executed-action-requests';
import { viewPaidSupportThreads } from './view-paid-support-threads';
import { viewSecuritySupportThreads } from './view-security-support-threads';
import { viewSupportThreadsParticipation } from './view-support-threads-participation';
import { viewWorkflows } from './view-workflows';
import { webPushSubscription } from './web-push-subscription';
import { whisper } from './whisper';
import { workflow } from './workflow';

export const contracts: ContractDefinition[] = [
	// User-defined
	pokemon,
	viewAllPokemons,

	// Users
	userGuest,

	// Roles
	roleUserExternalSupport,

	// Internal views
	viewActiveTriggeredActions,
	viewActive,
	viewNonExecutedActionRequests,

	// Types
	account,
	blogPost,
	brainstormCall,
	brainstormTopic,
	chartConfiguration,
	checkin,
	externalEvent,
	faq,
	feedbackItem,
	improvement,
	message,
	firstTimeLogin,
	opportunity,
	passwordReset,
	pattern,
	ping,
	pipeline,
	milestone,
	notification,
	product,
	project,
	rating,
	saga,
	subscription,
	salesThread,
	supportThread,
	tag,
	thread,
	whisper,
	workflow,
	webPushSubscription,
	group,
	summary,

	// Triggered actions
	triggeredActionHangoutsLink,
	triggeredActionIncrementTag,
	triggeredActionUserContact,
	triggeredActionIntegrationImportEvent,
	triggeredActionSetUserAvatar,
	triggeredActionSupportSummary,
	triggeredActionSupportReopen,
	triggeredActionSupportCompletedImprovementReopen,
	triggeredActionSyncThreadPostLinkWhisper,
	triggeredActionUpdateEventEditedAt,

	// User facing views
	viewAllViews,
	viewMyOrgs,
	viewMyConversations,

	// Balena org cards
	orgBalena,
	productBalenaCloud,
	productJellyfish,
	viewAllBlogPosts,
	viewAllBrainstormCalls,
	viewAllBrainstormTopics,
	viewAllContacts,
	viewAllCustomers,
	viewAllFaqs,
	viewAllGroups,
	viewAllImprovements,
	viewAllOpportunities,
	viewMyOpportunities,
	viewAllPatterns,
	viewAllProjects,
	viewAllSagas,
	viewAllSalesThreads,
	viewSupportThreadsParticipation,
	viewPaidSupportThreads,
	viewCustomerSuccessSupportThreads,
	viewSecuritySupportThreads,
	viewWorkflows,

	// Relationships
	relationshipAccountHasBackupOwnerUser,
	relationshipAccountHasContact,
	relationshipAccountIsOwnedByUser,
	relationshipBrainstormCallHasAttachedBrainstormTopic,
	relationshipBrainstormTopicHasAttachedImprovement,
	relationshipBrainstormTopicHasAttachedPattern,
	relationshipBrainstormTopicHasAttachedSalesThread,
	relationshipBrainstormTopicHasAttachedSupportThread,
	relationshipBrainstormTopicHasAttachedThread,
	relationshipChartConfigurationIsAttachedToView,
	relationshipCheckinIsAttendedByUser,
	relationshipFeedbackItemIsFeedbackForUser,
	relationshipGroupHasGroupMemberUser,
	relationshipImprovementHasAttachedMilestone,
	relationshipImprovementHasDedicatedUserUser,
	relationshipImprovementIsAttachedToPattern,
	relationshipImprovementIsContributedToByUser,
	relationshipImprovementIsGuidedByUser,
	relationshipImprovementIsImplementedByProject,
	relationshipImprovementIsOwnedByUser,
	relationshipMilestoneIsOwnedByUser,
	relationshipMilestoneRequiresMilestone,
	relationshipNotificationIsAttachedToAny,
	relationshipNotificationIsReadByUser,
	relationshipOpportunityHasBackupOwnerUser,
	relationshipOpportunityIsAttachedToAccount,
	relationshipOpportunityIsOwnedByUser,
	relationshipPatternIsAttachedToSalesThread,
	relationshipPatternIsAttachedToSupportThread,
	relationshipPatternIsAttachedToThread,
	relationshipPatternIsOwnedByUser,
	relationshipPatternRelatesToPattern,
	relationshipProjectHasCheckin,
	relationshipProjectHasMemberUser,
	relationshipProjectImplementsMilestone,
	relationshipProjectIsContributedToByUser,
	relationshipProjectIsGuidedByUser,
	relationshipProjectIsObservedByUser,
	relationshipProjectIsOwnedByUser,
	relationshipSagaHasAttachedImprovement,
	relationshipSalesThreadIsAttachedToOpportunity,
	relationshipSalesThreadIsOwnedByUser,
	relationshipSubscriptionIsAttachedToAny,
	relationshipSupportThreadHasAttachedRating,
	relationshipSupportThreadIsOwnedByUser,
	relationshipSupportThreadIsSourceForFeedbackItem,
	relationshipUserOwnsRating,
];
