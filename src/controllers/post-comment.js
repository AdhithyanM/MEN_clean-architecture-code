/*
  - We got our factory function makePostComment which expects a dependency injection of our use-case addComment.
  - This returns a function named postComment which expects httpRequest. 
  - It extracts data from that httpRequest and pass that data to our addComment use-case and get the respective data.
  - Then it returns the response.
  
  - Note: This controller has no dependency over express js.
  - It just expects an object which depicts the request and gives us an object which again depicts the response.
  
  - The one which acts like an Adapter between route and these controllers is express-callback.
    - It is just something of Adapter Pattern.
 */
export default function makePostComment ({ addComment }) {
  return async function postComment (httpRequest) {
    try {
      const { source = {}, ...commentInfo } = httpRequest.body
      source.ip = httpRequest.ip
      source.browser = httpRequest.headers['User-Agent']
      if (httpRequest.headers['Referer']) {
        source.referrer = httpRequest.headers['Referer']
      }
      const posted = await addComment({
        ...commentInfo,
        source
      })
      return {
        headers: {
          'Content-Type': 'application/json',
          'Last-Modified': new Date(posted.modifiedOn).toUTCString()
        },
        statusCode: 201,
        body: { posted }
      }
    } catch (e) {
      // TODO: Error logging
      console.log(e)

      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 400,
        body: {
          error: e.message
        }
      }
    }
  }
}
