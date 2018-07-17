const { Machine } = require('xstate');

function bottenderXState(config, mapContextToXStateEvent) {
  return async (context, next) => {
    const machine = Machine(config);

    const currentState = context.state.machine || config.initial;
    const event = await mapContextToXStateEvent(context);

    const nextState = machine.transition(currentState, event).value;

    await next();

    context.setState({ machine: nextState });
  };
}

module.exports = bottenderXState;
