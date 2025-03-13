import express from "express"

export const router = express.Router()

router.get('/', (req, res) => {
    try {
        console.log('Hello I\'am Ali! :)')
        return res.send('hello')
    } catch (error) {
        return res.status(500).send({
            success: false,
            data: null,
            error: { message: "Internal server error!" }
        })
    }
})

export default router