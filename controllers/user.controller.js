const UserController = {};
const Users = require("../models/user.model");
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');

UserController.registerUser = async(req, res) => {
    try {
        const body = req.body;
        const password = body.password;

        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);

        body.password = hash;
        console.log('hash - > ', hash);

        const user = new Users(body);

        const result = await user.save();

        res.send({
            message: 'User Added Successfully',
            user: result
        });


    } catch (ex) {
        if (ex.code === 11000) {
            res
                .send({
                    message: 'This email has been registered already',
                })
                .status(500);
        } else {
            res
                .send({
                    message: 'Error',
                    detail: ex
                })
                .status(500);
        }
    }
};


UserController.signIn = async(req, res) => {
    try {
        const body = req.body;

        const email = body.email;

        // lets check if email exists

        const result = await Users.findOne({ email: email });
        if (!result) {
            // this means result is null
            res.status(401).send({
                Error: 'This user does not exists.'
            });
        } else {
            // email did exist
            // so lets match password

            if (bcrypt.compareSync(body.password, result.password)) {
                // great, allow this user access
                result.password = undefined;
                const token = jsonwebtoken.sign({
                    data: result,
                    role: 'User'
                }, process.env.JWT_KEY, { expiresIn: '7d' });
                console.log('match', process.env.JWT_KEY);
                res.send({ message: 'Successfully Logged in', token: token });
            } else {
                console.log('password does not match');
                res.status(401).send({ message: 'Wrong email or Password' });
            }
        }

    } catch (ex) {
        if (ex.code === 11000) {
            res
                .send({
                    message: 'This email has been registered already',
                })
                .status(500);
        } else {
            res
                .send({
                    message: 'Error',
                    detail: ex
                })
                .status(500);
        }
    }
};







module.exports = UserController;