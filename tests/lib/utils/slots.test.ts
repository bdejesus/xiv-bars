import { mergeParamsToView, setActionToSlot, setActionsToSlots } from 'lib/utils/slots';
import { defaultState } from 'components/App/defaultState.ts';
import type { ActionProps } from 'types/Action.d.ts';

const stubAction:ActionProps = {
  ID: 99,
  Icon: 'iconURL',
  Name: 'Stub Action',
  Description: 'Nullam quis risus eget urna mollis ornare vel eu leo.'
};

describe('mergeParamsToView', () => {
  it('returns default values', () => {
    const results = mergeParamsToView();
    expect(results).toEqual(defaultState.viewData);
  });

  it('returns formatted values', () => {
    const queryParams = {
      s1: '1,1,1,1,1',
      wxhb: '1',
      xhb: '2',
      exhb: '3',
      hb: '1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2',
      l: '0'
    };
    const results = mergeParamsToView({ params: queryParams, viewData: defaultState.viewData });
    expect(results).toEqual({
      ...defaultState.viewData,
      encodedSlots: '1,1,1,1,1',
      wxhb: 1,
      xhb: 2,
      exhb: 3,
      layout: 0,
      hb: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2]
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
