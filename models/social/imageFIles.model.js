const mongoose = require("mongoose");
const { Schema } = mongoose;

const ImageFileSchema = new Schema({
    arrangements: [
        [{
            type: String,
        }]
    ],
    platform: {
        type: String,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

const ImageFile = mongoose.model("ImageFile", ImageFileSchema);