const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductCollectionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
  medias: [
    {
      type: String,
    },
  ],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Photo count virtual
ProductCollectionSchema.virtual('photo_count').get(function () {
  // Loop through to check the extension of each media
  let count = 0;
  for (let i = 0; i < this.medias.length; i++) {
    const media = this.medias[i];
    const extension = media.split('.').pop();
    if (extension === 'jpg' || extension === 'png' || extension === 'jpeg' || extension === 'gif' || extension === 'webp' || extension === 'bmp') {
      count++;
    }
  }
  return count; // Return the computed count value
});

// Video count virtual
ProductCollectionSchema.virtual('video_count').get(function () {
  // Loop through to check the extension of each media
  let count = 0;
  for (let i = 0; i < this.medias.length; i++) {
    const media = this.medias[i];
    const extension = media.split('.').pop();
    if (extension === 'mp4') {
      count++;
    }
  }
  return count; // Return the computed count value
});

module.exports = mongoose.model('ProductCollection', ProductCollectionSchema);