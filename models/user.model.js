const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name value']
        },
        email: {
            type: String,
            required: [true, 'Please add a email value'],
            unique: true,
        },
        username: {
            type: String,
            required: [true, 'Please add a username value'],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Please add a password value']
        },
        role: {
            type: String,
            enum: ['Admin', 'User', 'Customer', 'Manager', 'Staff', 'Delivery', 'Driver', 'Rider', 'Sales', 'Marketing', 'Finance', 'Accounting', 'HR', 'IT', 'Support', 'Guest'],
            default: 'user'
        },
        dob: Date,
        ethnicity: {
            type: String,
            enum: ['Malay', 'Chinese', 'Indian', 'Others'],
        },
        phoneNumber: {
            type: String,
            required: [true, 'Please add a phoneNumber value'],
            unique: true,
        },
        address: String,
        image: {
            type: String,
        },
        points: {
            type: Number,
            default: 0,
        },
        refreshToken: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
        virtuals: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    }
)

// // Encrypts Password (Bcrypt)
userSchema.pre("save", async function (next) {
    console.log("Saving user...")
    try {
        if (this.isModified("password")) {
            const salt = await bcrypt.genSalt(12)
            const hash = await bcrypt.hash(this.password, salt)
            console.log("Hashing password...")
            this.password = hash
        }
        next()
    } catch (error) {
        next(error)
    }
})

userSchema.methods.comparePassword = async function (password) {
    try {
        const isMatch = await bcrypt.compare(password, this.password)
        return isMatch
    } catch (error) {
        throw error
    }
}

userSchema.virtual('cart', {
    ref: 'AddToCart',
    localField: '_id',
    foreignField: 'user',
    justOne: false,
})

userSchema.virtual('wishList', {
    ref: 'Wishlist',
    localField: '_id',
    foreignField: 'user',
    justOne: false,
})

userSchema.virtual('age').get(function () {
    const today = new Date()
    const birthDate = new Date(this.dob)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }
    return age
})

userSchema.pre(/^find/, function (next) {
    // this.populate({
    //     path: 'cart',
    //     select: '-user',
    // }).populate({
    //     path: 'wishList',
    //     select: '-user',
    // }).populate({
    //     path: 'age',
    // })
    if (this.dob) {
        this.age = this.get('age');
    }

    next()
})




module.exports = mongoose.model('User', userSchema)