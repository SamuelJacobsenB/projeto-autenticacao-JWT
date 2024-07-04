const jwt = require('jsonwebtoken');
//------------------------------------------------
module.exports = cookieJwtAuth = (req,res,next)=>{
    const token = req.cookies.token;
    const JWT_SECRET = process.env.JWT_SECRET;

    try {
        const user = jwt.verify(token, JWT_SECRET);
        req.user = user;
        next();
    } catch (error) {
        res.clearCookie('token');
        req.flash('error_msg','Você deve estar logado para entrar nesta área');
        res.redirect('/signin');
    };
};