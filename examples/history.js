const { ConsoleBot } = require('bottender');

const bottenderXstate = require('../src');

const bot = new ConsoleBot();

const config = {
  id: 'payment',
  initial: 'method',
  states: {
    method: {
      initial: 'cash',
      states: {
        cash: {
          on: { SWITCH_CHECK: { target: 'check' } },
          onEntry: 'enterMethodCash',
          onExit: 'leaveMethodCash',
        },
        check: {
          on: { SWITCH_CASH: { target: 'cash' } },
          onEntry: 'enterMethodCheck',
          onExit: 'leaveMethodCheck',
        },
        history: {
          history: true,
        },
      },
      on: { NEXT: { target: 'review' } },
      onEntry: 'enterMethod',
      onExit: 'leaveMethod',
    },
    review: {
      on: { PREVIOUS: { target: 'method.history' } },
      onEntry: 'enterReview',
      onExit: 'leaveReview',
    },
  },
};

const mapContextToXstateEvent = context => {
  const count = context.state.extendedState.count + 1;

  context.setState({
    extendedState: { ...context.state.extendedState, count },
  });

  let event;
  switch (count % 3) {
    case 1:
      event = 'SWITCH_CHECK';
      break;
    case 2:
      event = 'NEXT';
      break;
    case 0:
      event = 'PREVIOUS';
      break;
    default:
  }

  console.log(`Event: ${event}`);

  return event;
};

const actions = {
  enterMethodCash: context => context.sendText('enter method cash'),
  enterMethodCheck: context => context.sendText('enter method check'),
  enterMethod: context => context.sendText('enter method'),
  enterReview: context => context.sendText('enter review'),
  leaveMethodCash: context => context.sendText('leave method cash'),
  leaveMethodCheck: context => context.sendText('leave method check'),
  leaveMethod: context => context.sendText('leave method'),
  leaveReview: context => context.sendText('leave review'),
};

bot.setInitialState({ extendedState: { count: 0 } });

bot.onEvent(
  bottenderXstate({
    config,
    mapContextToXstateEvent,
    actions,
  })
);

bot.createRuntime();
