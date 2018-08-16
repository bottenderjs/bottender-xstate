const { ConsoleBot } = require('bottender');

const bottenderXstate = require('../src');

const bot = new ConsoleBot();

const config = {
  key: 'light',
  initial: 'green',
  states: {
    green: {
      on: {
        TIMER: {
          yellow: { cond: 'randomly' },
        },
      },
      onEntry: 'enterGreen',
      onExit: 'leaveGreen',
    },
    yellow: {
      on: {
        TIMER: {
          red: { cond: 'randomly' },
        },
      },
      onEntry: 'enterYellow',
      onExit: 'leaveYellow',
    },
    red: {
      on: {
        TIMER: {
          green: { cond: 'randomly' },
        },
      },
      onEntry: 'enterRed',
      onExit: 'leaveRed',
    },
  },
};

const mapContextToXstateEvent = () => {
  const event = 'TIMER';

  console.log(`Event: ${event}`);

  return event;
};

const actionMap = {
  enterGreen: context => context.sendText('enter green'),
  enterYellow: context => context.sendText('enter yellow'),
  enterRed: context => context.sendText('enter red'),
  leaveGreen: context => context.sendText('leave green'),
  leaveYellow: context => context.sendText('leave yellow'),
  leaveRed: context => context.sendText('leave red'),
};

bot.onEvent(
  bottenderXstate({
    config,
    mapContextToXstateEvent,
    actionMap,
    guards: {
      randomly: () => {
        const success = Math.random() > 0.5;

        console.log(`Transition Success: ${success}`);

        return success;
      },
    },
  })
);

bot.createRuntime();
