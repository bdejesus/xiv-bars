const { SitemapStream, streamToPromise } = require('sitemap');
const Jobs = require('.apiData/Jobs.json');
const BaseClassIDs = require('data/BaseClassIDs.json');
const { domain } = require('lib/host');
const { withSentry } = require('@sentry/nextjs');

async function buildSitemap(req, res) {
  try {
    const sitemap = new SitemapStream({
      hostname: domain,
      cacheTime: 600000
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
    res.status = 500;
    res.end('Failed to generate the sitemap');
  }
}

export default withSentry(buildSitemap);
