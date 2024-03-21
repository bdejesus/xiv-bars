import ACTION_CAT from 'data/ActionCategory.json';
import BUDDY_ACTION from 'apiData/BuddyAction.json';
import COMPANY_ACTION from 'apiData/CompanyAction.json';
import GENERAL_ACTION from 'apiData/GeneralAction.json';
import MAIN_COMMAND from 'apiData/MainCommand.json';
import MACRO_ICON from 'apiData/MacroIcon.json';
import PET_ACTION from 'apiData/PetAction.json';

import { sortIntoGroups } from 'lib/utils/array.mjs';
import { defaultState } from 'components/App/defaultState';
import { layouts, chotbar, hotbar } from 'lib/xbars';
import { decorateRouterQuery } from 'lib/utils/url';

import type { LayoutViewProps } from 'types/Layout';
import type { SlotProps, ActionProps } from 'types/Action';
import type { ParsedUrlQuery } from 'querystring';

function assignLayoutTemplate(layoutID:number) {
  const templates = [chotbar, hotbar];
  return templates[layoutID ? parseInt(layoutID.toString(), 10) : 0];
}

function assignActionIds(slottedActions: SlotProps[]) {
  if (!slottedActions) return null;

  return Object.values(slottedActions).map((slot) => {
    if (slot.action?.ID) {
      return (typeof slot.action.Prefix !== 'undefined')
        ? `${slot.action.Prefix}${slot.action.ID}`
        : `${slot.action.ID}`;
    }
    return '0';
  });
}

function encodeSlots(slots:object):string {
  const slotActionObject = Object.values(slots);
  const actionIdGroups = slotActionObject.map((arr) => assignActionIds(arr as SlotProps[]));
  const actionIds = actionIdGroups.flat();
  const slotsString = actionIds.join(',');
  return slotsString;
}

interface MergeParamsToViewProps {
  params?: ParsedUrlQuery,
  viewData: LayoutViewProps
}

export function mergeParamsToView(props?:MergeParamsToViewProps):LayoutViewProps {
  const { params, viewData } = props || {};
  const parsedParams = params && decorateRouterQuery(params);

  const {
    createdAt,
    deletedAt,
    description,
    jobId,
    title,
    updatedAt,
    user,
    userId,
    id,
    encodedSlots,
    wxhb,
    xhb,
    exhb,
    hb,
    isPvp,
    layout,
    heartsCount,
    hearted
  }:LayoutViewProps = {
    ...defaultState.viewData,
    ...viewData,
    ...parsedParams
  };

  return {
    createdAt,
    deletedAt,
    description,
    jobId,
    title,
    updatedAt,
    user,
    userId,
    id,
    encodedSlots,
    wxhb,
    xhb,
    exhb,
    hb,
    isPvp,
    layout,
    heartsCount,
    hearted
  };
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
  slotRow: SlotProps[],
  actionID: string,
  slotIndex: number,
  actions?: ActionProps[],
  roleActions?: ActionProps[]
}

function setActionsByGroup({
  actionID,
  actions,
  slotIndex,
  slotRow,
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
  const actionKey = getActionKey({ actionCategory: actionType, actions, roleActions });
  const slottedAction = actionKey?.find((slotAction: ActionProps) => slotAction.ID === parsedID);

  // eslint-disable-next-line no-param-reassign
  if (slotRow && slotIndex !== undefined) slotRow[slotIndex].action = slottedAction || {};
  return slotRow;
}

interface SlotActionsProps {
  encodedSlots?: string,
  layout: number,
  actions?: ActionProps[],
  roleActions?: ActionProps[],
}

function groupSlotsIntoLayout({
  encodedSlots,
  layout,
  actions,
  roleActions
}:SlotActionsProps) {
  const slotsString = encodedSlots || encodeSlots([chotbar, hotbar][layout]);
  const numSlots = layout?.toString() === '1' ? 12 : 16;
  const slotRows = sortIntoGroups(slotsString?.split(','), numSlots);
  const layoutTemplate = assignLayoutTemplate(layout);

  // Take each action group and assign actions to them
  const slottedRows = slotRows.reduce((slotted, rowActionIds, groupIndex) => {
    const rowKey = Object.keys(layoutTemplate)[groupIndex];

    const rowSlots = rowActionIds.map((actionID:string, slotIndex:number) => {
      const slotRow = layoutTemplate[rowKey] as SlotProps[];
      const slottedRow = setActionsByGroup({
        actionID,
        actions,
        slotIndex,
        slotRow,
        roleActions
      });

      return slottedRow;
    });

    return { ...slotted, [rowKey]: rowSlots[groupIndex] };
  }, {});

  return slottedRows;
}

function slotActions({
  encodedSlots,
  layout,
  actions,
  roleActions
}:SlotActionsProps) {
  const layoutTemplate = assignLayoutTemplate(layout);
  const slotsString = encodedSlots || encodeSlots(layoutTemplate);

  // Split action IDs from encodedSlots string into groups depending on the layout
  const groupedActions = groupSlotsIntoLayout({
    encodedSlots: slotsString, layout, actions, roleActions
  });

  return groupedActions;
}

interface SlotObject {
  action: ActionProps | undefined
}

interface SetActionToSlotProps {
  action: ActionProps | undefined,
  slotID: string,
  encodedSlots?: string,
  layout?: number
  actions?: ActionProps[],
  roleActions?: ActionProps[]
}

// Sets a single action to a specified slot ID
export function setActionToSlot({
  action,
  slotID,
  encodedSlots,
  layout,
  actions,
  roleActions
}:SetActionToSlotProps) {
  // Parse the slot ID string and build a slot object
  const [parent, id] = slotID.split('-');
  const slotIdentifier = { parent, id: parseInt(id, 10) - 1 };
  const groupedSlots = slotActions({
    encodedSlots,
    layout: layout || defaultState.viewData.layout,
    actions,
    roleActions
  });

  function getTargetSlot() {
    const slotGroup = groupedSlots[slotIdentifier.parent as keyof typeof groupedSlots];
    return slotGroup[slotIdentifier.id];
  }

  // Get the target slot
  const slotObject:SlotObject = groupedSlots ? getTargetSlot() : { action: undefined };

  // Update the target slot's action
  if (slotObject) slotObject.action = action;

  // update slots string query
  const updatedSlots = encodeSlots(groupedSlots as object);

  return updatedSlots;
}

interface SetActionsToSlotsProps {
  encodedSlots: string,
  layout: number,
  actions?: ActionProps[],
  roleActions?: ActionProps[]
}
// Sets an array of actios to their respective slots
export function setActionsToSlots(props:SetActionsToSlotsProps) {
  const slottedActions = slotActions(props);
  const layoutKey = layouts[props.layout as keyof typeof layouts];
  return { [layoutKey as string]: slottedActions };
}

const modules = {
  encodeSlots,
  mergeParamsToView,
  assignActionIds,
  setActionToSlot,
  setActionsToSlots
};

export default modules;
