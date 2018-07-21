const bottenderXState = require('../');

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

it('should call match actions', async () => {
  const handler = bottenderXState({
    config,
    mapContextToXStateEvent,
    actions,
  });

  const context = {
    state: {},
    setState: jest.fn(),
    sendText: jest.fn(),
  };

  await handler(context);

  expect(context.sendText).toBeCalledWith('enter yellow');
  expect(context.sendText).toBeCalledWith('leave green');
});

it('should call setState with xstate state value', async () => {
  const handler = bottenderXState({
    config,
    mapContextToXStateEvent,
    actions,
  });

  const context = {
    state: {},
    setState: jest.fn(),
    sendText: jest.fn(),
  };

  await handler(context);

  expect(context.setState).toBeCalledWith({
    xstate: 'yellow',
  });
});

it('should load state from session', async () => {
  const handler = bottenderXState({
    config,
    mapContextToXStateEvent,
    actions,
  });

  const context = {
    state: {
      xstate: 'yellow',
    },
    setState: jest.fn(),
    sendText: jest.fn(),
  };

  await handler(context);

  expect(context.sendText).toBeCalledWith('enter red');
  expect(context.sendText).toBeCalledWith('leave yellow');

  expect(context.setState).toBeCalledWith({
    xstate: 'red',
  });
});

it('should call onEvent with event', async () => {
  const onEvent = jest.fn();
  const handler = bottenderXState({
    config,
    mapContextToXStateEvent,
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
  const handler = bottenderXState({
    config,
    mapContextToXStateEvent,
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
