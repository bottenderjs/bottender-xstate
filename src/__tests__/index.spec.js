const bottenderXstate = require('../');

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
        TIMER: { target: 'green' },
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
};

it('should call match actions', async () => {
  const handler = bottenderXstate({
    config,
    mapContextToXstateEvent,
    actions,
  });

  const context = {
    state: {},
    setState: jest.fn(),
    sendText: jest.fn(),
  };

  await handler(context);

  expect(context.sendText).toBeCalledWith('leave green');
  expect(context.sendText).toBeCalledWith('enter yellow');
});

it('should call setState with xstate state value', async () => {
  const handler = bottenderXstate({
    config,
    mapContextToXstateEvent,
    actions,
  });

  const context = {
    state: {},
    setState: jest.fn(),
    sendText: jest.fn(),
  };

  await handler(context);

  expect(context.setState).toBeCalledWith({
    xstate: {
      value: 'yellow',
      historyValue: {
        current: 'yellow',
        states: { green: undefined, red: undefined, yellow: undefined },
      },
    },
  });
});

it('should load state from session', async () => {
  const handler = bottenderXstate({
    config,
    mapContextToXstateEvent,
    actions,
  });

  const context = {
    state: {
      xstate: {
        value: 'yellow',
        historyValue: {
          current: 'yellow',
          states: { green: undefined, red: undefined, yellow: undefined },
        },
      },
    },
    setState: jest.fn(),
    sendText: jest.fn(),
  };

  await handler(context);

  expect(context.sendText).toBeCalledWith('enter red');
  expect(context.sendText).toBeCalledWith('leave yellow');

  expect(context.setState).toBeCalledWith({
    xstate: {
      value: 'red',
      historyValue: {
        current: 'red',
        states: { green: undefined, red: undefined, yellow: undefined },
      },
    },
  });
});

it('should not throw when no valid xstate event returned', async () => {
  const handler = bottenderXstate({
    config,
    mapContextToXstateEvent: () => {},
    actions,
  });

  const context = {
    state: {},
    setState: jest.fn(),
    sendText: jest.fn(),
  };

  await handler(context);
});

it('should call onEvent with event', async () => {
  const onEvent = jest.fn();
  const handler = bottenderXstate({
    config,
    mapContextToXstateEvent,
    actions,
    onEvent,
  });

  const context = {
    state: {},
    setState: jest.fn(),
    sendText: jest.fn(),
  };

  await handler(context);

  expect(onEvent).toBeCalledWith('TIMER', context);
});

it('should call onAction with action name', async () => {
  const onAction = jest.fn();
  const handler = bottenderXstate({
    config,
    mapContextToXstateEvent,
    actions,
    onAction,
  });

  const context = {
    state: {},
    setState: jest.fn(),
    sendText: jest.fn(),
  };

  await handler(context);

  expect(onAction).toBeCalledWith('enterYellow', context);
  expect(onAction).toBeCalledWith('leaveGreen', context);
});

it('should support named guards', async () => {
  const someCond = jest.fn(() => true);
  const handler = bottenderXstate({
    config: {
      id: 'light',
      initial: 'green',
      states: {
        green: {
          on: {
            TIMER: { target: 'yellow', cond: 'someCond' },
          },
          onExit: 'leaveGreen',
        },
        yellow: {
          on: {},
          onEntry: 'enterYellow',
        },
      },
    },
    mapContextToXstateEvent,
    actions,
    guards: {
      someCond,
    },
  });

  const context = {
    state: {},
    setState: jest.fn(),
    sendText: jest.fn(),
  };

  await handler(context);

  expect(someCond).toBeCalledWith({}, { type: 'TIMER' }, 'green');
  expect(someCond).toHaveReturnedWith(true);
  expect(context.sendText).toBeCalledWith('enter yellow');
  expect(context.sendText).toBeCalledWith('leave green');
});

it('should support transition actions', async () => {
  const handler = bottenderXstate({
    config: {
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
    },
    mapContextToXstateEvent,
    actions: {
      ...actions,
      fromRedToGreen: context => context.sendText('from red to green'),
    },
  });

  const context = {
    state: {
      xstate: {
        value: 'red',
        historyValue: {
          current: 'red',
          states: { green: undefined, red: undefined, yellow: undefined },
        },
      },
    },
    setState: jest.fn(),
    sendText: jest.fn(),
  };

  await handler(context);

  expect(context.sendText.mock.calls.map(call => call[0])).toEqual([
    'leave red',
    'from red to green',
    'enter green',
  ]);
});

it('should support transition actions of object type, and action exec of string type', async () => {
  const handler = bottenderXstate({
    config: {
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
              actions: [{ type: 'fromRedToGreen' }],
            },
          },
          onEntry: 'enterRed',
          onExit: 'leaveRed',
        },
      },
    },
    mapContextToXstateEvent,
    actions: {
      ...actions,
      fromRedToGreen: context => context.sendText('from red to green'),
    },
  });

  const context = {
    state: {
      xstate: {
        value: 'red',
        historyValue: {
          current: 'red',
          states: { green: undefined, red: undefined, yellow: undefined },
        },
      },
    },
    setState: jest.fn(),
    sendText: jest.fn(),
  };

  await handler(context);

  expect(context.sendText.mock.calls.map(call => call[0])).toEqual([
    'leave red',
    'from red to green',
    'enter green',
  ]);
});

it('should support transition actions of object type, and action exec of function type', async () => {
  const handler = bottenderXstate({
    config: {
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
              actions: [
                {
                  type: 'xxx',
                  exec: context => context.sendText('from red to green'),
                },
              ],
            },
          },
          onEntry: 'enterRed',
          onExit: 'leaveRed',
        },
      },
    },
    mapContextToXstateEvent,
    actions,
  });

  const context = {
    state: {
      xstate: {
        value: 'red',
        historyValue: {
          current: 'red',
          states: { green: undefined, red: undefined, yellow: undefined },
        },
      },
    },
    setState: jest.fn(),
    sendText: jest.fn(),
  };

  await handler(context);

  expect(context.sendText.mock.calls.map(call => call[0])).toEqual([
    'leave red',
    'from red to green',
    'enter green',
  ]);
});
