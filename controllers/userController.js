exports.login = async (req, res, next) => {
    const {email, password} = req.body;
    console.log(email);
    res.status(200).json({
        status: 200,
        message: 'Login successfully!'
    });
};