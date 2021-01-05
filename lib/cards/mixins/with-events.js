/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

// This mixin defines all common fields in cards that support
// attached events (i.e. 'timelines')
module.exports = ({
	uiSchemaDef
}) => {
	return {
		data: {
			schema: {
				properties: {
					tags: {
						type: 'array',
						items: {
							type: 'string'
						},
						$$formula: 'UNIQUE(FLATMAP(this.links["is attached to"], "tags"))',
						fullTextSearch: true
					},
					data: {
						properties: {
							participants: {
								type: 'array',
								$$formula: 'UNIQUE(FLATMAP(this.links["is attached to"], "data.actor"))'
							},
							mentionsUser: {
								type: 'array',
								$$formula: 'UNIQUE(FLATMAP(this.links["is attached to"], "data.payload.mentionsUser"))'
							},
							alertsUser: {
								type: 'array',
								$$formula: 'UNIQUE(FLATMAP(this.links["is attached to"], "data.payload.alertsUser"))'
							},
							mentionsGroup: {
								type: 'array',
								$$formula: 'UNIQUE(FLATMAP(this.links["is attached to"], "data.payload.mentionsGroup"))'
							},
							alertsGroup: {
								type: 'array',
								$$formula: 'UNIQUE(FLATMAP(this.links["is attached to"], "data.payload.alertsGroup"))'
							}
						}
					}
				}
			},
			uiSchema: {
				fields: {
					tags: {
						$ref: uiSchemaDef('badgeList')
					},
					data: {
						'ui:order': [
							'mentionsUser',
							'alertsUser',
							'mentionsGroup',
							'alertsGroup',
							'participants'
						],
						mentionsUser: {
							$ref: uiSchemaDef('usernameList')
						},
						alertsUser: {
							$ref: uiSchemaDef('usernameList')
						},
						mentionsGroup: {
							$ref: uiSchemaDef('groupList')
						},
						alertsGroup: {
							$ref: uiSchemaDef('groupList')
						},
						participants: {
							$ref: uiSchemaDef('idOrSlugList')
						}
					}
				}
			}
		}
	}
}
