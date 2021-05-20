const ext = require('../../modules/mongoose-extender');
const mExtender = new ext();

const PharmacyProductsSchema = mExtender.Schema({

    ProductId: { type: String, required: true },
    Name: { type: String, required: true },
    Unit: { type: String, required: true },
    Taxing: String,
    BatchNumber: String,
    ManufacturedDate: { type: Date, required: true },
    ImportDate: { type: Date, required: true },
    ManufactureId: String,
    DrugCategoryId: String

}, { collection: "PharmacyProducts", versionKey: false });

module.exports = PharmacyProductsSchema;