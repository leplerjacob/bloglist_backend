const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        min: 3
    },
    name: {
        type: String,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    blogs: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }]
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})


const User = mongoose.model('User', userSchema)

userSchema.plugin(uniqueValidator)

module.exports = User