import { SitemapStream, streamToPromise } from 'sitemap';
import { advancedJobs } from 'data/jobs';

export default async (req, res) => {
  try {
    const sitemap = new SitemapStream({
      hostname: `https://${req.headers.host}`,
      cacheTime: 600000
    });

    sitemap.write({
      url: '/',
      priority: 0.9,
      lastmod: '2019-12-29'
    });

    // Create each URL row
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
    res.send(JSON.stringify(e));
  }
};
