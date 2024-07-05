const jwt = require('jsonwebtoken');
//------------------------------------------------
module.exports = adminAuthenticate = (req,res,next)=>{
    const token = req.cookies.token;
    const JWT_SECRET = process.env.JWT_SECRET;

    try {
        const user = jwt.verify(token, JWT_SECRET);
        if(user.userType == 1){
            req.user = user;
            next();
        } else {
            req.flash('error_msg','Você não pode entrar nesta área');
            res.redirect('/users/main');
        };
    } catch (error) {
        res.clearCookie('token');
        req.flash('error_msg','Você deve estar logado para entrar nesta área');
        res.redirect('/signin');
    };
};