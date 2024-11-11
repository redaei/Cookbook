const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlenghth: [3, 'name must be more than 3 characters!'],
      maxlenghth: [10, 'this is too long name!']
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

const User = mongoose.model('User', userSchema)

module.exports = User
