import React from 'react';
import Head from 'next/head';
import GlobalHeader from 'components/GlobalHeader';
import Footer from 'components/Footer';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { domain } from 'lib/host';

import type { GetServerSideProps } from 'next';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <link rel="canonical" href={`${domain}/privacy`} />
      </Head>

      <GlobalHeader />
      <div className="container">
        <h1>PRIVACY POLICY AGREEMENT</h1>

        <p>
          <i>August 19, 2024</i>
        </p>

        <p>
          XIVBARS (XIVBARS) values its users&apos; privacy. This Privacy Policy (“Policy”) will help you understand how we collect and use personal information from those who visit our website or make use of our online facilities and services, and what we will and will not do with the information we collect. Our Policy has been designed and created to ensure those affiliated with XIVBARS of our commitment and realization of our obligation not only to meet, but to exceed, most existing privacy standards.
        </p>

        <p>
          We reserve the right to make changes to this Policy at any given time. If you want to make sure that you are up to date with the latest changes, we advise you to frequently visit this page. If at any point in time XIVBARS decides to make use of any personally identifiable information on file, in a manner vastly different from that which was stated when this information was initially collected, the user or users shall be promptly notified by email. Users at that time shall have the option as to whether to permit the use of their information in this separate manner.
        </p>

        <p>
          This Policy applies to XIVBARS, and it governs any and all data collection and usage by us. Through the use of www.xivbars.com, you are therefore consenting to the data collection procedures expressed in this Policy.
        </p>

        <p>
          Please note that this Policy does not govern the collection and use of information by companies that XIVBARS does not control, nor by individuals not employed or managed by us. If you visit a website that we mention or link to, be sure to review its privacy policy before providing the site with information. It is highly recommended and suggested that you review the privacy policies and statements of any website you choose to use or frequent to better understand the way in which websites garner, make use of and share the information collected.
        </p>

        <p>
          Specifically, this Policy will inform you of the following:
        </p>

        <ol>
          <li>What personally identifiable information is collected from you through our website;</li>

          <li>Why we collect personally identifiable information and the legal basis for such collection;</li>

          <li>How we use the collected information and with whom it may be shared;</li>

          <li>What choices are available to you regarding the use of your data; and</li>

          <li>The security procedures in place to protect the misuse of your information.</li>
        </ol>

        <h2>Information We Collect</h2>

        <p>
          It is always up to you whether to disclose personally identifiable information to us, although if you elect not to do so, we reserve the right not to register you as a user or provide you with any products or services. This website collects various types of information, such as:
        </p>

        <ul>
          <li>
            Information automatically collected when visiting our website, which may include cookies, third party tracking technologies and server logs.
          </li>
        </ul>

        <p>
          In addition, XIVBARS may have the occasion to collect non-personal anonymous demographic information, such as geographic location, the type of browser you are using, and the type of operating system, which will assist us in providing and maintaining superior quality service.
        </p>

        <p>
          XIVBARS may also deem it necessary, from time to time, to follow websites that our users may frequent to gleam what types of services and products may be the most popular to customers or the general public.
        </p>

        <p>
          Please rest assured that this site will only collect personal information that you knowingly and willingly provide to us by way of completed membership forms. It is the intent of this site to use personal information only for the purpose for which it was requested, and any additional uses specifically provided for on this Policy.
        </p>

        <h2>Why We Collect Information and For How Long</h2>

        <p>
          We are collecting your data for several reasons:
        </p>

        <ol>
          <li>
            To better understand your needs and provide you with the services you have requested;
          </li>

          <li>
            To fulfill our legitimate interest in improving our services and products;
          </li>

          <li>
            To customize our website according to your online behavior and personal preferences.
          </li>
        </ol>

        <p>
          The data we collect from you will be stored for no longer than necessary. The length of time we retain said information will be determined based upon the following criteria: the length of time your personal information remains relevant; the length of time it is reasonable to keep records to demonstrate that we have fulfilled our duties and obligations; any limitation periods within which claims might be made; any retention periods prescribed by law or recommended by regulators, professional bodies or associations; the type of contract we have with you, the existence of your consent, and our legitimate interest in keeping such information as stated in this Policy.
        </p>

        <h2>Use of Information Collected</h2>

        <p>
          XIVBARS does not now, nor will it in the future, sell, rent or lease any of its customer lists and/or names to any third parties.
        </p>

        <p>
          XIVBARS may collect and may make use of personal information to assist in the operation of our website and to ensure delivery of the services you need and request. At times, we may find it necessary to use personally identifiable information as a means to keep you informed of other possible products and/or services that may be available to you from www.xivbars.com
        </p>

        <p>
          XIVBARS may also be in contact with you with regards to completing surveys and/or research questionnaires related to your opinion of current or potential future services that may be offered.
        </p>

        <h2>Disclosure of Information</h2>

        <p>
          XIVBARS may not use or disclose the information provided by you except under the following circumstances:
        </p>

        <ul>
          <li>
            as necessary to provide services or products you have ordered;
          </li>

          <li>
            in other ways described in this Policy or to which you have otherwise consented;
          </li>

          <li>
            in the aggregate with other information in such a way so that your identity cannot reasonably be determined;
          </li>

          <li>
            as required by law, or in response to a subpoena or search warrant;
          </li>

          <li>
            to outside auditors who have agreed to keep the information confidential;
          </li>

          <li>
            as necessary to enforce the Terms of Service;
          </li>

          <li>
            as necessary to maintain, safeguard and preserve all the rights and property of XIVBARS.
          </li>
        </ul>

        <h2>Non-Marketing Purposes</h2>

        <p>
          XIVBARS greatly respects your privacy. We do maintain and reserve the right to contact you if needed for non-marketing purposes (such as bug alerts, security breaches, account issues, and/or changes in XIVBARS products and services). In certain circumstances, we may use our website, newspapers, or other public means to post a notice.
        </p>

        <h2>Children under the age of 13</h2>

        <p>
          XIVBARS&apos;s website is not directed to, and does not knowingly collect personal identifiable information from, children under the age of thirteen (13). If it is determined that such information has been inadvertently collected on anyone under the age of thirteen (13), we shall immediately take the necessary steps to ensure that such information is deleted from our system&apos;s database, or in the alternative, that verifiable parental consent is obtained for the use and storage of such information. Anyone under the age of thirteen (13) must seek and obtain parent or guardian permission to use this website.
        </p>

        <h2>Unsubscribe or Opt-Out</h2>

        <p>
          All users and visitors to our website have the option to discontinue receiving communications from us by way of email or newsletters. To discontinue or unsubscribe from our website please log into xivbars.com and follow the link to <a href="https://www.xivbars.com/user/settings">Account Settings (https://www.xivbars.com/user/settings)</a> and deleting your account. XIVBARS will continue to adhere to this Policy with respect to any personal information previously collected.
        </p>

        <h2>Links to Other Websites</h2>

        <p>
          Our website does contain links to affiliate and other websites. XIVBARS does not claim nor accept responsibility for any privacy policies, practices and/or procedures of other such websites. Therefore, we encourage all users and visitors to be aware when they leave our website and to read the privacy statements of every website that collects personally identifiable information. This Privacy Policy Agreement applies only and solely to the information collected by our website.
        </p>

        <h2>Notice to European Union Users</h2>

        <p>
          XIVBARS&apos;s operations are located primarily in the United States. If you provide information to us, the information will be transferred out of the European Union (EU) and sent to the United States. (The adequacy decision on the EU-US Privacy became operational on August 1, 2016. This framework protects the fundamental rights of anyone in the EU whose personal data is transferred to the United States for commercial purposes. It allows the free transfer of data to companies that are certified in the US under the Privacy Shield.) By providing personal information to us, you are consenting to its storage and use as described in this Policy.
        </p>

        <h2>Your Rights as a Data Subject</h2>

        <p>
          Under the regulations of the General Data Protection Regulation (“GDPR”) of the EU you have certain rights as a Data Subject. These rights are as follows:
        </p>

        <ul>
          <li>
            The right to be informed: this means we must inform you of how we intend to use your personal data and we do this through the terms of this Policy.
          </li>

          <li>
            The right of access: this means you have the right to request access to the data we hold about you and we must respond to those requests within one month. You can do this by sending an email to  <a href="mailto:support@xivbars.com">support@xivbars.com</a>.
          </li>

          <li>
            The right to rectification: this means that if you believe some of the date, we hold is incorrect, you have the right to have it corrected. You can do this by logging into your account with us, or by sending us an email with your request.
          </li>

          <li>
            The right to erasure: this means you can request that the information we hold be deleted, and we will comply unless we have a compelling reason not to, in which case you will be informed of same. You can do this by logging into xivbars.com and following the link to <a href="https://www.xivbars.com/user/settings">Account Settings (https://www.xivbars.com/user/settings)</a> and deleting your account.
          </li>

          <li>
            The right to restrict processing: this means you can change your communication preferences or opt-out of certain communications. You can do this by sending an email to  <a href="mailto:support@xivbars.com">support@xivbars.com</a>.
          </li>

          <li>
            The right of data portability: this means you can obtain and use the data we hold for your own purposes without explanation. If you wish to request a copy of your information, contact us at  <a href="mailto:support@xivbars.com">support@xivbars.com</a>.
          </li>

          <li>
            The right to object: this means you can file a formal objection with us regarding our use of your information with regard to third parties, or its processing where our legal basis is our legitimate interest in it. To do this, please send an email to  <a href="mailto:support@xivbars.com">support@xivbars.com</a>.
          </li>
        </ul>

        <p>
          In addition to the rights above, please rest assured that we will always aim to encrypt and anonymize your personal information whenever possible. We also have protocols in place in the unlikely event that we suffer a data breach and we will contact you if your personal information is ever at risk. For more details regarding our security protections see the section below or visit our website at www.xivbars.com.
        </p>

        <h2>Security</h2>

        <p>
          XIVBARS takes precautions to protect your information. When you submit sensitive information via the website, your information is protected both online and offline. Wherever we collect sensitive information (e.g. email address), that information is encrypted and transmitted to us in a secure way. You can verify this by looking for a lock icon in the address bar and looking for “https” at the beginning of the address of the webpage.
        </p>

        <p>
          While we use encryption to protect sensitive information transmitted online, we also protect your information offline. Only employees who need the information to perform a specific job (for example,  customer service) are granted access to personally identifiable information. The computers and servers in which we store personally identifiable information are kept in a secure environment. This is all done to prevent any loss, misuse, unauthorized access, disclosure or modification of the user&apos;s personal information under our control.
        </p>

        <p>
          The company also uses Secure Socket Layer (SSL) for authentication and private communications to build users&apos; trust and confidence in the internet and website use by providing simple and secure access and communication of credit card and personal information.
        </p>

        <h2>Acceptance of Terms</h2>

        <p>
          By using this website, you are hereby accepting the terms and conditions stipulated within the Privacy Policy Agreement. If you are not in agreement with our terms and conditions, then you should refrain from further use of our sites. In addition, your continued use of our website following the posting of any updates or changes to our terms and conditions shall mean that you agree and acceptance of such changes.
        </p>

        <h2>How to Contact Us</h2>

        <p>
          If you have any questions or concerns regarding the Privacy Policy Agreement related to our website, please feel free to contact us at the following email address.
        </p>

        <p>
          <b>Email:</b>  <a href="mailto:support@xivbars.com">support@xivbars.com</a>
        </p>
      </div>
      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => ({
  props: {
    ...(await serverSideTranslations(context.locale as string, ['common']))
  }
});
