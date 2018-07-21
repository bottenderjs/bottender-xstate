const warning = require('warning');
const { Machine } = require('xstate');

function bottenderXState({
  config,
  mapContextToXStateEvent,
  actions,
  onEvent,
  onAction,
}) {
  return async context => {
    const machine = Machine(config);

    const currentState = context.state.xstate || config.initial;
    const event = await mapContextToXStateEvent(context);

    if (onEvent) {
      onEvent(event, context);
    }

    const nextState = machine.transition(currentState, event);

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
    context.setState({ xstate: nextState.value });
  };
}

module.exports = bottenderXState;
