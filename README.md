# Default Jellyfish Plugin

Default plugin that currently only provides the default set of cards necessary for normal operations.

# Usage

Below is an example how to use this library:

```js
const coreMixins = require('@balena/jellyfish-core/lib/cards/mixins')
const DefaultPlugin = require('@balena/jellyfish-plugin-default')

const plugin = new DefaultPlugin()

// Load cards from this plugin, can use custom mixins
const cards = plugin.getCards(context, coreMixins)
console.dir(cards)
```

# Documentation

A plugin for providing default cards and functionality for Jellyfish.

<a name="exp_module_plugin--module.exports"></a>

### module.exports ⏏
The default Jellyfish plugin.

**Kind**: Exported class  
