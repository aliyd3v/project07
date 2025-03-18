const tableController = {
    createOne: async (req, res, next) => {
        try {
            res.status(201).json({
                status: 'success',
                data: null
            })
        } catch (error) {
            next(error)
        }
    }
}

export default tableController