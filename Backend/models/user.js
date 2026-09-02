import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      default: null,
      select: false
    },
    mobile: {
      type: String,
      default: null,
      trim: true
    },
    role: {
      type: String,
      enum: ['user', 'owner', 'deliverBoy'],
      default: 'user'
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      required: true,
      default: 'local'
    },
    authProviders: {
      type: [String],
      enum: ['local', 'google'],
      default: []
    },
    googleId: {
      type: String,
      default: null,
      unique: true,
      sparse: true
    },
    firebaseUid: {
      type: String,
      default: null,
      unique: true,
      sparse: true
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    resetOTP: {
      type: String,
      default: null
    },
    isResetOTPVerified: {
      type: Boolean,
      default: false
    },
    resetOTPExpiry: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
