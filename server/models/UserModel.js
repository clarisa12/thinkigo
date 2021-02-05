import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import crypto from "crypto";
import jwt from "jsonwebtoken";

// import secret from "../auth/config").secret;

/**
 * Defines the User schema
 */
//FIXME:
const UserSchema = new mongoose.Schema(
    {
        fname: { type: String, required: true },
        lname: { type: String, required: true },
        email: {
            type: String,
            lowercase: true,
            unique: true,
            required: [true, "Can't be blank"],
            match: [/\S+@\S+\.\S+/, "Email is invalid"],
            index: true,
        },
        passwordHash: {
            type: String,
            required: [true, "Password is required"],
        },
        salt: String,
        avatar: String,
        boards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Board" }],
    },
    { timestamps: true }
);

/**
 * We do not want to have duplicate users
 * Using Unique validator plugin will prevent this
 */
UserSchema.plugin(uniqueValidator, { message: "User is already taken." });

/**
 * Should create a password hash to store
 * in db and authentication validation
 */
function createHash(password, salt) {
    // info on salt and why you need it: https://stackoverflow.com/questions/50460701/why-to-store-salt-along-with-hashed-password-in-database
    salt = salt || crypto.randomBytes(16).toString("hex");

    return crypto
        .pbkdf2Sync(password, salt, 10000, 512, "sha512")
        .toString("hex");
}

/**
 * Define custom UserSchema instance methods
 * more info: https://mongoosejs.com/docs/guide.html#methods
 */
UserSchema.methods = {
    ...UserSchema.methods,
    setPassword(password) {
        this.salt = crypto.randomBytes(16).toString("hex");
        this.passwordHash = crypto
            .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
            .toString("hex");
    },
    validPassword(password) {
        const hash = createHash(password, this.salt);
        return this.passwordHash === hash;
    },
    generateJWT() {
        return jwt.sign(
            {
                id: this._id,
                email: this.email,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "60d" }
        );
    },
    toAuthJSON() {
        return {
            fname: this.fname,
            email: this.email,
            token: this.generateJWT(),
            avatar: this.avatar,
        };
    },
};

export const UserModel = mongoose.model("User", UserSchema);
