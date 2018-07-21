# bottender-xstate

[![npm](https://img.shields.io/npm/v/bottender-xstate.svg?style=flat-square)](https://www.npmjs.com/package/bottender-xstate)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Finite State Machines in [Bottender](https://github.com/Yoctol/bottender) using [xstate](https://github.com/davidkpiano/xstate)

## Installation

```sh
npm install bottender-xstate
```

## API Reference

### `createHandler`

```js
const { createHandler } = require('bottender-xstate');

const config = {
  key: 'light',
  initial: 'green',
  states: {
    green: {
      on: {
        TIMER: 'yellow',
      },
      onEntry: 'enterGreen',
      onExit: 'leaveGreen',
    },
    yellow: {
      on: {
        TIMER: 'red',
      },
      onEntry: 'enterYellow',
      onExit: 'leaveYellow',
    },
    red: {
      on: {
        TIMER: 'green',
      },
      onEntry: 'enterRed',
      onExit: 'leaveRed',
    },
  },
};

const mapContextToXStateEvent = () => 'TIMER';

const actions = {
  enterGreen: context => context.sendText('enter green'),
  enterYellow: context => context.sendText('enter yellow'),
  enterRed: context => context.sendText('enter red'),
  leaveGreen: context => context.sendText('leave green'),
  leaveYellow: context => context.sendText('leave yellow'),
  leaveRed: context => context.sendText('leave red'),
};

bot.onEvent(createHandler(config, mapContextToXStateEvent, actions));
```

### `createMiddleware`

```js
const { middleare } = require('bottender');
const { createMiddleare } = require('bottender-xstate');

const config = {
  key: 'light',
  initial: 'green',
  states: {
    green: {
      on: {
        TIMER: 'yellow',
      },
      onEntry: 'enterGreen',
      onExit: 'leaveGreen',
    },
    yellow: {
      on: {
        TIMER: 'red',
      },
      onEntry: 'enterYellow',
      onExit: 'leaveYellow',
    },
    red: {
      on: {
        TIMER: 'green',
      },
      onEntry: 'enterRed',
      onExit: 'leaveRed',
    },
  },
};

const mapContextToXStateEvent = () => 'TIMER';

const actions = {
  enterGreen: context => context.sendText('enter green'),
  enterYellow: context => context.sendText('enter yellow'),
  enterRed: context => context.sendText('enter red'),
  leaveGreen: context => context.sendText('leave green'),
  leaveYellow: context => context.sendText('leave yellow'),
  leaveRed: context => context.sendText('leave red'),
};

bot.onEvent(
  middleare([
    createMiddleware(config, mapContextToXStateEvent, actions),
    async context => {
      /* ... */
    },
  ])
);
```

## License

MIT © [Yoctol](https://github.com/Yoctol/bottender-xstate)
