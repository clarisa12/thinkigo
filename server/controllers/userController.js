import { UserModel } from "../models/UserModel.js";

export const createUser = async (req, res) => {
    const { body } = req;

    const user = new UserModel(body);

    if (!user) {
        return res.status(400).json({ success: false });
    }

    user.setPassword(body.password);

    try {
        const jwt = user.generateJWT();
        await user.save();

        return res.status(201).json({
            success: true,
            token: jwt,
            message: "Account created!",
        });
    } catch (error) {
        return res.status(400).json({
            error,
            message: "Account not created!",
        });
    }
};

export const getUserInfo = async (req, res) => {
    const user = await UserModel.findOne({ _id: req.user.id });
    console.log(req.user);
    if (!user) {
        return res
            .status(404)
            .json({ success: false, error: `Account not found` });
    }

    return res.status(200).json({
        success: true,
        user: {
            boards: user.boards,
            fname: user.fname,
            lname: user.lname,
            email: user.email,
            avatar: user.avatar,
        },
    });
};

export const getUserBoards = async (req, res) => {
    let email = req.query.email;

    const user = await (await UserModel.findOne({ email })).populate("boards");

    if (!user) {
        return res
            .status(404)
            .json({ success: false, error: `Account not found` });
    }

    return res.status(200).json({
        success: true,
        user: user,
    });
};
