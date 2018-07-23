const { ConsoleBot } = require('bottender');

const bottenderXState = require('../src');

const bot = new ConsoleBot();

// FIXME: $history state is not supported at this moment
const config = {
  initial: 'method',
  states: {
    method: {
      initial: 'cash',
      states: {
        cash: {
          on: { SWITCH_CHECK: 'check' },
          onEntry: 'enterMethodCash',
          onExit: 'leaveMethodCash',
        },
        check: {
          on: { SWITCH_CASH: 'cash' },
          onEntry: 'enterMethodCheck',
          onExit: 'leaveMethodCheck',
        },
      },
      on: { NEXT: 'review' },
      onEntry: 'enterMethod',
      onExit: 'leaveMethod',
    },
    review: {
      on: { PREVIOUS: 'method.$history' },
      onEntry: 'enterReview',
      onExit: 'leaveReview',
    },
  },
};

let count = 0;

const mapContextToXStateEvent = () => {
  count += 1;

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

bot.onEvent(
  bottenderXState({
    config,
    mapContextToXStateEvent,
    actions,
  })
);

bot.createRuntime();
