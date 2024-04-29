import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function actionsHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const params = req.query;
    const file = `${process.cwd()}/.apiData/JobActions/${params.job}.json`;

    fs.readFile(file, 'utf8', (err, data) => {
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
