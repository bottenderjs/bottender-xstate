const warning = require('warning');
const { State, Machine } = require('xstate');

function bottenderXstate({
  config,
  mapContextToXstateEvent,
  actionMap,
  guards = {},
  onEvent,
  onAction,
}) {
  return async context => {
    const machine = Machine(config, { guards });

    const contextXstate = context.state.xstate;

    const currentState = contextXstate
      ? new State(contextXstate.value, contextXstate.historyValue)
      : machine.initialState;
    const event = await mapContextToXstateEvent(context);

    if (onEvent) {
      onEvent(event, context);
    }

    const nextState = machine.transition(currentState, event);

    const triggerdActions = nextState.actions;

    for (const actionName of triggerdActions) {
      const action = actionMap[actionName];
      if (typeof action === 'function') {
        if (onAction) {
          onAction(action.displayName || action.name, context);
        }
        await action(context); // eslint-disable-line no-await-in-loop
      } else {
        warning(false, `${actionName} is missing in actionMap`);
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
