import { useRouter } from 'next/router';
import I18n from 'lib/I18n/locale/en-US';
import { jsonToQuery } from 'lib/utils/url';
import { useAppState } from 'components/App/context';
import Icon, { Icons } from 'components/Icon';

export default function DuplicateLayout() {
  const router = useRouter();
  const { viewData, selectedJob } = useAppState();
  const {
    encodedSlots,
    layout,
    xhb,
    wxhb,
    exhb,
    hb,
    id,
  } = viewData;

  if (!id) return null;

  function copyLayout() {
    if (selectedJob) {
      const query = jsonToQuery({
        l: layout, s1: encodedSlots, xhb, wxhb, exhb, hb
      });
      router.push(`/job/${selectedJob.Abbr}/new?${query}`);
    }
  }

  return (
    <button
      type="button"
      onClick={copyLayout}
      title={I18n.ControlBar.CopyLayout.copy_layout}
      className="button"
    >
      <Icon id={Icons.COPY} alt={I18n.ControlBar.CopyLayout.copy_icon} />
      <span className="btn-label">{ I18n.ControlBar.CopyLayout.copy_label }</span>
    </button>
  );
}
