# bottender-xstate

[![CircleCI](https://circleci.com/gh/Yoctol/bottender-xstate.svg?style=shield&circle-token=df773eab701966e6af5b8b57a8969764c3d351f8)](https://circleci.com/gh/Yoctol/bottender-xstate)
[![npm](https://img.shields.io/npm/v/bottender-xstate.svg?style=flat-square)](https://www.npmjs.com/package/bottender-xstate)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Finite State Machines in [Bottender](https://github.com/Yoctol/bottender) using [xstate](https://github.com/davidkpiano/xstate)

## Installation

```sh
npm install bottender-xstate
```

## API Reference

| Param                   | Type            | Description                                                                    |
| ----------------------- | --------------- | ------------------------------------------------------------------------------ |
| config                  | `XstateConfig`  | Config to be passed to xstate.                                                 |
| mapContextToXstateEvent | `Function`      | Mapper for create xstate event from context.                                   |
| actions                 | `Object`        | Map of named actions.                                                          |
| guards                  | `Object`        | Map of named guards.                                                           |
| events                  | `Array<String>` | All events handled by the machine. (required when using `* (catch-all)` event) |
| onEvent                 | `Function`      | Callback to be called when trigger event.                                      |
| onAction                | `Function`      | Callback to be called when trigger action.                                     |

```js
const bottenderXstate = require('bottender-xstate');

const config = {
  id: 'light',
  initial: 'green',
  states: {
    green: {
      on: {
        TIMER: { target: 'yellow' },
      },
      onEntry: 'enterGreen',
      onExit: 'leaveGreen',
    },
    yellow: {
      on: {
        TIMER: { target: 'red' },
      },
      onEntry: 'enterYellow',
      onExit: 'leaveYellow',
    },
    red: {
      on: {
        TIMER: {
          target: 'green',
          actions: ['fromRedToGreen'],
        },
      },
      onEntry: 'enterRed',
      onExit: 'leaveRed',
    },
  },
};

const mapContextToXstateEvent = () => 'TIMER';

const actions = {
  enterGreen: context => context.sendText('enter green'),
  enterYellow: context => context.sendText('enter yellow'),
  enterRed: context => context.sendText('enter red'),
  leaveGreen: context => context.sendText('leave green'),
  leaveYellow: context => context.sendText('leave yellow'),
  leaveRed: context => context.sendText('leave red'),
  fromRedToGreen: context => context.sendText('from red to green'),
};

bot.onEvent(
  bottenderXstate({
    config,
    mapContextToXstateEvent,
    actions,
  })
);
```

You can find more examples in the
[examples](https://github.com/Yoctol/bottender-xstate/tree/master/examples) folder.

## License

MIT © [Yoctol](https://github.com/Yoctol/bottender-xstate)
