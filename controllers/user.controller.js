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
            res.send({
                message: 'This email has been registered already',
            }).status(500);
        } else {
            res.send({
                message: 'Error',
                detail: ex
            }).status(500);
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
                message: 'This user does not exists.'
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
                console.log('Password does not match');
                res.status(401).send({ message: 'Wrong email or password' });
            }
        }

    } catch (ex) {

        res.send({
            message: 'Error',
            detail: ex
        }).status(500);

    }
};

UserController.getUsers = async(req, res) => {
    try {
        const result = await Users.find();
        res.send({ users: result }).status(200);

    } catch (ex) {
        res.send({
            message: 'Error',
            detail: ex
        }).status(500);
    }
};


UserController.updateUser = async(req, res) => {
    if (!req.params._id) {
        res.status(500).send({
            message: 'ID missing'
        });
    }
    try {
        const _id = req.params._id;
        let updates = req.body;

        if (updates.password) {
            const password = updates.password;
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
            updates.password = hash;
        }

        runUpdate(_id, updates, res);


    } catch (error) {
        console.log('error', error);
        return res.status(500).send(error);
    }

};

async function runUpdate(_id, updates, res) {

    try {
        const result = await Users.updateOne({
            _id: _id
        }, {
            $set: updates
        }, {
            upsert: true,
            runValidators: true
        }); {
            if (result.nModified == 1) {
                res.status(200).send({
                    code: 200,
                    message: "Updated Successfully"
                });
            } else if (result.upserted) {
                res.status(200).send({
                    code: 200,
                    message: "Created Successfully"
                });
            } else {
                res
                    .status(422)
                    .send({
                        code: 422,
                        message: 'Unprocessible Entity'
                    });
            }
        }
    } catch (error) {
        console.log('error', error);
        return res.status(500).send(error);
    }
}




UserController.deleteUser = async(req, res) => {
    if (!req.params._id) {
        res.status(500).send({
            message: 'ID missing'
        });
    }
    try {
        const _id = req.params._id;

        const result = await Users.findOneAndDelete({
            _id: _id
        });

        res.status(200).send({
            code: 200,
            message: "Deleted Successfully"
        });

    } catch (error) {
        console.log('error', error);
        return res.status(500).send(error);
    }
};




module.exports = UserController;