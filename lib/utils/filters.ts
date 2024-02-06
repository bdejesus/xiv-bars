import type { ViewDataProps } from 'types/Layout';

interface FilterOptions {
  filterKeys?: string[]
}

export function filterUndefined(data:ViewDataProps, opts?:FilterOptions) {
  const filteredData = Object.entries(data).reduce((collection, [key, value]) => {
    const shouldFilter = (
      (value === undefined && value === null)
      || opts?.filterKeys?.includes(key)
    );

    if (!shouldFilter) return { ...collection, [key]: value };
    return collection;
  }, {});

  return filteredData;
}

export function intToBoolean(int:number|string) {
  const value = parseInt(`${int}`, 10);
  switch (value) {
    case 0: return false;
    case 1: return true;
    default: return undefined;
  }
}

const methods = { filterUndefined };

export default methods;
