/*
  - This is just an adapter that takes our controllers
  - Turns them into an express js style callback.

  - for a simple route,

  app.post(`/fsf/dfdwf`, (req, res) => {
      // code
  });

  app.post(`/sds/fsfs`, controller1);
  // in the controller...
  export default const controller1 = (req, res) => {
    // code
  }

  - Noticed the problem? 
    - we need our controller to be isolated from express framework demands and logic.
    - So we use this Adapter.
*/

module.exports = function makeExpressCallback (controller) {
  return (req, res) => {
    const httpRequest = {
      body: req.body,
      query: req.query,
      params: req.params,
      ip: req.ip,
      method: req.method,
      path: req.path,
      headers: {
        'Content-Type': req.get('Content-Type'),
        Referer: req.get('referer'),
        'User-Agent': req.get('User-Agent')
      }
    }
    controller(httpRequest)
      .then(httpResponse => {
        if (httpResponse.headers) {
          res.set(httpResponse.headers)
        }
        res.type('json')
        res.status(httpResponse.statusCode).send(httpResponse.body)
      })
      .catch(e => res.status(500).send({ error: 'An unkown error occurred.' }))
  }
}
