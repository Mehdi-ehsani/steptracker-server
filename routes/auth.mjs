import { Router } from "express";
import { validate } from "../middlewares/index.mjs";
import { userSchema } from "../validation/index.mjs";

const router = Router();

router.post('/register', validate(userSchema), (req, res) => {
    const {name , email , password} = req.body;
    res.status(200).send({name , email , password})
})

router.post('/verify-email', (req, res) => {
    res.send("Hello verify email")
})

router.post('/resend-email-otp', (req, res) => {
    res.send("Hello resend email otp")
})

router.post('/login', (req, res) => {
    res.send("Hello login")
})

export { router as authRouter };
