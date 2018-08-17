const { ConsoleBot } = require('bottender');
const randomItem = require('random-item');

const bottenderXstate = require('../src');

const bot = new ConsoleBot();

const config = {
  parallel: true,
  initial: 'bold.off',
  states: {
    bold: {
      initial: 'off',
      states: {
        on: {
          on: { TOGGLE_BOLD: 'off' },
          onEntry: 'enterBoldOn',
          onExit: 'leaveBoldOn',
        },
        off: {
          on: { TOGGLE_BOLD: 'on' },
          onEntry: 'enterBoldOff',
          onExit: 'leaveBoldOff',
        },
      },
    },
    underline: {
      initial: 'off',
      states: {
        on: {
          on: { TOGGLE_UNDERLINE: 'off' },
          onEntry: 'enterUnderlineOn',
          onExit: 'leaveUnderlineOn',
        },
        off: {
          on: { TOGGLE_UNDERLINE: 'on' },
          onEntry: 'enterUnderlineOff',
          onExit: 'leaveUnderlineOff',
        },
      },
    },
    italics: {
      initial: 'off',
      states: {
        on: {
          on: { TOGGLE_ITALICS: 'off' },
          onEntry: 'enterItalicsOn',
          onExit: 'leaveItalicsOn',
        },
        off: {
          on: { TOGGLE_ITALICS: 'on' },
          onEntry: 'enterItalicsOff',
          onExit: 'leaveItalicsOff',
        },
      },
    },
    list: {
      initial: 'none',
      states: {
        none: {
          on: { BULLETS: 'bullets', NUMBERS: 'numbers' },
          onEntry: 'enterListNone',
          onExit: 'leaveListNone',
        },
        bullets: {
          on: { NONE: 'none', NUMBERS: 'numbers' },
          onEntry: 'enterListBullets',
          onExit: 'leaveListBullets',
        },
        numbers: {
          on: { BULLETS: 'bullets', NONE: 'none' },
          onEntry: 'enterListNumbers',
          onExit: 'leaveListNumbers',
        },
      },
    },
  },
};

const mapContextToXstateEvent = () => {
  const event = randomItem([
    'TOGGLE_BOLD',
    'TOGGLE_UNDERLINE',
    'TOGGLE_ITALICS',
    'NONE',
    'BULLETS',
    'NUMBERS',
  ]);

  console.log(`Event: ${event}`);

  return event;
};

const actions = {
  enterBoldOn: context => context.sendText('enter bold on'),
  enterBoldOff: context => context.sendText('enter bold off'),
  enterUnderlineOn: context => context.sendText('enter underline on'),
  enterUnderlineOff: context => context.sendText('enter underline off'),
  enterItalicsOn: context => context.sendText('enter italics on'),
  enterItalicsOff: context => context.sendText('enter italics off'),
  enterListNone: context => context.sendText('enter list none'),
  enterListBullets: context => context.sendText('enter list bullets'),
  enterListNumbers: context => context.sendText('enter list numbers'),
  leaveBoldOn: context => context.sendText('leave bold on'),
  leaveBoldOff: context => context.sendText('leave bold off'),
  leaveUnderlineOn: context => context.sendText('leave underline on'),
  leaveUnderlineOff: context => context.sendText('leave underline off'),
  leaveItalicsOn: context => context.sendText('leave italics on'),
  leaveItalicsOff: context => context.sendText('leave italics off'),
  leaveListNone: context => context.sendText('leave list none'),
  leaveListBullets: context => context.sendText('leave list bullets'),
  leaveListNumbers: context => context.sendText('leave list numbers'),
};

bot.onEvent(
  bottenderXstate({
    config,
    mapContextToXstateEvent,
    actions,
  })
);

bot.createRuntime();
