const express = require("express");
const { addTransection, getAllTransection,editTransection ,deleteTransection} = require("../controllers/transectionCtrl");

// Router object
const router = express.Router();

// Routes
router.post("/add-transection", addTransection);

router.post('/edit-transection', editTransection); // Changed GET to POST for consistency
router.post('/delete-transection', deleteTransection); // Changed GET to POST for consistency



router.post('/get-transection', getAllTransection); // Changed GET to POST for consistency

module.exports = router;
