import Jobs from 'apiData/Jobs.json';
import { chotbar, hotbar } from 'lib/xbars';
import type { AppState } from 'types/App';

export const defaultState:AppState = {
  viewData: {
    createdAt: null,
    deletedAt: null,
    description: undefined,
    encodedSlots: undefined,
    exhb: 0,
    hb: new Array(10).fill(1, 0, 10),
    id: undefined,
    isPvp: false,
    jobId: undefined,
    layout: 0,
    title: undefined,
    updatedAt: null,
    user: undefined,
    userId: undefined,
    wxhb: 0,
    xhb: 1,
    hearted: undefined,
    published: undefined,
    _count: {
      hearts: 0
    },
    parentId: undefined
  },
  jobs: Jobs,
  readOnly: false,
  selectedJob: undefined,
  showTitles: false,
  showAllLvl: false,
  showDetails: true,
  viewAction: 'show',
  roleActions: undefined,
  actions: undefined,
  chotbar,
  hotbar,
  showMarkdownGuide: false,
  referenceLayout: undefined
};

export default defaultState;
