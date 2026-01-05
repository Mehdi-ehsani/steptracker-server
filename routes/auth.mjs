import { Router } from "express";

const router = Router();

router.post('/register', (req, res) => {
    res.send("Hello Register")
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
