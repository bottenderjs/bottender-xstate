const warning = require('warning');
const { State, Machine } = require('xstate');

const transformConfig = require('./transformConfig');

function bottenderXstate({
  config,
  mapContextToXstateEvent,
  actions,
  guards = {},
  events = [],
  onEvent,
  onAction,
}) {
  return async context => {
    const transformedConfig = transformConfig(config, { events });
    const machine = Machine(transformedConfig, { guards });

    const contextXstate = context.state.xstate;
    const contextExtendedState = context.state.extendedState;

    const currentState = contextXstate
      ? new State(contextXstate.value, contextXstate.historyValue)
      : machine.initialState;
    let xstateEvents = await mapContextToXstateEvent(context);

    if (!Array.isArray(xstateEvents)) {
      xstateEvents = [xstateEvents];
    }

    for (const event of xstateEvents) {
      if (onEvent) {
        onEvent(event, context);
      }

      const nextState = machine.transition(
        currentState,
        event,
        contextExtendedState
      );

      const triggerdActions = nextState.actions;

      for (const actionName of triggerdActions) {
        const action = actions[actionName];
        if (typeof action === 'function') {
          if (onAction) {
            onAction(action.displayName || action.name, context);
          }
          await action(context); // eslint-disable-line no-await-in-loop
        } else {
          warning(false, `${actionName} is missing in actions`);
        }
      }

      // FIXME: where?
      context.setState({
        xstate: {
          value: nextState.value,
          historyValue: nextState.historyValue,
        },
      });
    }
  };
}

module.exports = bottenderXstate;
