module.exports = {
  slug: 'channel-security-support-threads',
  name: 'Security Support',
  type: 'channel@1.0.0',
  markers: ['org-balena'],
  data: {
    filter: {
      name: 'Security Support Cards',
      schema: {
        type: 'object',
        additionalProperties: true,
        required: ['type'],
        properties: {
          type: {
            type: 'string',
            const: 'security-support@1.0.0'
          }
        }
      }
    }
  }
}
