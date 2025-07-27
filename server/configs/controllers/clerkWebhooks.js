import User from "../../models/User.js";
import { Webhook } from "svix";

const clerkWebHooks = async (req, res) => {
    try {
        console.log("🔥 Clerk Webhook received:", req.body);
        // create svix instance clerk webhook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        // getting headers
        const headers = {
            'svix-id': req.headers['svix-id'],
            'svix-timestamp': req.headers['svix-timestamp'],
            'svix-signature': req.headers['svix-signature'],
        };

        //verify headers
        await whook.verify(JSON.stringify(req.body), headers)

        // getting data from request body

        const { data, type } = req.body

        const email =
            data.email_addresses?.[0]?.email_address || "unknown@example.com";

        const username = `${data.first_name || ""} ${data.last_name || ""}`.trim();

        const userData = {
            _id: data.id,
            email,
            username,
            image: data.image_url || "",
            recentSearchedCities: [], // ← ты же используешь это поле в модели
        };


        // swith cases for different events

        switch (type) {
            case 'user.created': {
                await User.create(userData)
                break;
            }
            case 'user.updated': {
                await User.findByIdAndUpdate(data.id, userData)
                break;
            }
            case 'user.deleted': {
                await User.findByIdAndDelete(data.id)
                break;
            }
            default:
                break;
        }
        res.json({
            success: true,
            message: 'webhook received'
        })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

export default clerkWebHooks