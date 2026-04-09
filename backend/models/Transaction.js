const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    committee: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    amount: {
      type: Number,
      required: [true, 'Please add an amount'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
    },
    description: {
      type: String,
    },
    receiptLink: {
      type: String,
      required: [true, 'Please add a receipt link'],
      validate: {
        validator: function (v) {
          return /^https?:\/\/.+\..+/.test(v);
        },
        message: 'Please provide a valid URL (e.g., https://drive.google.com/...)',
      },
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true, // Automatically adds "createdAt"
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);