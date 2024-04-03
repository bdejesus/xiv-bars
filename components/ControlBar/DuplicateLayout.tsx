import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { buildUrl } from 'lib/utils/url';
import { useAppState } from 'components/App/context';
import Icon, { Icons } from 'components/Icon';

export default function DuplicateLayout() {
  const { t } = useTranslation();
  const router = useRouter();
  const { viewData, selectedJob } = useAppState();
  const { id } = viewData;

  if (!id) return null;

  function copyLayout() {
    if (selectedJob) {
      const url = buildUrl({ mergeData: viewData });
      router.push(url);
    }
  }

  return (
    <button
      type="button"
      onClick={copyLayout}
      title={t('ControlBar.CopyLayout.copy_layout')}
      className="button"
    >
      <Icon id={Icons.COPY} alt={t('ControlBar.CopyLayout.copy_icon')} />
      <span className="btn-label">{t('ControlBar.CopyLayout.copy_label')}</span>
    </button>
  );
}
