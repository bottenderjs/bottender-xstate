const mapValues = require('lodash/mapValues');
const reduce = require('lodash/reduce');

function transformStateOn(on, { events }) {
  return reduce(
    on,
    (result, value, key) => {
      if (key === '*') {
        return {
          ...result,
          ...events.reduce(
            (acc, curr) => ({
              ...acc,
              [curr]: value,
            }),
            {}
          ),
        };
      }

      return {
        ...result,
        [key]: value,
      };
    },
    {}
  );
}

function transformStates(states, { events }) {
  return mapValues(states, state => ({
    ...state,
    ...(state.on && { on: transformStateOn(state.on, { events }) }),
    ...(state.states && {
      states: transformStates(state.states, { events }),
    }),
  }));
}

module.exports = function transformConfig(config, { events }) {
  return {
    ...config,
    states: transformStates(config.states, { events }),
  };
};
