import mongoose, { Document, Schema, Model, Types } from 'mongoose'

export interface IComment {
  author: Types.ObjectId // Reference to User
  text: string
  childComment?: Types.ObjectId[] // Array of Comment references
  downVote?: Types.ObjectId[] // Array of User references
  upVote?: Types.ObjectId[] // Array of User references
  dateCreated: Date
}

export interface ICommentDocument extends IComment, Document {}

const CommentSchema = new Schema<ICommentDocument>({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  childComment: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  downVote: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  upVote: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dateCreated: { type: Date, default: Date.now },
})

const Comment: Model<ICommentDocument> =
  mongoose.models.Comment ||
  mongoose.model<ICommentDocument>('Comment', CommentSchema)

export default Comment
