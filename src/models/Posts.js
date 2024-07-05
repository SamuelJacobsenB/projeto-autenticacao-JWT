const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//------------------------------------------------
const Post = new Schema({
        name: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            required: false
        },
        content: {
            type: String,
            required: true
        }
    },    
{
    timestamps: true
});
//------------------------------------------------
module.exports = mongoose.model('posts',Post);