import { useTranslation } from 'next-i18next';

export function HowTo() {
  const { t } = useTranslation();

  return (
    <div className="container">
      <h2>{t('HowTo.how_to_use_this')}</h2>
      <p>{t('HowTo.body')}</p>

      <ol>
        <li>
          <h3>{t('HowTo.select_a_class')}</h3>
          <p>{t('HowTo.plan_your_hotbars')}</p>
        </li>

        <li>
          <h3>{t('HowTo.toggle_hotbars')}</h3>
          <p>{t('HowTo.simulate_hotbars')}</p>
        </li>

        <li>
          <h3>{t('HowTo.drag_and_drop')}</h3>
          <p>{t('HowTo.slot_actions')}</p>
        </li>

        <li>
          <h3>{t('HowTo.export_to_macro')}</h3>
          <p>{t('HowTo.save_and_share')}</p>
        </li>
      </ol>
    </div>
  );
}

export default HowTo;
