const { mongoose } = require("mongoose");
const bcrypt = require("bcrypt");

const saltRounds = 10

const userSchema = new mongoose.Schema({
    Name: {
        type: String, trim: true, required: true
    },
    Email: {
        type: String, trim: true, required: true
    },
    password: {
        type: String, trim: true, required: true
    }
});
console.log('ppp', this);
userSchema.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, saltRounds);
    next();
})

module.exports = mongoose.model('User', userSchema)