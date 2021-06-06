const LedgerController = {};
const Assets = require("../models/ledger.model");
const Finance = require("../models/finance.model");

LedgerController.getAssets = async(req, res) => {
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

LedgerController.addAsset = async(req, res) => {

    if (req.body.credit) {
        req.body.balance = req.body.totalPrice - req.body.credit;
    }
    if (req.body.debit) {
        req.body.balance = req.body.totalPrice - req.body.debit;
    }
    if (!req.body.credit && !req.body.debit) {
        req.body.balance = req.body.totalPrice;
    }
    if (req.body.bardanaWeight) {
        req.body.saafi = req.body.weight - req.body.bardanaWeight;
    }
    Assets.create(req.body, async function(err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            var financeData = {
                date: result.date,
                debit: result.debit,
                credit: result.credit,
                ledgerType: result.ledgerType,
                ledgerId: result._id,
                billNumber: result.billNumber,
                detail: result.partyName,
                balance: result.balance,
                total: result.totalPrice

            }
            if (result.credit) {
                financeData["track"] = [{
                    date: result.date,
                    credit: result.credit,
                    balance: result.balance
                }]
            }
            if (result.debit) {
                financeData["track"] = [{
                    date: result.date,
                    debit: result.debit,
                    balance: result.balance
                }]
            }
            const finace = new Finance(financeData);
            const financeResult = await finace.save();
            var data = {
                code: 200,
                message: 'Data inserted successfully',
                data: result
            };
            res.status(200).send(data);
        }
    });
}

LedgerController.updateAsset = async(req, res) => {
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


LedgerController.deleteAsset = async(req, res) => {
    if (!req.params._id) {
        res.status(500).send({
            message: 'ID missing'
        });
    }
    try {
        const _id = req.params._id;

        const result = await Assets.findOneAndDelete({
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


LedgerController.deleteMultipleAssets = async(req, res) => {
    try {
        const query = req.body.idArray;
        const result = await Assets.deleteMany({ _id: { $in: query } });
        res.status(200).send({
            code: 200,
            message: `${result.deletedCount} Assets Deleted Successfully`,
        });
    } catch (error) {
        return res.status(500).send(error);
    }
};


LedgerController.searchByDate = async(req, res) => {
    try {

        let { startDate, endDate } = req.query;

        var formattedEndDate = new Date(endDate);
        formattedEndDate.setHours(24);
        date = {
            date: { $gte: new Date(startDate), $lte: formattedEndDate }
        };

        let result = await Assets.find(date);
        console.log(result);

        res.status(200).send({
            code: 200,
            assets: result,
        });

    } catch (error) {
        return res.status(500).send(error);
    }
}


module.exports = LedgerController;