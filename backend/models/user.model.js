import mongoose from "mongoose";
import findOrCreate from "mongoose-findorcreate";
import crypto from "crypto";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config({path: ".env"});

const secret = process.env.JWT_SECRET;

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [
        /^(?=.{1,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
        "is invalid",
      ],
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      index: true,
    },
    chatRooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
      },
    ],
    muteList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
      },
    ],
    hash: String,
    salt: String,
  },
  {timestamps: true}
);
UserSchema.plugin(findOrCreate);

UserSchema.methods.validPassword = function (password) {
  var hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.hash === hash;
};

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};

UserSchema.methods.generateJWT = function () {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      exp: parseInt(exp.getTime() / 1000),
    },
    secret
  );
};

UserSchema.methods.toAuthJSON = function () {
  return this.generateJWT();
};

UserSchema.methods.getIdJSON = function () {
  return {
    user_id: this._id,
    username: this.username,
  };
};

UserSchema.methods.getUserInfoJSON = async function () {
  let imageUrl;
  if (this.image.startsWith("https://lh3.googleusercontent.com")) {
    imageUrl = this.image;
  } else {
    imageUrl = await getImageUrl(
      process.env.GCS_PROFILE_BUCKET,
      null,
      this.image
    );
  }
  return {
    username: this.username,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    phoneNumber: this.phoneNumber,
    prefix: this.prefix,
    ownProducts: this.ownProducts,
    image: imageUrl,
    IDCardImage: this.IDCardImage,
    IDCardNumber: this.IDCardNumber,
    drivingLicenseImage: this.drivingLicenseImage,
    drivingLicenseNumber: this.drivingLicenseNumber,
    prefix: this.prefix,
    role: this.role,
    rating: this.rating,
    rentedCount: this.rentedCount,
    rentedOutCount: this.rentedOutCount,
    status: this.status,
    requestTobeLessor: this.requestTobeLessor,
  };
};

UserSchema.methods.getNavbarInfoJSON = async function () {
  let imageUrl;
  if (this.image.startsWith("https://lh3.googleusercontent.com")) {
    imageUrl = this.image;
  } else {
    imageUrl = await getImageUrl(
      process.env.GCS_PROFILE_BUCKET,
      null,
      this.image
    );
  }

  return {
    username: this.username,
    status: this.status,
    user_id: this._id,
    image: imageUrl,
    role: this.role,
    requestTobeLessor: this.requestTobeLessor,
    haveVerificationInfo: !!(
      this.drivingLicenseImage &&
      this.IDCardImage &&
      true
    ),
  };
};

const User = mongoose.model("User", UserSchema);
export default User;
