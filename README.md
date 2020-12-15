# Default Jellyfish Plugin

Default plugin that currently only provides the default set of cards necessary for normal operations.

# Usage

Below is an example how to use this library:

```js
const coreMixins = require('@balena/jellyfish-core/lib/cards/mixins')
const defaultPlugin = require('@balena/jellyfish-plugin-default')

// Load cards from this plugin, can use custom mixins
const cards = defaultPlugin.cards(coreMixins)
console.dir(cards)
```

# Documentation

A plugin for providing default cards and functionality for Jellyfish.

