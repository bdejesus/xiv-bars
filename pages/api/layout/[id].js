import db from 'lib/db';

async function showLayout(req, res) {
  try {
    const result = await db.layout.findUnique({
      where: { id: parseInt(req.query.id, 10) }
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(404).json({ status: 404, message: 'not found' });
  }
}

export default showLayout;
