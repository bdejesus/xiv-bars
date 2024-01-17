import { useRouter } from 'next/router';
import I18n from 'lib/I18n/locale/en-US';
import { jsonToQuery } from 'lib/utils/url';
import { useAppState } from 'components/App/context';
import Icon from 'components/Icon';

export default function DuplicateLayout() {
  const router = useRouter();
  const {
    encodedSlots,
    layout,
    xhb,
    wxhb,
    exhb,
    hb,
    layoutId,
    selectedJob
  } = useAppState();

  if (!layoutId) return null;

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
      <Icon
        id="copy"
        title={I18n.ControlBar.CopyLayout.copy_icon}
      />
      { I18n.ControlBar.CopyLayout.copy_label }
    </button>
  );
}
