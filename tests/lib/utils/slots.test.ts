import { decodeSlots, setActionToSlot, setActionsToSlots } from 'lib/utils/slots';
import { defaultState } from 'components/App/defaultState.ts';
import type { ActionProps } from 'types/Action.d.ts';

const stubAction:ActionProps = {
  ID: 99,
  Icon: 'iconURL',
  Name: 'Stub Action',
  Description: 'Nullam quis risus eget urna mollis ornare vel eu leo.'
};

describe('decodeSlots', () => {
  it('returns default values', () => {
    const results = decodeSlots({ appState: defaultState });
    expect(results).toEqual({
      encodedSlots: undefined,
      exhb: 0,
      hb: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      id: undefined,
      layout: 0,
      wxhb: 0,
      xhb: 1
    });
  });

  it('returns formatted values', () => {
    const queryParams = {
      s1: '1,1,1,1,1',
      wxhb: '1',
      xhb: '2',
      exhb: '3',
      l: '0',
      appState: defaultState
    };
    const results = decodeSlots(queryParams);
    expect(results).toEqual({
      encodedSlots: '1,1,1,1,1',
      wxhb: 1,
      xhb: 2,
      exhb: 3,
      hb: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      id: undefined,
      layout: 0
    });
  });
});

describe('setActionToSlot', () => {
  const props = {
    action: stubAction,
    slotID: 'one-1',
    layout: 0
  };

  it('returns an updated slots string', () => {
    const results = setActionToSlot(props);
    expect(results).toBe('99,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0');
    expect(results.split(',').length).toEqual(128);
  });
});

describe('setActionsToSlots', () => {
  it('returns a chotbar layout object', () => {
    const props = {
      encodedSlots: '',
      layout: 0
    };
    const results = setActionsToSlots(props);
    expect(results.chotbar).toBeDefined();
  });

  it('returns a hotbar layout object', () => {
    const props = {
      encodedSlots: '',
      layout: 1
    };
    const results = setActionsToSlots(props);
    expect(results.hotbar).toBeDefined();
  });

  it('returns a layout object with actions', () => {
    const props = {
      encodedSlots: `${stubAction.ID}`,
      layout: 0,
      actions: [stubAction]
    };
    const results = setActionsToSlots(props);
    expect(results.chotbar.one[0].action).toBe(stubAction);
  });
});
