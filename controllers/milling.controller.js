const MillingController = {};
const Milling = require("../models/milling.model");
const Inventory = require("../models/inventory.model");

MillingController.get = async(req, res) => {
    try {
        let milling = await Milling.find();
        res.send({ milling: milling }).status(200);
    } catch (error) {
        res.send({
            message: 'Error',
            detail: ex
        }).status(500);
    }
}

MillingController.add = async(req, res) => {
    req.body.kaat = (req.body.kaatper100kg * req.body.saryaWeight) / 100;
    req.body.scrap = req.body.billetWeight - (req.body.saryaWeight + req.body.kaat);
    var stock = req.body.stockReference;
    var updates = {
        weight: stock.weight - req.body.billetWeight
    }

    const result = await Inventory.updateOne({
        _id: stock._id
    }, {
        $set: updates
    }, {
        upsert: true,
        runValidators: true
    });
    Milling.create(req.body, function(err, result) {
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

MillingController.update = async(req, res) => {
    if (!req.params._id) {
        res.status(500).send({
            message: 'ID missing'
        });
    }
    try {
        console.log(req.body);
        const _id = req.params._id;
        req.body.kaat = (req.body.kaatper100kg * req.body.saryaWeight) / 100;
        req.body.scrap = req.body.billetWeight - (req.body.saryaWeight + req.body.kaat);
        let updates = req.body;
        var stock = req.body.stockReference;

        //getting stock info
        var stockResult = await Inventory.find({ _id: stock._id });
        stockResult = stockResult[0]

        //condition on new billet weight which will effect stock as well
        //If new billetWeight is greater
        if (updates.billetWeight > updates.previousBillet) {
            let billetDifference = updates.billetWeight - updates.previousBillet;

            if (billetDifference <= stockResult.weight) {
                var stockUpdates = { weight: stockResult.weight - billetDifference };

                runStockUpdate(stock._id, stockUpdates);
            } else if (billetDifference > stockResult.weight) {
                res.status(500).send({ error: "Limited Stock Error" });
            }
        }

        //condition on new billet weight which will effect stock as well
        //if new billetWeight is lesser
        if (updates.billetWeight < updates.previousBillet) {
            let billetDifference = updates.previousBillet - updates.billetWeight;
            var stockUpdates = { weight: stockResult.weight + billetDifference };

            runStockUpdate(stock._id, stockUpdates)
        }
        runUpdate(_id, updates, res);


    } catch (error) {
        console.log('error', error);
        return res.status(500).send(error);
    }

};

async function runUpdate(_id, updates, res) {

    try {
        const result = await Milling.updateOne({
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

//Updating stocks according to Milling
async function runStockUpdate(_id, updates) {

    try {
        const result = await Inventory.updateOne({
            _id: _id
        }, {
            $set: updates
        }, {
            upsert: true,
            runValidators: true
        });


    } catch (error) {
        console.log('error', error);
    }
}


MillingController.delete = async(req, res) => {
    if (!req.params._id) {
        res.status(500).send({
            message: 'ID missing'
        });
    }
    try {
        const _id = req.params._id;

        const result = await Milling.findOneAndDelete({
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


MillingController.deleteMultiple = async(req, res) => {
    try {
        const query = req.body.idArray;
        const result = await Milling.deleteMany({ _id: { $in: query } });
        res.status(200).send({
            code: 200,
            message: `${result.deletedCount} Milling Deleted Successfully`,
        });
    } catch (error) {
        return res.status(500).send(error);
    }
};

MillingController.searchByDate = async(req, res) => {
    try {

        let { startDate, endDate } = req.query;

        var formattedEndDate = new Date(endDate);
        formattedEndDate.setHours(24);
        date = {
            date: { $gte: new Date(startDate), $lte: formattedEndDate }
        };

        let result = await Milling.find(date);
        console.log(result);

        res.status(200).send({
            code: 200,
            milling: result,
        });

    } catch (error) {
        return res.status(500).send(error);
    }
}



module.exports = MillingController;