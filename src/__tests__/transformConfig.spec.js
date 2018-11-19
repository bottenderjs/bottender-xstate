const transformConfig = require('../transformConfig');

it('should transform catch-all event', () => {
  const config = {
    states: {
      a: {
        on: {
          SOMETHING: { target: 'somthing' },
          '*': { target: 'other' },
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
          SOMETHING: { target: 'somthing' },
          OTHER_A: { target: 'other' },
          OTHER_B: { target: 'other' },
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
          PED_COUNTDOWN: { target: 'wait' },
          '*': { target: 'other' },
        },
      },
      wait: {
        on: {
          PED_COUNTDOWN: { target: 'stop' },
          '*': { target: 'other' },
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
          SOMETHING: { target: 'somthing' },
          '*': { target: 'other' },
        },
      },
      other: {
        on: {
          TIMER: { target: 'green' },
          POWER_OUTAGE: { target: 'red' },
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
          SOMETHING: { target: 'somthing' },
          TIMER: { target: 'other' },
          POWER_OUTAGE: { target: 'other' },
          PED_COUNTDOWN: { target: 'other' },
          OTHER_A: { target: 'other' },
          OTHER_B: { target: 'other' },
        },
      },
      other: {
        on: {
          TIMER: { target: 'green' },
          POWER_OUTAGE: { target: 'red' },
        },
        initial: 'walk',
        states: {
          walk: {
            on: {
              SOMETHING: { target: 'other' },
              TIMER: { target: 'other' },
              POWER_OUTAGE: { target: 'other' },
              PED_COUNTDOWN: { target: 'wait' },
              OTHER_A: { target: 'other' },
              OTHER_B: { target: 'other' },
            },
          },
          wait: {
            on: {
              SOMETHING: { target: 'other' },
              TIMER: { target: 'other' },
              POWER_OUTAGE: { target: 'other' },
              PED_COUNTDOWN: { target: 'stop' },
              OTHER_A: { target: 'other' },
              OTHER_B: { target: 'other' },
            },
          },
          stop: {},
        },
      },
    },
  });
});
