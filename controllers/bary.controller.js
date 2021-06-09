const BaryController = {};
const Bary = require("../models/bary.model");

BaryController.get = async(req, res) => {
    try {
        let bary = await Bary.find();
        res.send({ bary: bary }).status(200);
    } catch (error) {
        res.send({
            message: 'Error',
            detail: ex
        }).status(500);
    }
}

BaryController.add = async(req, res) => {
    Bary.create(req.body, function(err, result) {
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

BaryController.update = async(req, res) => {
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
        const result = await Bary.updateOne({
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


BaryController.delete = async(req, res) => {
    if (!req.params._id) {
        res.status(500).send({
            message: 'ID missing'
        });
    }
    try {
        const _id = req.params._id;

        const result = await Bary.findOneAndDelete({
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


BaryController.deleteMultiple = async(req, res) => {
    try {
        const query = req.body.idArray;
        const result = await Bary.deleteMany({ _id: { $in: query } });
        res.status(200).send({
            code: 200,
            message: `${result.deletedCount} Bary Deleted Successfully`,
        });
    } catch (error) {
        return res.status(500).send(error);
    }
};

BaryController.searchByDate = async(req, res) => {
    try {

        let { startDate, endDate } = req.query;

        var formattedEndDate = new Date(endDate);
        formattedEndDate.setHours(24);
        date = {
            date: { $gte: new Date(startDate), $lte: formattedEndDate }
        };

        let result = await Bary.find(date);
        console.log(result);

        res.status(200).send({
            code: 200,
            bary: result,
        });

    } catch (error) {
        return res.status(500).send(error);
    }
}



module.exports = BaryController;