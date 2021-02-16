import { UserModel } from "../models/UserModel.js";

export const handleSignIn = async (req, res) => {
    const { email, password } = req.body;
    const message = "Email or password incorrect!";
    const user = await UserModel.findOne({ email });

    if (!user || !password) res.status(401).json({ success: false, message });

    if (!user.validPassword(password))
        res.status(401).json({ success: false, message });

    res.json({
        success: true,
        userData: {
            fname: user.fname,
            lname: user.lname,
            email: user.email,
        },
        token: user.generateJWT(),
    });
};
