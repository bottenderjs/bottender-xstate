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
    const event = await mapContextToXstateEvent(context);

    if (onEvent) {
      onEvent(event, context);
    }

    const nextState = machine.transition(
      currentState,
      event,
      contextExtendedState
    );

    const triggerdActions = nextState.actions;

    for (const action of triggerdActions) {
      if (typeof action === 'string') {
        const actionFunction = actions[action];
        if (typeof actionFunction === 'function') {
          if (onAction) {
            onAction(
              actionFunction.displayName || actionFunction.name,
              context
            );
          }
          await actionFunction(context); // eslint-disable-line no-await-in-loop
        } else {
          warning(false, `${action} is missing in actions`);
        }
      } else if (typeof action === 'object') {
        if (onAction) {
          onAction(action, context);
        }
        if (typeof action.exec === 'function') {
          await action.exec(context); // eslint-disable-line no-await-in-loop
        }
      }
    }

    // FIXME: where?
    context.setState({
      xstate: {
        value: nextState.value,
        historyValue: nextState.historyValue,
      },
    });
  };
}

module.exports = bottenderXstate;
