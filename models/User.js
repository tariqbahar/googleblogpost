import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Enter valid email",
      ],
    },
    password: {
      type: String,
      minlength: 6,
      select: false,
    },
    provider: {
      type: String,
      default: "credentials",
      enum: ["credentials", "google", "facebook", "github"],
    },
    googleId: String,
    facebookId: String,
    githubId: String,
    name: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    image: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
    userName: {
      type: String,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: Date,
    resetToken: String,
    resetExpiry: Date,
  },
  {
    timestamps: true,
  }
);

// Password hashing middleware (updated)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Password comparison method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if profile is complete
userSchema.methods.isProfileComplete = function () {
  return (
    this.name &&
    this.email &&
    (this.provider !== "credentials" || this.password)
  );
};

// Static method for finding or creating OAuth users
userSchema.statics.findOrCreate = async function (provider, profile) {
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
        verified: true,
      });
    }
  }

  return user;
};

export default mongoose.models.User || mongoose.model("User", userSchema);
