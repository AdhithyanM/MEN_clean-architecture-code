/*
  - we expose all of our use-cases via this index JS file.
 */
// Factories Import
import makeAddComment from './add-comment'
import makeEditComment from './edit-comment'
import makeRemoveComment from './remove-comment'
import makeListComments from './list-comments'
import makeHandleModeration from './handle-moderation'

// Dependencies Import
import commentsDb from '../data-access'
import isQuestionable from '../is-questionable'

// Get the use-case functions by providing dependencies to the Factory functions.
const handleModeration = makeHandleModeration({
  isQuestionable,
  initiateReview: async () => {} // TODO: Make real initiate review function.
})
const addComment = makeAddComment({ commentsDb, handleModeration })
const editComment = makeEditComment({ commentsDb, handleModeration })
const listComments = makeListComments({ commentsDb })
const removeComment = makeRemoveComment({ commentsDb })

// Export all functions as a whole as commentService.
const commentService = Object.freeze({
  addComment,
  editComment,
  handleModeration,
  listComments,
  removeComment
})

export default commentService

// And for convenience we also expose them individually so we can pull one at a time.
export { addComment, editComment, listComments, removeComment }
