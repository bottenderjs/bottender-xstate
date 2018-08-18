const transformConfig = require('../transformConfig');

it('should transform catch-all event', () => {
  const config = {
    states: {
      a: {
        on: {
          SOMETHING: 'somthing',
          '*': 'other',
        },
      },
    },
  };

  expect(
    transformConfig(config, { events: ['SOMETHING', 'OTHER_A', 'OTHER_B'] })
  ).toEqual({
    states: {
      a: {
        on: {
          SOMETHING: 'somthing',
          OTHER_A: 'other',
          OTHER_B: 'other',
        },
      },
    },
  });
});

it('should work with hierarchical machines', () => {
  const pedestrianStates = {
    initial: 'walk',
    states: {
      walk: {
        on: {
          PED_COUNTDOWN: 'wait',
          '*': 'other',
        },
      },
      wait: {
        on: {
          PED_COUNTDOWN: 'stop',
          '*': 'other',
        },
      },
      stop: {},
    },
  };

  const config = {
    key: 'light',
    initial: 'green',
    states: {
      a: {
        on: {
          SOMETHING: 'somthing',
          '*': 'other',
        },
      },
      other: {
        on: {
          TIMER: 'green',
          POWER_OUTAGE: 'red',
        },
        ...pedestrianStates,
      },
    },
  };

  expect(
    transformConfig(config, {
      events: [
        'SOMETHING',
        'TIMER',
        'POWER_OUTAGE',
        'PED_COUNTDOWN',
        'OTHER_A',
        'OTHER_B',
      ],
    })
  ).toEqual({
    key: 'light',
    initial: 'green',
    states: {
      a: {
        on: {
          SOMETHING: 'somthing',
          TIMER: 'other',
          POWER_OUTAGE: 'other',
          PED_COUNTDOWN: 'other',
          OTHER_A: 'other',
          OTHER_B: 'other',
        },
      },
      other: {
        on: {
          TIMER: 'green',
          POWER_OUTAGE: 'red',
        },
        initial: 'walk',
        states: {
          walk: {
            on: {
              SOMETHING: 'other',
              TIMER: 'other',
              POWER_OUTAGE: 'other',
              PED_COUNTDOWN: 'wait',
              OTHER_A: 'other',
              OTHER_B: 'other',
            },
          },
          wait: {
            on: {
              SOMETHING: 'other',
              TIMER: 'other',
              POWER_OUTAGE: 'other',
              PED_COUNTDOWN: 'stop',
              OTHER_A: 'other',
              OTHER_B: 'other',
            },
          },
          stop: {},
        },
      },
    },
  });
});
