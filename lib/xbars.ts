import type { SlotProps } from 'types/Action';

export const layouts:string[] = ['chotbar', 'hotbar'];

export const chotbarSlotNames:string[] = [
  'LDD',
  'LDL',
  'LDU',
  'LDR',
  'LAD',
  'LAL',
  'LAU',
  'LAR',
  'RDD',
  'RDL',
  'RDU',
  'RDR',
  'RAD',
  'RAL',
  'RAU',
  'RAR'
];

export const hotbarKeys:{[key:string]:number} = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
};

const buildCrossHotbarSlots = (group: string, key: number) => {
  const numSlots = 16;
  const slotsArr = [];

  for (let i = 1; i <= numSlots; i += 1) {
    slotsArr.push({
      id: `${group}-${i}`,
      key,
      action: {},
      name: chotbarSlotNames[i - 1]
    });
  }

  return slotsArr;
};

const buildCrossHotbars = () => {
  const numRows = 8;
  const hotbars = Object.keys(hotbarKeys)
    .slice(0, numRows)
    .reduce((hotbarGroups, hbKey) => {
      const hotbarGroup = buildCrossHotbarSlots(hbKey, hotbarKeys[hbKey]);
      return ({ ...hotbarGroups, [hbKey]: hotbarGroup });
    }, {});
  return hotbars;
};

const buildHotbarSlots = (group: string) => {
  const numSlots = 12;
  const slotsArr = [];

  for (let i = 1; i <= numSlots; i += 1) {
    slotsArr.push({ id: `${group}-${i}`, action: {}, key: undefined });
  }
  return slotsArr;
};

const buildHotbars = () => {
  const hotbars = Object.keys(hotbarKeys).reduce((hotbarGroups, hbKey) => {
    const hotbarGroup = buildHotbarSlots(hbKey);
    return ({ ...hotbarGroups, [hbKey]: hotbarGroup });
  }, {});
  return hotbars;
};

export const chotbar:{[key: string]: object} = buildCrossHotbars();
export const hotbar:{[key: string]: object} = buildHotbars();

export const hotbarKeyPosition = (id: string) => Object.keys(hotbar).indexOf(id);

export const hasActions = (barData: SlotProps[]) => {
  const slottedActions = barData.map((a) => Object.keys(a.action).length > 0);
  return slottedActions.includes(true);
};

const modules = {
  layouts,
  chotbarSlotNames,
  chotbar,
  hotbar,
  hotbarKeys,
  hotbarKeyPosition,
  hasActions
};

export default modules;
