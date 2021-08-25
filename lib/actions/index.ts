/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import type { ActionFile } from '@balena/jellyfish-plugin-base';
import { actionMaintainContact } from './action-maintain-contact';
import { actionSendNotifications } from './action-send-notifications';

export const actions: ActionFile[] = [
	actionMaintainContact,
	actionSendNotifications,
];
