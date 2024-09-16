module.exports = (roles) => { // kullanıcı rolünü aldık
    return (req, res, next) => {
        const userRole = req.body.role || "user"; //name="role" register.ejs den geliyor
        if(roles.includes(userRole)) {
            next();
        } else {
            return res.status(404).send("You can't do it!")
        }
    }
}