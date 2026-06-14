export const SLOT_ID_SEPARATOR = '-';
export const ROLE_ACTION_PREFIX = 'r';

// Fields that are server-generated or relational and must be stripped before
// sending layout data to the DB (e.g. in SaveForm).
export const LAYOUT_FILTER_KEYS = [
  'user',
  'createdAt',
  'deletedAt',
  'updatedAt',
  'hearted',
  '_count',
  'userId',
  'parentLayout'
];
