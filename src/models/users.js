const mongoose = require('mongoose')

const ProductSchema = mongoose.Schema({
    email: { type: String }
})

module.exports = mongoose.model('users',ProductSchema)