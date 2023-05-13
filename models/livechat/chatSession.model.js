const mongoose = require('mongoose');
const Schema = mongoose.Schema

const ChatSessionSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  messages: [{
    type: Schema.Types.ObjectId,
    ref: 'ChatMessage'
  }],
  status: {
    type: String,
    enum: ['active', 'archived', 'closed'],
    default: 'active'
  }
},
  {
    timestamps: true,
  }
);

ChatSessionSchema.pre('save', async function (next) {
  if (this.name == null || this.name == '') {
    this.name = this.participants.map(participant => participant.name).join(', ');
  }
  next();
});

module.exports = mongoose.model('ChatSession', ChatSessionSchema)