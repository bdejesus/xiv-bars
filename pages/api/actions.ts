import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function actionsHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    let file;
    const params = req.query;
    file = `${process.cwd()}/.apiData/JobActions/${params.job}.json`;

    if (`${params.job}` === 'PCT') {
      file = `${process.cwd()}/data/JobActions/PCT.json`;
    }

    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        res.status(500).json(err);
      }

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
