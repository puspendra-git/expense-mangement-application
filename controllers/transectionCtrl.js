const transectionModel = require('../models/transectionModel');
const moment = require('moment');

const getAllTransection = async (req, res) => {
    try {
        const { frequency, selectedDate, type } = req.body;
        
        // Build the filter object
        const transections = await transectionModel.find({
            ...(frequency !== 'custom' 
                ? { date: { $gt: moment().subtract(Number(frequency), 'd').toDate() } }
                : { date: { $gte: selectedDate[0], $lte: selectedDate[1] } }),
            userid: req.body.userid,
            ...(type !== 'all' && { type }) // Handle type filter, pass all when no filter applied
        });

        res.status(200).json(transections);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch transections', error });
    }
};


const deleteTransection =async (req,res) =>{
    try {
        await transectionModel.findOneAndDelete({ _id: req.body.transacationId }); // Use _id to match the transaction ID
        res.status(200).send("Transaction Deleted!");
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Failed to delete transaction', error });
    }
    
}



const editTransection =async (req,res) =>{
     try {
        await transectionModel.findOneAndUpdate({_id:req.body.transacationId}, req.body.payload);
        res.status(200).send('Edit Successfully');
     } catch (error) {
        console.log(error)
        res.status(500).json(error)
     }
}
const addTransection = async (req, res) => {
    try {
        const newTransection = new transectionModel(req.body);
        await newTransection.save();
        res.status(201).json({ success: true, message: 'Transection Created', transection: newTransection });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to create transection', error });
    }
};

module.exports = { getAllTransection, addTransection , editTransection ,deleteTransection};
