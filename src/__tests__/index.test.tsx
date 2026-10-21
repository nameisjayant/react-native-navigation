import { describe, expect, it } from '@jest/globals';
import {
  createRoute,
  nestedTarget,
  stackReducer,
  type StackState,
} from '../stack';

const initial = (): StackState => ({
  stack: [createRoute('Home')],
  exiting: [],
});

describe('stackReducer', () => {
  it('pushes a new route with params', () => {
    const state = stackReducer(initial(), {
      type: 'push',
      name: 'Profile',
      params: { id: 1 },
    });
    expect(state.stack.map((r) => r.name)).toEqual(['Home', 'Profile']);
    expect(state.stack[1]?.params).toEqual({ id: 1 });
    expect(state.stack[0]?.key).not.toEqual(state.stack[1]?.key);
  });

  it('keeps popped routes mounted until native detaches them', () => {
    let state = stackReducer(initial(), { type: 'push', name: 'Profile' });
    const profile = state.stack[1]!;

    state = stackReducer(state, { type: 'pop' });
    expect(state.stack.map((r) => r.name)).toEqual(['Home']);
    expect(state.exiting).toEqual([profile]);

    // Exit animation still running.
    state = stackReducer(state, {
      type: 'attachedScreensChange',
      keys: [state.stack[0]!.key, profile.key],
    });
    expect(state.exiting).toEqual([profile]);

    // Animation finished.
    state = stackReducer(state, {
      type: 'attachedScreensChange',
      keys: [state.stack[0]!.key],
    });
    expect(state.exiting).toEqual([]);
  });

  it('does not pop the root route', () => {
    const state = initial();
    expect(stackReducer(state, { type: 'pop' })).toBe(state);
  });

  it('replaces the top route and pops to top', () => {
    let state = stackReducer(initial(), { type: 'push', name: 'A' });
    state = stackReducer(state, { type: 'push', name: 'B' });
    state = stackReducer(state, { type: 'replace', name: 'C' });
    expect(state.stack.map((r) => r.name)).toEqual(['Home', 'A', 'C']);

    state = stackReducer(state, { type: 'popToTop' });
    expect(state.stack.map((r) => r.name)).toEqual(['Home']);
    expect(state.exiting.map((r) => r.name)).toEqual(['B', 'A', 'C']);
  });
});

describe('nestedTarget', () => {
  it('reads the nested screen and its params', () => {
    expect(
      nestedTarget({ screen: 'Search', params: { screen: 'Result' } })
    ).toEqual({ screen: 'Search', params: { screen: 'Result' } });
    expect(nestedTarget({ screen: 'Settings' })).toEqual({
      screen: 'Settings',
      params: undefined,
    });
  });

  it('ignores params without a nested screen', () => {
    expect(nestedTarget(undefined)).toBeUndefined();
    expect(nestedTarget({ userId: '42' })).toBeUndefined();
    expect(nestedTarget({ screen: 42 })).toBeUndefined();
  });
});
