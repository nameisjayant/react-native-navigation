import type { Route } from './types';

export type StackState = {
  /** The logical back stack. Last item is the visible screen. */
  stack: Route[];
  /**
   * Routes already removed from `stack` but still kept mounted because the
   * native side is running their exit animation.
   */
  exiting: Route[];
};

export type StackAction =
  | { type: 'push'; name: string; params?: object }
  | { type: 'replace'; name: string; params?: object }
  | { type: 'pop' }
  | { type: 'popToTop' }
  | { type: 'attachedScreensChange'; keys: ReadonlyArray<string> };

export type NestedTarget = { screen: string; params?: object };

/** Reads `{ screen, params }` from a route's params, if present. */
export function nestedTarget(params?: object): NestedTarget | undefined {
  if (
    params == null ||
    !('screen' in params) ||
    typeof params.screen !== 'string'
  ) {
    return undefined;
  }
  return {
    screen: params.screen,
    params:
      'params' in params ? (params.params as object | undefined) : undefined,
  };
}

let nextKey = 0;

export function createRoute(name: string, params?: object): Route {
  return { key: `${name}-${nextKey++}`, name, params };
}

function removeTo(state: StackState, stack: Route[]): StackState {
  const removed = state.stack.filter((route) => !stack.includes(route));
  return { stack, exiting: [...state.exiting, ...removed] };
}

export function stackReducer(
  state: StackState,
  action: StackAction
): StackState {
  switch (action.type) {
    case 'push':
      return {
        ...state,
        stack: [...state.stack, createRoute(action.name, action.params)],
      };
    case 'replace':
      return removeTo(state, [
        ...state.stack.slice(0, -1),
        createRoute(action.name, action.params),
      ]);
    case 'pop':
      if (state.stack.length <= 1) {
        return state;
      }
      return removeTo(state, state.stack.slice(0, -1));
    case 'popToTop':
      if (state.stack.length <= 1) {
        return state;
      }
      return removeTo(state, state.stack.slice(0, 1));
    case 'attachedScreensChange': {
      const exiting = state.exiting.filter((route) =>
        action.keys.includes(route.key)
      );
      return exiting.length === state.exiting.length
        ? state
        : { ...state, exiting };
    }
  }
}
