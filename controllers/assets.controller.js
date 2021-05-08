const AssetsController = {};
const Assets = require("../models/assets.model");

AssetsController.getAssets = async(req, res) => {
    try {
        let assets = await Assets.find();
        res.send({ assets: assets }).status(200);
    } catch (error) {
        res.send({
            message: 'Error',
            detail: ex
        }).status(500);
    }
}

AssetsController.addAsset = async(req, res) => {
    Assets.create(req.body, function(err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            var data = {
                code: 200,
                message: 'Data inserted successfully',
                data: result
            };
            res.status(200).send(data);
        }
    });
}

AssetsController.updateAsset = async(req, res) => {
    if (!req.params._id) {
        res.status(500).send({
            message: 'ID missing'
        });
    }
    try {
        const _id = req.params._id;
        let updates = req.body;

        runUpdate(_id, updates, res);


    } catch (error) {
        console.log('error', error);
        return res.status(500).send(error);
    }

};

async function runUpdate(_id, updates, res) {

    try {
        const result = await Assets.updateOne({
            _id: _id
        }, {
            $set: updates
        }, {
            upsert: true,
            runValidators: true
        });


        {
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


AssetsController.deleteAsset = async(req, res) => {
    if (!req.params._id) {
        res.status(500).send({
            message: 'ID missing'
        });
    }
    try {
        const _id = req.params._id;

        const result = await Inventory.findOneAndDelete({
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


AssetsController.deleteMultipleAssets = async(req, res) => {
    try {
        const query = req.body;
        console.log(query);
        const result = await Property.deleteMany({ _id: { $in: query } });
        res.status(200).send({
            code: 200,
            message: `${result.deletedCount} Assets Deleted Successfully`,
        });
    } catch (error) {
        return res.status(500).send(error);
    }
};



module.exports = AssetsController;