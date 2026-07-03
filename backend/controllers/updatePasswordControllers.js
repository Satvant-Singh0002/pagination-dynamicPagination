const bcrypt = require("bcrypt");

const User = require("../models/userModels");
const Forgotpassword = require("../models/forgotPasswordRequestModels");

const updatePassword = async (req, res) => {

    try {

        const { id } = req.params;
        const { newpassword } = req.body;

        const request = await Forgotpassword.findOne({
            where: {
                id,
                active: true
            }
        });

        if (!request) {
            return res.status(404).send("Invalid request");
        }

        const hash = await bcrypt.hash(newpassword, 10);

        await User.update(
            {
                password: hash
            },
            {
                where: {
                    id: request.userId
                }
            }
        );

        request.active = false;

        await request.save();

        res.send("Password updated successfully");

    } catch (err) {

        console.log(err);

        res.status(500).json(err);

    }

};

module.exports = {
    updatePassword
};