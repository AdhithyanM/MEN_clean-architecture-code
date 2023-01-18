/*
  - When you see this file you notice there are no import or require statements.
  - This is an Entity.
  - Entities have no dependencies.
  - If we are using import or require, those constitutes direct dependencies and we can't have that.
  - What we did here is dependency injection.
  - We are exporting a function called buildMakeComment.
  - That gonna receive all of our dependencies.
  - So somewhere upstream, we have got some code that call this function and inject all of the various dependencies that the fn requires in order to do its work.
  - Advantages:
      - testability
        - you can stub out any of these dependencies so you can test this code independently of anything else.
      - Dependencies are need not to be ready.
        - you can write a test stub and do it later. This lets you handle the business logic.
      - Can change the implementation of dependencies independently of this code.
        - the fn sanitize works to make sure there is no invalid html or script tags inside my comment
        - We depend on a 3rd party library to make this work coming from npm.
        - In future we can have our own sanitize logic instead of 3rd party library without touching the business logic and other parts.
  - Our function returns a function called makeComment here.
  - It is a factory that can return us an instance of our comment entity. 
*/
                                                // Dependency Injection.
export default function buildMakeComment ({ Id, md5, sanitize, makeSource }) {
  
  // We receive all the properties that make up a comment. 
  return function makeComment ({
    author,
    createdOn = Date.now(),
    id = Id.makeId(),
    source,
    modifiedOn = Date.now(),
    postId,
    published = false,
    replyToId,
    text
  } = {}) {

    // validations.
    if (!Id.isValidId(id)) {
      throw new Error('Comment must have a valid id.')
    }
    if (!author) {
      throw new Error('Comment must have an author.')
    }
    if (author.length < 2) {
      throw new Error("Comment author's name must be longer than 2 characters.")
    }
    if (!postId) {
      throw new Error('Comment must contain a postId.')
    }
    if (!text || text.length < 1) {
      throw new Error('Comment must include at least one character of text.')
    }
    if (!source) {
      throw new Error('Comment must have a source.')
    }
    if (replyToId && !Id.isValidId(replyToId)) {
      throw new Error('If supplied. Comment must contain a valid replyToId.')
    }

    // html and scripts sanity check to avoid xss
    let sanitizedText = sanitize(text).trim()
    if (sanitizedText.length < 1) {
      throw new Error('Comment contains no usable text.')
    }

    // whether it is coming from valid IP source check
    const validSource = makeSource(source)

    const deletedText = '.xX This comment has been deleted Xx.'
    let hash       // unique for each comment

    // frozen object is returned which has all the methods that this entity provides.
    // It is read only and we cannot add or modify properties in this returned object.
    return Object.freeze({
      getAuthor: () => author,
      getCreatedOn: () => createdOn,
      getHash: () => hash || (hash = makeHash()),
      getId: () => id,
      getModifiedOn: () => modifiedOn,
      getPostId: () => postId,
      getReplyToId: () => replyToId,
      getSource: () => validSource,
      getText: () => sanitizedText,
      isDeleted: () => sanitizedText === deletedText,
      isPublished: () => published,
      markDeleted: () => {
        sanitizedText = deletedText
        author = 'deleted'
      },
      publish: () => {
        published = true
      },
      unPublish: () => {
        published = false
      }
    })

    function makeHash () {
      return md5(
        sanitizedText +
          published +
          (author || '') +
          (postId || '') +
          (replyToId || '')
      )
    }
  }
}
