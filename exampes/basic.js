const { ConsoleBot, middleware } = require('bottender');

const bottenderXState = require('../src');

const bot = new ConsoleBot({
  fallbackMethods: true,
});

const config = {
  key: 'light',
  initial: 'green',
  states: {
    green: {
      on: {
        TIMER: 'yellow',
      },
    },
    yellow: {
      on: {
        TIMER: 'red',
      },
    },
    red: {
      on: {
        TIMER: 'green',
      },
    },
  },
};

const mapContextToXStateEvent = () => 'TIMER';

bot.onEvent(middleware([bottenderXState(config, mapContextToXStateEvent)]));

bot.createRuntime();
