import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import Jobs from 'apiData/Jobs.json';

export default async function actionsHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const params = req.query;
    const jobId = Jobs.map(({ Abbr }) => Abbr).find((id) => id === params.job);
    const file = `${process.cwd()}/.apiData/JobActions/${jobId}.json`;

    fs.readFile(file, 'utf8', (err, data) => {
      if (err) res.status(500).json(err);

      const jsonData = JSON.parse(data);
      const actions = params.isPvp === 'true' ? jsonData.PvP : jsonData.PvE;
      res.status(200).json(actions);
    });
  } catch (error) {
    const message = 'Not Found';
    res.statusMessage = message;
    res.status(404).json(error);
  }
}
