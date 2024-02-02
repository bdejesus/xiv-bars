import type { LayoutDataProps } from 'types/View';

interface FilterOptions {
  filterKeys?: string[]
}

export function filterUndefined(data:LayoutDataProps, opts?:FilterOptions) {
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

const methods = { filterUndefined };

export default methods;
