import { SitemapStream, streamToPromise } from 'sitemap';
import Jobs from 'apiData/Jobs.json';
import BaseClassIDs from 'data/BaseClassIDs.json';
import { domain } from 'lib/host';
import { NextApiRequest, NextApiResponse } from 'next';

async function buildSitemap(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const sitemap = new SitemapStream({
      hostname: domain
    });

    sitemap.write({
      url: '/',
      priority: 0.9,
      lastmod: '2019-12-29'
    });

    // Create each URL row
    const advancedJobs = Jobs.filter((job) => !BaseClassIDs.includes(job.ID));

    advancedJobs.forEach((job) => {
      sitemap.write({
        url: `/job/${job.Abbr}`,
        priority: 0.9,
        lastmod: '2019-12-29'
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
