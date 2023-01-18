/*
  - If you see there is one import that is for our comment entity.
  - From our diagram we know that use-cases are dependent on our entities.
  - So it is valid to import a concrete implementation of an entity into an use-case.

  - Similar to our entity comment,
  - We had our makeAddComment factory function that gonna receive dependencies of this use case.

  - The dependencies commentsDb, handleModeration are Adapters.
  - They are injected from the green layer of the circles diagram.
  
  - Eventhough we don't have interfaces, we are using dependency injection to make sure that
  - we are not tightly coupled to our dependencies at design-time, we only tightly coupled to them at runtime.
 */

import makeComment from '../comment'

export default function makeAddComment ({ commentsDb, handleModeration }) {
  // our makeAddComment factory function returns a function addComment which takes commentInfo as parameter.
  return async function addComment (commentInfo) {
    // based on the info we make our comment entity.
    const comment = makeComment(commentInfo)
    // we check if the comment already exists in db by using hash.
    const exists = await commentsDb.findByHash({ hash: comment.getHash() })
    if (exists) {
      return exists
    }
    // if not exists, we validate if the comment is moderated.
    const moderated = await handleModeration({ comment })
    const commentSource = moderated.getSource()
    // after all validations we insert our comment as document into db.
    /*
      - What we pass to our commentsDb is just plain Object with plain Properties.
      - All those stuff are already validated and are good.
      - We don't need the commentsDB which is an Adapter to our database to know or understand anything about the comment entity.
      - The DB Adapter should always receive plain object - this is another principle of clean architecture.
      
      - You need to pass information between the layers in the format or structure that is most convenient for the layer to
        whom you are passing that information.
     */
    return commentsDb.insert({
      author: moderated.getAuthor(),
      createdOn: moderated.getCreatedOn(),
      hash: moderated.getHash(),
      id: moderated.getId(),
      modifiedOn: moderated.getModifiedOn(),
      postId: moderated.getPostId(),
      published: moderated.isPublished(),
      replyToId: moderated.getReplyToId(),
      source: {
        ip: commentSource.getIp(),
        browser: commentSource.getBrowser(),
        referrer: commentSource.getReferrer()
      },
      text: moderated.getText()
    })
  }
}
