import { domain } from 'lib/host';
import * as UrlUtils from 'lib/utils/url';

describe('jsonToQuery', () => {
  it('returns json', () => {
    const json = {
      param: 'param',
      id: 'id'
    };
    const result = UrlUtils.jsonToQuery(json);
    expect(result).toBe('param=param&id=id');
  });
});

describe('buildUrl', () => {
  const query = { l: '0', isPvp: '0', jobId: 'SAM' };

  it('returns a url from query', () => {
    const result = UrlUtils.buildUrl({ query });
    expect(result).toBe(`${domain}/job/SAM/new?l=0&isPvp=0`);
  });

  it('returns a url from mergeData', () => {
    const mergeData = { xhb: 4, isPvp: true };
    const result = UrlUtils.buildUrl({ query, mergeData });
    expect(result).toBe(`${domain}/job/SAM/new?l=0&isPvp=1&xhb=4`);
  });

  it('returns a url with viewData', () => {
    const viewData = {
      id: 0,
      encodedSlots: undefined,
      wxhb: 2,
      xhb: 4,
      exhb: 6,
      createdAt: new Date().toISOString(),
      deltedAt: undefined,
      updatedAt: new Date().toISOString(),
      layout: 1,
      isPvp: true,
      hb: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      _count: { hearts: 0 }
    };

    const result = UrlUtils.buildUrl({ query, viewData });
    expect(result).toBe(`${domain}/job/SAM/new?wxhb=2&xhb=4&exhb=6&l=0&isPvp=0&hb=1,1,1,1,1,1,1,1,1,1`);
  });
});

describe('decorateRouterQuery', () => {
  it('returns a viewData json object', () => {
    const query = {
      l: '0', isPvp: '1', jobId: 'SAM', hb: '1,2,3,4,5', s: '987', xhb: undefined
    };

    const result = UrlUtils.decorateRouterQuery(query);
    expect(result).toEqual({
      encodedSlots: '987',
      hb: [1, 2, 3, 4, 5],
      isPvp: true,
      jobId: 'SAM',
      layout: 0
    });
  });
});
