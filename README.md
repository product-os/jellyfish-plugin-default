# Jellyfish Default Plugin

This plugin currently only provides the default set of cards necessary for normal operations.

# Usage

Below is an example how to use this library:

```typescript
import { cardMixins } from '@balena/jellyfish-core';
import { DefaultPlugin } from '@balena/jellyfish-plugin-default';

const plugin = new DefaultPlugin();

// Load cards from this plugin, can use custom mixins
const cards = plugin.getCards(context, cardMixins);
console.dir(cards);
```

# Documentation

[![Publish Documentation](https://github.com/product-os/jellyfish-plugin-default/actions/workflows/publish-docs.yml/badge.svg)](https://github.com/product-os/jellyfish-plugin-default/actions/workflows/publish-docs.yml)

Visit the website for complete documentation: https://product-os.github.io/jellyfish-plugin-default

# Testing

Unit tests can be easily run with the command `npm test`.

The integration tests require Postgres and Redis instances. The simplest way to run the tests locally is with `docker-compose`.

```
$ git secret reveal
$ npm run test:compose
```

You can also run tests locally against Postgres and Redis instances running in `docker-compose`:
```
$ npm run compose
$ POSTGRES_USER=docker POSTGRES_PASSWORD=docker npx jest test/integration/example.spec.ts
```

You can also access these Postgres and Redis instances:
```
$ PGPASSWORD=docker psql -hlocalhost -Udocker
$ redis-cli -h localhost
```
