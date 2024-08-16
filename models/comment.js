import mongoose from 'mongoose';

const { Schema } = mongoose;

// Assuming the User and Comment models are defined elsewhere
const CommentSchema = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  childComment: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  downVote: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  upVote: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

// Check if the model already exists (to prevent recompilation during hot reloads)
const Comment = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);

export default Comment;


// let mongoose = require('mongoose')

// const { Schema } = mongoose;

// // Assuming the User and Comment models are defined elsewhere
// const CommentSchema = new Schema({
//   author: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   text: {
//     type: String,
//     required: true,
//   },
//   childComment: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Comment',
//     },
//   ],
//   downVote: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//     },
//   ],
//   upVote: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//     },
//   ],
//   dateCreated: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // Check if the model already exists (to prevent recompilation during hot reloads)
// module.exports = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);

