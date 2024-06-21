const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    email: {
        type: String,
        unique: true,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    designation: {
        type: String,
        required: true
    },

    username: {
        type: String,
        unique: true,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    totalLeave: {
        type: Number,
        required: true
    },

    takenLeave: {
        type: Number,
        required: true
    },

    remainingLeave: {
        type: Number,
        required: true
    },

    pastLeave: {
        type: Array,
        default: []
    },

    pastWfh: {
        type: Array,
        default: []
    },


    notifications: {
        type: Array,
        default: []
    },

    Avatar: {
        type: String,
        default: ""
    }

})

userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return next()
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err)
        }

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
                return next(err)
            }
            user.password = hash;
            next()
        })
    })

})

userSchema.pre('save', function (next) {
    if (this.pastLeave && this.pastLeave.length > 0) {
        // Move the last element to the 0th position
        const lastLeave = this.pastLeave.pop();
        this.pastLeave.unshift(lastLeave);
    }
    if (this.notifications && this.notifications.length > 0) {
        // Move the last element to the 0th position
        const lastNotification = this.notifications.pop();
        this.notifications.unshift(lastNotification);
    }
    if (this.pastWfh && this.pastWfh.length > 0) {
        // Move the last element to the 0th position
        const lastWfh = this.pastWfh.pop();
        this.pastWfh.unshift(lastWfh);
    }
    next();
});


userSchema.methods.comparePassword = function (candidatePassword) {
    const user = this;
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
            if (err) {
                return reject(err)
            }
            if (!isMatch) {
                return reject(err)
            }
            resolve(true)
        })
    })
}

mongoose.model('User', userSchema)