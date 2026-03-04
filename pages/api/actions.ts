import { readFile } from 'fs/promises';
import { NextApiRequest, NextApiResponse } from 'next';
import Jobs from 'apiData/Jobs.json';

export default async function actionsHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { job, isPvp } = req.query;

    // Validate jobId
    const jobId = Jobs.find((j) => j.Abbr === job)?.Abbr;
    if (!jobId) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Read the file
    const file = `${process.cwd()}/.apiData/JobActions/${jobId}.json`;
    const fileContent = await readFile(file, 'utf8');
    const jsonData = JSON.parse(fileContent);

    const actions = isPvp === 'true' ? jsonData.PvP : jsonData.PvE;

    return res.status(200).json(actions);
  } catch (error) {
    const message = 'Not Found';
    res.statusMessage = message;
    return res.status(404).json(error);
  }
}
