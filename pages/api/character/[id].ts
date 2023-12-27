import { NextApiRequest, NextApiResponse } from 'next';
import { Character } from '@xivapi/nodestone';

export default async function characterHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const characterId = req.query.id;
  const characterSearch = new Character();

  const character = await characterSearch.parse({ params: { characterId } } as never);

  if (character) {
    res.status(200).json(character);
  } else {
    res.status(404).json({ status: 'Not Found' });
  }
}
