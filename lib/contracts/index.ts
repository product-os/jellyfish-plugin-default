import type { ContractDefinition } from '@balena/jellyfish-types/build/core';
import { account } from './account';
import { blogPost } from './blog-post';
import { brainstormCall } from './brainstorm-call';
import { brainstormTopic } from './brainstorm-topic';
import { chartConfiguration } from './chart-configuration';
import { checkin } from './checkin';
import { contact } from './contact';
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
import { product } from './product';
import { productBalenaCloud } from './product-balena-cloud';
import { productJellyfish } from './product-jellyfish';
import { project } from './project';
import { rating } from './rating';
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
	contact,
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

	// Balena org contracts
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
];
