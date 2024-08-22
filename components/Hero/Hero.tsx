/* eslint-disable max-len */
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';

const AdUnit = dynamic(() => import('components/AdUnit'), { ssr: false });

interface Props {
  primary?: boolean
}

export default function Hero({ primary = true }: Props) {
  const { t } = useTranslation();

  return (
    <div className="container row">
      <div className="main">
        { primary
          ? <h1 className="branding">XIV<b>BARS</b></h1>
          : <h2 className="branding">XIV<b>BARS</b></h2>}

        <p className="text-xl">{t('Global.subtitle')}</p>
        <p>{t('Global.description')}</p>
      </div>

      <div className="sidebar">
        <AdUnit format="fixed-square" />
      </div>
    </div>

  );
}
