import { userGuest } from './contrib/user-guest';
import { roleUserCommunity } from './contrib/role-user-community';
import { roleUserOperator } from './contrib/role-user-operator';
import { roleUserGuest } from './contrib/role-user-guest';
import { roleUserTest } from './contrib/role-user-test';
import { roleUserExternalSupport } from './contrib/role-user-external-support';
import { viewActiveTriggeredActions } from './contrib/view-active-triggered-actions';
import { viewActive } from './contrib/view-active';
import { viewNonExecutedActionRequests } from './contrib/view-non-executed-action-requests';
import { account } from './contrib/account';
import { blogPost } from './contrib/blog-post';
import { brainstormCall } from './contrib/brainstorm-call';
import { brainstormTopic } from './contrib/brainstorm-topic';
import { chartConfiguration } from './contrib/chart-configuration';
import { checkin } from './contrib/checkin';
import { contact } from './contrib/contact';
import { externalEvent } from './contrib/external-event';
import { faq } from './contrib/faq';
import { feedbackItem } from './contrib/feedback-item';
import { improvement } from './contrib/improvement';
import { message } from './contrib/message';
import { firstTimeLogin } from './contrib/first-time-login';
import { opportunity } from './contrib/opportunity';
import { passwordReset } from './contrib/password-reset';
import { pattern } from './contrib/pattern';
import { ping } from './contrib/ping';
import { pipeline } from './contrib/pipeline';
import { milestone } from './contrib/milestone';
import { notification } from './contrib/notification';
import { product } from './contrib/product';
import { project } from './contrib/project';
import { rating } from './contrib/rating';
import { saga } from './contrib/saga';
import { subscription } from './contrib/subscription';
import { salesThread } from './contrib/sales-thread';
import { supportThread } from './contrib/support-thread';
import { tag } from './contrib/tag';
import { thread } from './contrib/thread';
import { whisper } from './contrib/whisper';
import { workflow } from './contrib/workflow';
import { webPushSubscription } from './contrib/web-push-subscription';
import { group } from './contrib/group';
import { summary } from './contrib/summary';
import { triggeredActionHangoutsLink } from './contrib/triggered-action-hangouts-link';
import { triggeredActionIncrementTag } from './contrib/triggered-action-increment-tag';
import { triggeredActionUserContact } from './contrib/triggered-action-user-contact';
import { triggeredActionIntegrationImportEvent } from './contrib/triggered-action-integration-import-event';
import { triggeredActionSetUserAvatar } from './contrib/triggered-action-set-user-avatar';
import { triggeredActionSupportSummary } from './contrib/triggered-action-support-summary';
import { triggeredActionSupportReopen } from './contrib/triggered-action-support-reopen';
import { triggeredActionSupportCompletedImprovementReopen } from './contrib/triggered-action-support-completed-improvement-reopen';
import { triggeredActionSyncThreadPostLinkWhisper } from './contrib/triggered-action-sync-thread-post-link-whisper';
import { triggeredActionUpdateEventEditedAt } from './contrib/triggered-action-update-event-edited-at';
import { viewAllViews } from './contrib/view-all-views';
import { viewMyOrgs } from './contrib/view-my-orgs';
import { viewMyConversations } from './contrib/view-my-conversations';
import { orgBalena } from './balena/org-balena';
import { productBalenaCloud } from './balena/product-balena-cloud';
import { productJellyfish } from './balena/product-jellyfish';
import { viewAllBlogPosts } from './balena/view-all-blog-posts';
import { viewAllBrainstormCalls } from './balena/view-all-brainstorm-calls';
import { viewAllBrainstormTopics } from './balena/view-all-brainstorm-topics';
import { viewAllContacts } from './balena/view-all-contacts';
import { viewAllCustomers } from './balena/view-all-customers';
import { viewAllFaqs } from './balena/view-all-faqs';
import { viewAllGroups } from './balena/view-all-groups';
import { viewAllImprovements } from './balena/view-all-improvements';
import { viewAllOpportunities } from './balena/view-all-opportunities';
import { viewMyOpportunities } from './balena/view-my-opportunities';
import { viewAllPatterns } from './balena/view-all-patterns';
import { viewAllProjects } from './balena/view-all-projects';
import { viewAllSagas } from './balena/view-all-sagas';
import { viewAllSalesThreads } from './balena/view-all-sales-threads';
import { viewSupportThreadsParticipation } from './balena/view-support-threads-participation';
import { viewAllForumThreads } from './balena/view-all-forum-threads';
import { viewPaidSupportThreads } from './balena/view-paid-support-threads';
import { viewCustomerSuccessSupportThreads } from './balena/view-customer-success-support-threads';
import { viewSecuritySupportThreads } from './balena/view-security-support-threads';
import { viewWorkflows } from './balena/view-workflows';

export const cards = [
	// Users
	userGuest,

	// Roles
	roleUserCommunity,
	roleUserOperator,
	roleUserGuest,
	roleUserTest,
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
	viewAllForumThreads,
	viewPaidSupportThreads,
	viewCustomerSuccessSupportThreads,
	viewSecuritySupportThreads,
	viewWorkflows,
];
