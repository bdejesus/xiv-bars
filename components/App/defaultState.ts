import Jobs from 'apiData/Jobs.json';
import { chotbar, hotbar } from 'lib/xbars';

export const defaultState = {
  layout: 0,
  hb: new Array(10).fill(1, 0, 10),
  xhb: 1,
  wxhb: 0,
  exhb: 0,
  jobs: Jobs,
  readOnly: false,
  selectedJob: undefined,
  showTitles: false,
  showAllLvl: false,
  showModal: false,
  showPublish: false,
  viewData: undefined,
  viewAction: undefined,
  roleActions: undefined,
  actions: undefined,
  encodedSlots: undefined,
  message: undefined,
  chotbar,
  hotbar,
  title: undefined,
  description: undefined,
  user: undefined,
  jobId: undefined,
  id: undefined
};

export default defaultState;