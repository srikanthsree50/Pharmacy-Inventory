const ext = require('../../modules/mongoose-extender');
const mExtender = new ext();

const PharmacyInventorySchema = mExtender.Schema({

    ProductId: { type: String, required: true },
    Price : { type: String, required: true },
    Stock: 'Number',
    Sold: 'Number'
}, { collection: "PharmacyInventory", versionKey: false });

module.exports = PharmacyInventorySchema;