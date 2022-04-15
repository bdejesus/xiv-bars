import csurf from 'csurf';

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
export function csrf(req, res) {
  return new Promise((resolve, reject) => {
    csurf({ cookie: true })(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default csrf;
