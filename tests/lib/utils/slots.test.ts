import { decodeSlots, setActionToSlot, setActionsToSlots } from 'lib/utils/slots';

describe('decodeSlots', () => {
  it('returns default values', () => {
    const results = decodeSlots({});
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
    action: { ID: '100' },
    slotID: 'one-1',
    layout: 0
  };

  it('returns an updated slots string', () => {
    const results = setActionToSlot(props);
    expect(results).toBe('100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0');
    expect(results.split(',').length).toEqual(128);
  });
});

describe('setActionsToSlots', () => {
  it('returns an updated slots string', () => {
    const props = {
      encodedSlots: '',
      layout: 0
    };
    const results = setActionsToSlots(props);
    expect(results).toBe(false);
  });
});
