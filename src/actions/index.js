import { ADD_TO_SLOT, REMOVE_FROM_SLOT } from '../constants/action-types';

export function addToSlot(payload) {
  return { type: ADD_TO_SLOT, payload };
}

export function removeFromSlot(payload) {
  return { type: REMOVE_FROM_SLOT, payload };
}
