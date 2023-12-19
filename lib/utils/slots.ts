import ACTION_CAT from 'data/ActionCategory.json';
import BUDDY_ACTION from 'apiData/BuddyAction.json';
import COMPANY_ACTION from 'apiData/CompanyAction.json';
import GENERAL_ACTION from 'apiData/GeneralAction.json';
import MAIN_COMMAND from 'apiData/MainCommand.json';
import MACRO_ICON from 'apiData/MacroIcon.json';
import PET_ACTION from 'apiData/PetAction.json';

import type { SlotProps, ActionProps } from 'types/Action';
import { sortIntoGroups } from 'lib/utils/array.mjs';

export function assignActionIds(slotActions: SlotProps[]) {
  return Object.values(slotActions).map((slot) => {
    if (slot.action?.ID) {
      return (typeof slot.action.Prefix !== 'undefined')
        ? `${slot.action.Prefix}${slot.action.ID}`
        : `${slot.action.ID}`;
    }
    return '0';
  });
}

type QueryProps = {
  [key: string]: string
}

export function encodeSlots(slots:object) {
  if (slots) {
    const slotIDs = Object.values(slots);
    const slotsQuery = slotIDs.map((arr) => assignActionIds(arr as SlotProps[]));
    const queryString = slotsQuery
      .reduce((flat, next) => flat.concat(next), [])
      .join(',');
    return queryString;
  }
  return null;
}

export function decodeSlots(query:object) {
  const {
    s1, s, wxhb, xhb, exhb, hb, l
  } = query as QueryProps;

  let slots;
  if (s1) slots = sortIntoGroups(s1.split(','), 16);
  if (s) slots = JSON.parse(s);

  const formatHbConfig: number[] = hb?.split(',').map((i) => parseInt(i, 10));

  return {
    slottedActions: slots,
    wxhb: parseInt(wxhb, 10),
    xhb: parseInt(xhb, 10),
    exhb: parseInt(exhb, 10),
    hb: formatHbConfig,
    layout: parseInt(l, 10)
  };
}

interface SlotObject {
  action: ActionProps | undefined
}

interface SetActionToSlotProps {
  action: ActionProps | undefined,
  slotID: string | undefined,
  slots: object
}

// Sets a single action to a specified slot ID
export function setActionToSlot({
  action,
  slotID,
  slots
}:SetActionToSlotProps) {
  // update slotted actions
  if (slotID) {
    // Parse the slot ID string and build a slot object
    const [parent, id] = slotID.split('-');
    const slot = { parent, id: parseInt(id, 10) - 1 };
    const slotObject:SlotObject = slots
      // Get the target slot
      ? slots[slot.parent as keyof typeof slots][slot.id]
      : { action: undefined };
    // Update the target slot's action
    if (slotObject) slotObject.action = action;
    // update slots string query
    return encodeSlots(slots as object);
  }
  return null;
}

interface GetActionKeyProps {
  actionCategory?: string | null,
  actions?: ActionProps[],
  roleActions?: ActionProps[]
}

function getActionKey({ actionCategory, actions, roleActions }:GetActionKeyProps) {
  switch (actionCategory) {
    case ACTION_CAT.BuddyAction.prefix: return BUDDY_ACTION;
    case ACTION_CAT.CompanyAction.prefix: return COMPANY_ACTION;
    case ACTION_CAT.GeneralAction.prefix: return GENERAL_ACTION;
    case ACTION_CAT.MainCommand.prefix: return MAIN_COMMAND;
    case ACTION_CAT.MacroIcon.prefix: return MACRO_ICON;
    case ACTION_CAT.PetAction.prefix: return PET_ACTION;
    case 'r': return roleActions;
    default: return actions;
  }
}

interface SetActionsByGroupProps {
  slotGroup: { action: ActionProps }[],
  actionID: string,
  slotIndex: number,
  actions?: ActionProps[],
  roleActions?: ActionProps[]
}

function setActionsByGroup({
  slotGroup,
  actionID,
  slotIndex,
  actions,
  roleActions
}:SetActionsByGroupProps) {
  const actionPrefixes = Object.values(ACTION_CAT).map((type) => type.prefix);
  const prefixes = [...actionPrefixes, 'r'].join('|');
  const actionRegex = new RegExp(prefixes);
  const IDString = actionID.toString();
  const typeMatch = IDString.match(actionRegex);
  const actionType = typeMatch ? typeMatch[0] : null;

  const parsedID = actionType
    ? parseInt(IDString.replace(actionType, ''), 10)
    : parseInt(IDString, 10);
  const slottedAction = getActionKey({ actionCategory: actionType, actions, roleActions })?.find((slotAction: ActionProps) => slotAction.ID === parsedID);
  // eslint-disable-next-line no-param-reassign
  if (slottedAction && slotGroup && slotGroup[slotIndex]) slotGroup[slotIndex].action = slottedAction;
}

interface SetActionsToSlotsProps {
  encodedSlots: string,
  layout: number,
  slots: object,
  actions?: ActionProps[],
  roleActions?: ActionProps[]
}
// Sets an array of actios to their respective slots
export function setActionsToSlots({
  encodedSlots,
  layout,
  slots,
  actions,
  roleActions
}:SetActionsToSlotsProps) {
  const slottedActions = layout === 1
    ? sortIntoGroups(encodedSlots.split(','), 12)
    : sortIntoGroups(encodedSlots.split(','), 16);

  slottedActions.forEach((actionGroup, groupIndex) => {
    if (slots) {
      const slotKeys = Object.keys(slots);
      const groupName = slotKeys[groupIndex] as keyof typeof slots;
      const slotGroup = slots[groupName];
      actionGroup
        .forEach((actionID: string, slotIndex: number) => setActionsByGroup({
          slotGroup,
          actionID,
          slotIndex,
          actions,
          roleActions
        }));
    }
  });

  return slottedActions;
}

const modules = {
  encodeSlots,
  decodeSlots,
  assignActionIds,
  setActionToSlot,
  setActionsToSlots
};

export default modules;
