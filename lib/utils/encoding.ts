import type { SlotProps } from 'types/Action';

// Canonical URL param name for encoded slot data and its historical aliases
export const ENCODED_SLOTS_PARAM = 's';
export const ENCODED_SLOTS_PARAM_ALIASES: string[] = [ENCODED_SLOTS_PARAM, 's1', 'encodedSlots'];

// Resolves the s1/s/encodedSlots URL param aliases to a single value
export function readSlotParam(query: { s?: string | string[]; s1?: string | string[] }): string | undefined {
  return (query.s1 || query.s) as string | undefined;
}

function assignActionIds(slottedActions: SlotProps[]): (string | null)[] {
  if (!slottedActions) return [];
  return Object.values(slottedActions).map((slot) => {
    if (slot.action?.ID) {
      return (typeof slot.action.Prefix !== 'undefined')
        ? `${slot.action.Prefix}${slot.action.ID}`
        : `${slot.action.ID}`;
    }
    return '0';
  });
}

// Converts a populated slot structure to a comma-separated action ID string
export function encodeSlots(slots: object): string {
  const slotActionObject = Object.values(slots);
  const actionIdGroups = slotActionObject.map((arr) => assignActionIds(arr as SlotProps[]));
  return actionIdGroups.flat().join(',');
}

// Parses a comma-separated action ID string to an array of ID strings
export function decodeSlots(encodedSlots: string): string[] {
  return encodedSlots.split(',');
}
