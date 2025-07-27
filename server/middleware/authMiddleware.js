import User from "../models/User.js";


// middlw to check if user is auth
export const protect = async (req, res, next) => {
    const { userId } = req.auth;
    if (!userId) {
        res.json({ success: false, message: 'not auth' })
    } else {
        const user = await User.findById(userId);
        req.user = user;
        next()
    }
}