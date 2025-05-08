import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  // Existing fields from old schema
  email: { 
    type: String, 
    unique: true,
    required: [true, 'Please enter your email'],
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    minlength: [6, 'Minimum password length is 6 characters']
  },
  provider: { 
    type: String, 
    default: 'credentials',
    enum: ['credentials', 'google', 'facebook', 'github']
  },
  facebookId: String,
  googleId: String,
  githubId: String,
  resetToken: String,
  resetExpiry: Date,
  // verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },

  // New fields for enhanced registration
  name: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  lastLogin: Date,
  // profileComplete: {
  //   type: Boolean,
  //   default: false
  // }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Password hashing middleware (updated)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if profile is complete
userSchema.methods.isProfileComplete = function() {
  return this.name && this.email && (this.provider !== 'credentials' || this.password);
};

// Static method for finding or creating OAuth users
userSchema.statics.findOrCreate = async function(provider, profile) {
  let user;
  const query = { [`${provider}Id`]: profile.id };
  
  user = await this.findOne(query);
  
  if (!user) {
    user = await this.findOne({ email: profile.email });
    
    if (user) {
      // Link existing account with OAuth provider
      user[`${provider}Id`] = profile.id;
      user.provider = provider;
      await user.save();
    } else {
      // Create new OAuth user
      user = await this.create({
        name: profile.name,
        email: profile.email,
        provider,
        [`${provider}Id`]: profile.id,
        verified: true
      });
    }
  }
  
  return user;
};

export default mongoose.models.User || mongoose.model('User', userSchema);