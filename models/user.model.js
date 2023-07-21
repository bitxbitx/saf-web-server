const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

/**
 * @swagger
 * components:
 *  schemas:
 *   User:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *         description: User ID
 *         example: "611fda05f2d63e001bbcc7a1"
 *       name:
 *         type: string
 *         description: Name of the user
 *         example: Arthur Dent
 *       email:
 *         type: string
 *         description: Email address of the user
 *         example: arthur@example.com
 *       username:
 *         type: string
 *         description: Username of the user
 *         example: arthur42
 *       password:
 *         type: string
 *         description: Password of the user
 *       role:
 *         type: string
 *         enum:
 *           - "Admin"
 *           - "User"
 *           - "Customer"
 *           - "Manager"
 *           - "Staff"
 *           - "Delivery"
 *           - "Driver"
 *           - "Rider"
 *           - "Sales"
 *           - "Marketing"
 *           - "Finance"
 *           - "Accounting"
 *           - "HR"
 *           - "IT"
 *           - "Support"
 *           - "Guest"
 *         description: User role (Admin, User, etc.)
 *         example: "User"
 *       dob:
 *         type: string
 *         format: date
 *         description: Date of birth of the user
 *         example: "1990-01-01"
 *       ethnicity:
 *         type: string
 *         enum:
 *           - "Malay"
 *           - "Chinese"
 *           - "Indian"
 *           - "Others"
 *         description: Ethnicity of the user
 *         example: "Malay"
 *       phoneNumber:
 *         type: string
 *         description: Phone number of the user
 *         example: "1234567890"
 *       address:
 *         type: string
 *         description: Address of the user
 *         example: "123 Main Street"
 *       image:
 *         type: string
 *         description: URL to the user's image
 *         example: "https://example.com/images/arthur.jpg"
 *       points:
 *         type: integer
 *         description: User points
 *         example: 100
 */

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