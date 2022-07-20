import csurf from 'csurf';

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
export function csrf(req, res) {
  const response = new Promise((resolve, reject) => {
    csurf({ cookie: true })(req, res, (result) => {
      if (result instanceof Error) {
        res.status(500).json({ status: 'not ok' });
        return reject(result);
      }

      res.status(200).json({ status: 'ok' });
      return resolve(result);
    });
  });

  return response;
}

export default csrf;
