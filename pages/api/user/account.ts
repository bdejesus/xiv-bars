import db from 'lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'pages/api/auth/[...nextauth]';

export default async function accountHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) throw new Error('Unauthorized');

    const userId:number|undefined = session?.user.id;
    const { body } = req;

    switch (body.method) {
      case 'destroy': {
        await db.user
          .delete({ where: { id: userId } })
          .catch((error:Error) => {
            console.error(error);
            throw new Error('Could not delete account.');
          });
        res.status(200).json({ status: 'ok' });
        break;
      }

      default: {
        const message = 'Bad Request';
        res.statusMessage = message;
        res.status(400).json({ message, status: 'error', error: 400 });
        break;
      }
    }
  } catch (error) {
    const message = 'Unauthorized';
    // console.error(error);
    res.statusMessage = message;
    res.status(401).json({ message, status: 'error', error: 401 });
  }
}
