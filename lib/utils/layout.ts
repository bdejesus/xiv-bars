import type { URLParams } from 'types/Page';

export function parseParams(params:URLParams) {
  const encodedSlots = params.s1 || params.s;
  const isPvp = () => {
    if (params.isPvp === '0') return false;
    if (params.isPvp === '1') return true;
    return undefined;
  };

  const formatProps = {
    encodedSlots,
    wxhb: params.wxhb && parseInt(params.wxhb, 10),
    xhb: params.xhb && parseInt(params.xhb, 10),
    exhb: params.exhb && parseInt(params.exhb, 10),
    hb: params.hb && params.hb.split(',').map((v:string) => parseInt(v, 10)),
    layout: params.l && parseInt(params.l, 10),
    isPvp: isPvp(),
    jobId: params?.jobId
  };

  const filterUndefined = Object.entries(formatProps)
    .reduce((newProps, [key, value]) => {
      const hasValue:boolean = value !== undefined;
      if (hasValue) return { ...newProps, [key]: value };
      return newProps;
    }, {});

  return filterUndefined;
};

const modules = { parseParams };

export default modules;
