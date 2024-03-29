const { ConsoleBot } = require('bottender');

const bottenderXstate = require('../src');

const bot = new ConsoleBot();

const config = {
  id: 'light',
  initial: 'green',
  states: {
    green: {
      on: {
        TIMER: [
          { target: 'yellow', cond: 'oneSecondElapsed' },
          { target: 'green', actions: ['updateElapsedTime'] },
        ],
      },
      onEntry: 'enterGreen',
      onExit: 'leaveGreen',
    },
    yellow: {
      on: {
        TIMER: [
          { target: 'red', cond: 'oneSecondElapsed' },
          { target: 'yellow', actions: ['updateElapsedTime'] },
        ],
      },
      onEntry: 'enterYellow',
      onExit: 'leaveYellow',
    },
    red: {
      on: {
        TIMER: [
          { target: 'green', cond: 'oneSecondElapsed' },
          { target: 'red', actions: ['updateElapsedTime'] },
        ],
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

const actions = {
  enterGreen: context => context.sendText('enter green'),
  enterYellow: context => context.sendText('enter yellow'),
  enterRed: context => context.sendText('enter red'),
  leaveGreen: context => context.sendText('leave green'),
  leaveYellow: context => context.sendText('leave yellow'),
  leaveRed: context => context.sendText('leave red'),
  updateElapsedTime: context =>
    context.setState({
      extendedState: {
        ...context.state.extendedState,
        elapsedTime: context.state.extendedState.elapsedTime + 1,
      },
    }),
};

bot.setInitialState({ extendedState: { elapsedTime: 0 } });

bot.onEvent(
  bottenderXstate({
    config,
    mapContextToXstateEvent,
    actions,
    guards: {
      oneSecondElapsed: extendedState => {
        const { elapsedTime } = extendedState;

        console.log(`Elapsed Time: ${elapsedTime}`);

        return elapsedTime >= 1000;
      },
    },
  })
);

bot.createRuntime();
