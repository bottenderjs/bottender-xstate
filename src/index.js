const { Machine } = require('xstate');

function createHandler(config, mapContextToXStateEvent, actions) {
  return async context => {
    const machine = Machine(config);

    const currentState = context.state.machine || config.initial;
    const event = await mapContextToXStateEvent(context);

    const nextState = machine.transition(currentState, event);

    const triggerdActions = nextState.actions;

    for (triggerdAction of triggerdActions) {
      if (typeof actions[triggerdAction] === 'function') {
        await actions[triggerdAction](context);
      } else {
        warning(false, `${actions[triggerdAction]} is missing in actions`);
      }
    }

    // FIXME: where?
    context.setState({ machine: nextState.value });
  };
}

function createMiddleware(config, mapContextToXStateEvent, actions) {
  return async (context, next) => {
    const handler = createHandler(config, mapContextToXStateEvent, actions);
    await handler(context);
    await next();
  };
}

module.exports = {
  createMiddleware,
  createHandler,
};
