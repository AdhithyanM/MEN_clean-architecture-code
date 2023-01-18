// Use-Cases Import <--- dependencies that our factories need in order to return respective controller function.
import {
  addComment,
  editComment,
  listComments,
  removeComment
} from '../use-cases'
// Factories Import
import makeDeleteComment from './delete-comment'
import makeGetComments from './get-comments'
import makePostComment from './post-comment'
import makePatchComment from './patch-comment'
// controller import
import notFound from './not-found'

// Injecting those factory dependencies.
const deleteComment = makeDeleteComment({ removeComment })
const getComments = makeGetComments({
  listComments
})
const postComment = makePostComment({ addComment })
const patchComment = makePatchComment({ editComment })

// Exporting an Object that exposes all our controllers.
const commentController = Object.freeze({
  deleteComment,
  getComments,
  notFound,
  postComment,
  patchComment
})

export default commentController

// Again for convenience we export them individually.
export { deleteComment, getComments, notFound, postComment, patchComment }
