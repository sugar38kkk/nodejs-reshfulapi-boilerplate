const mongoose = require("mongoose");
const { Password } = require("../utils/password");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "Please add your first name"],
      trim: true,
      maxLength: [20, "Your name is up to 20 chars long."],
    },
    last_name: {
      type: String,
      required: [true, "Please add your last name"],
      trim: true,
      maxLength: [20, "Your name is up to 20 chars long."],
    },
    email: {
      type: String,
      required: [true, "Please add your email"],
      trim: true,
      unique: true,
    },
    username: {
      type: String,
      required: [true, "Please add your username"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add your password"],
      trim: true,
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png",
    },
    role: {
      type: String,
      default: "user", // admin
    },
    status: {
      type: String,
      enum: ["ACTIVED", "DELETED", "BLOCKED"],
      default: "ACTIVED",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.options.toJSON = {
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.password;
    delete ret.__v;
  },
},

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

userSchema.statics.build = (attrs) => {
  return new User(attrs);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
