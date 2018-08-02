const { ConsoleBot } = require('bottender');

const bottenderXState = require('../src');

const bot = new ConsoleBot();

const pedestrianStates = {
  initial: 'walk',
  states: {
    walk: {
      on: {
        PED_TIMER: 'wait',
      },
      onEntry: 'enterWalk',
      onExit: 'leaveWalk',
    },
    wait: {
      on: {
        PED_TIMER: 'stop',
      },
      onEntry: 'enterWait',
      onExit: 'leaveWait',
    },
    stop: {
      onEntry: 'enterStop',
      onExit: 'leaveStop',
    },
  },
};

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
      ...pedestrianStates,
    },
  },
};

const mapContextToXStateEvent = () => {
  const event = Math.random() > 0.5 ? 'TIMER' : 'PED_TIMER';

  console.log(`Event: ${event}`);

  return event;
};

const actionMap = {
  enterGreen: context => context.sendText('enter green'),
  enterYellow: context => context.sendText('enter yellow'),
  enterRed: context => context.sendText('enter red'),
  enterWalk: context => context.sendText('enter walk'),
  enterWait: context => context.sendText('enter wait'),
  enterStop: context => context.sendText('enter stop'),
  leaveGreen: context => context.sendText('leave green'),
  leaveYellow: context => context.sendText('leave yellow'),
  leaveRed: context => context.sendText('leave red'),
  leaveWalk: context => context.sendText('leave walk'),
  leaveWait: context => context.sendText('leave wait'),
  leaveStop: context => context.sendText('leave stop'),
};

bot.onEvent(
  bottenderXState({
    config,
    mapContextToXStateEvent,
    actionMap,
  })
);

bot.createRuntime();