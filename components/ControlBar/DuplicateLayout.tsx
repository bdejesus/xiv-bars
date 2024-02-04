import { useRouter } from 'next/router';
import I18n from 'lib/I18n/locale/en-US';
import { buildUrl } from 'lib/utils/url';
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
    jobId,
    isPvp
  } = viewData;

  if (!id) return null;

  function copyLayout() {
    if (selectedJob) {
      const params = {
        l: layout, xhb, wxhb, exhb, hb, isPvp, s: encodedSlots, jobId
      };
      const url = buildUrl({ params });
      router.push(url);
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
