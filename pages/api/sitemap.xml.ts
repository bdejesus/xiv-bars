import { SitemapStream, streamToPromise } from 'sitemap';
import Jobs from 'apiData/Jobs.json';
import BaseClassIDs from 'data/BaseClassIDs.json';
import { domain } from 'lib/host';
import { NextApiRequest, NextApiResponse } from 'next';

import type { ClassJobProps } from 'types/ClassJob';

async function buildSitemap(_req: NextApiRequest, res: NextApiResponse) {
  const lastmod = '2024-08-19';

  try {
    const sitemap = new SitemapStream({
      hostname: domain
    });

    sitemap.write({
      url: '/',
      priority: 0.9,
      lastmod
    });

    sitemap.write({
      url: '/privacy',
      priority: 0.9,
      lastmod
    });

    // Create each URL row
    const advancedJobs = Jobs.filter((job:ClassJobProps) => !BaseClassIDs.includes(job.ID));

    advancedJobs.forEach((job:ClassJobProps) => {
      sitemap.write({
        url: `/job/${job.Abbr}`,
        priority: 0.9,
        lastmod
      });
      sitemap.write({
        url: `/job/${job.Abbr}/new`,
        priority: 0.9,
        lastmod
      });
    });

    // End sitemap stream
    sitemap.end();

    // XML sitemap string
    const sitemapOutput = (await streamToPromise(sitemap)).toString();

    // Change headers
    res.writeHead(200, {
      'Content-Type': 'application/xml'
    });

    // Display output to user
    res.end(sitemapOutput);
  } catch (e) {
    res.status(500).end('Failed to generate the sitemap');
  }
}

export default buildSitemap;
