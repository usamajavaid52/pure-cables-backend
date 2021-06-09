const FinanceController = {};
const Finance = require("../models/finance.model");
const Ledger = require("../models/ledger.model");

FinanceController.get = async(req, res) => {
    try {
        let finance = await Finance.find();
        res.send({ finance: finance }).status(200);
    } catch (error) {
        res.send({
            message: 'Error',
            detail: ex
        }).status(500);
    }
}

FinanceController.getStat = async(req, res) => {
    try {
        await Finance.aggregate(
            [{
                $group: {
                    _id: Date.now(),
                    totalCredit: { $sum: "$credit" },
                    totalDebit: { $sum: "$debit" },
                    count: { $sum: 1 }
                }
            }]
        ).exec((err, result) => {
            res.status(200).send({
                code: 200,
                stat: result
            })

        })
    } catch (error) {
        res.send({
            message: 'Error',
            detail: ex
        }).status(500);
    }
}

FinanceController.add = async(req, res) => {
    if (req.body.credit) {
        req.body.balance = req.body.total - req.body.credit;
    }
    if (req.body.debit) {
        req.body.balance = req.body.total - req.body.debit;
    }

    if (req.body.credit) {
        req.body["track"] = [{
            date: req.body.date,
            credit: req.body.credit,
            balance: req.body.balance
        }]
    }
    if (req.body.debit) {
        req.body["track"] = [{
            date: req.body.date,
            debit: req.body.debit,
            balance: req.body.balance
        }]
    }
    Finance.create(req.body, function(err, result) {
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

FinanceController.update = async(req, res) => {
    if (!req.params._id) {
        res.status(500).send({
            message: 'ID missing'
        });
    }
    try {

        if (req.body.credit) {
            req.body.balance = req.body.total - req.body.credit;
        }
        if (req.body.debit) {
            req.body.balance = req.body.total - req.body.debit;
        }

        if (req.body.ledgerId) {
            const ledgerUpdates = {
                credit: req.body.credit,
                debit: req.body.debit,
                balance: req.body.balance,

            }
            const result = await Ledger.updateOne({
                _id: req.body.ledgerId
            }, {
                $set: ledgerUpdates
            }, {
                upsert: false,
                runValidators: true
            });
        }
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
        const result = await Finance.updateOne({
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


FinanceController.delete = async(req, res) => {
    if (!req.params._id) {
        res.status(500).send({
            message: 'ID missing'
        });
    }
    try {
        const _id = req.params._id;

        const result = await Finance.findOneAndDelete({
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


FinanceController.deleteMultiple = async(req, res) => {
    try {
        const query = req.body.idArray;
        const result = await Finance.deleteMany({ _id: { $in: query } });
        res.status(200).send({
            code: 200,
            message: `${result.deletedCount} Deleted Successfully`,
        });
    } catch (error) {
        return res.status(500).send(error);
    }
};

FinanceController.searchByDate = async(req, res) => {
    try {

        let { startDate, endDate } = req.query;

        var formattedEndDate = new Date(endDate);
        formattedEndDate.setHours(24);
        date = {
            date: { $gte: new Date(startDate), $lte: formattedEndDate }
        };

        let result = await Finance.find(date);

        res.status(200).send({
            code: 200,
            finance: result,
        });

    } catch (error) {
        return res.status(500).send(error);
    }
}


module.exports = FinanceController;