import type { ActionFile } from '@balena/jellyfish-plugin-base';
import { actionMaintainContact } from './action-maintain-contact';
import { actionSendNotifications } from './action-send-notifications';

export const actions: ActionFile[] = [
	actionMaintainContact,
	actionSendNotifications,
];
