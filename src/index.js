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

    if (!event) return;

    if (onEvent) {
      onEvent(event, context);
    }

    const nextState = machine.transition(
      currentState,
      event,
      contextExtendedState
    );

    const triggerdActions = nextState.actions;

    function onActionChecker(actionFunction) {
      if (onAction) {
        onAction(actionFunction.displayName || actionFunction.name, context);
      }
    }

    async function actionStringHandler(actionName) {
      const actionFunction = actions[actionName];
      if (typeof actionFunction === 'function') {
        onActionChecker(actionFunction);
        await actionFunction(context, event); // eslint-disable-line no-await-in-loop
      } else {
        warning(false, `${actionName} is missing in actions`);
      }
    }

    async function actionObjectHandler(actionObject) {
      if (typeof actionObject.exec === 'function') {
        onActionChecker(actionObject.exec);
        await actionObject.exec(context, event); // eslint-disable-line no-await-in-loop
      } else if (typeof actionObject.type === 'string') {
        await actionStringHandler(actionObject.type);
      }
    }

    for (const action of triggerdActions) {
      if (typeof action === 'string') {
        await actionStringHandler(action); // eslint-disable-line no-await-in-loop
      } else if (typeof action === 'object') {
        await actionObjectHandler(action); // eslint-disable-line no-await-in-loop
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
