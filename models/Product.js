const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  salePrice: {
    type: Number,
    min: 0
  },
  description: String,
  specifications: [{
    name: String,
    value: String
  }],
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  images: [String],
  mainImage: String,
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  ratings: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    rating: Number,
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Tạo slug trước khi lưu
productSchema.pre('save', function(next) {
  if (!this.isModified('name')) {
    next();
    return;
  }
  this.slug = this.name.toLowerCase().replace(/ /g, '-');
  next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product; 