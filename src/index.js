const { Machine } = require('xstate');


function bottenderXState(config, mapContextToXStateEvent, actions) {
  return async (context, next) => {
    const machine = Machine(config);

    const currentState = context.state.machine || config.initial;
    const event = await mapContextToXStateEvent(context);

    const nextState = machine.transition(currentState, event);

    const triggerdActions = nextState.actions;

    for (triggerdAction of triggerdActions) {
      if (typeof actions[triggerdAction] === 'function') {
        await actions[triggerdAction](context);
      } else {
        warning(
          false,
          `${actions[triggerdAction]} is missing in actions`
        );
      }
    }

    await next();

    // FIXME: where?
    context.setState({ machine: nextState.value });
  };
}

module.exports = bottenderXState;
