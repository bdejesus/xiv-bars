/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import { createRef, useEffect, useState } from 'react';
import { jsonToQuery } from 'lib/utils/url';
import { useRouter } from 'next/router';
import { useAppState } from 'components/App/context';
import { domain } from 'lib/host';
import I18n from 'lib/I18n/locale/en-US';
import { ClassJob } from 'types/ClassJob';

import styles from './Sharing.module.scss';

interface Props {
  selectedJob: ClassJob
}

export function Sharing({ selectedJob }: Props) {
  const router = useRouter();
  const {
    encodedSlots,
    readOnly,
    viewAction,
    xhb,
    wxhb,
    exhb,
    hb
  } = useAppState();
  const [shareURL, setShareURL] = useState(domain);
  const [copied, setCopied] = useState(false);

  const urlInput = createRef<HTMLInputElement>();

  function buildShareUrl() {
    const slots = (/\d/).test(encodedSlots) ? encodedSlots : '';
    const query = {
      s1: slots,
      xhb,
      wxhb,
      exhb,
      hb,
      l: router.query.l || null
    };

    const queryString = jsonToQuery(query);
    return `${domain}/job/${selectedJob.Abbr}/new?${queryString}`;
  }

  function getLayoutUrl() {
    const layoutId: string | string[] | undefined = router.query.params;
    return `${domain}/job/${selectedJob.Abbr}/${layoutId}`;
  }

  function selectInput() {
    urlInput.current?.focus();
    urlInput.current?.select();
  }

  function copyUrl() {
    selectInput();
    document.execCommand('copy');
    urlInput.current?.blur();
    setCopied(true);
    setTimeout(() => { setCopied(false); }, 3000);
    if (viewAction === 'new') {
      router.push(shareURL, undefined, { shallow: true });
    }
  }

  useEffect(() => {
    const urlString = readOnly ? getLayoutUrl() : buildShareUrl();
    setShareURL(urlString);
  }, [encodedSlots, xhb, wxhb, exhb, hb]);

  return (
    <div className={`${styles.container}`} data-copied={copied}>
      <div className="controlGroup">
        <label htmlFor="shareUrl">
          {I18n.Sharing.share_url}
        </label>

        <input
          id="shareUrl"
          className={styles.shareUrlInput}
          type="text"
          ref={urlInput}
          onClick={selectInput}
          value={shareURL}
          readOnly
        />
      </div>

      <button
        type="button"
        className={styles.copyButton}
        onClick={copyUrl}
      >
        <img
          src="/images/icon-copy.svg"
          className="btn-icon"
          alt={I18n.Sharing.copy_icon}
        />
        {I18n.Sharing.copy_url}
      </button>
    </div>
  );
}

export default Sharing;
