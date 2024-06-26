// a function for asyncHandler METH 2
const asyncHandler = (requestHandler) => {
    // returning as a promise
    return (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next)).catch((err) => next(err))
    }
}


export { asyncHandler }




// const asyncHandler = () => {}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async () => {}

//a function for asyncHandler METH 1 (Meth 2 below)
//it helps to not create everthing in promises i.e. try and catch each and every time

// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }