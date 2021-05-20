const ext = require('../../modules/mongoose-extender');
const mExtender = new ext();

const DrugCategoriesSchema = mExtender.Schema({
    CategoryName: { type: String, required: true },
   
}, { collection: "DrugCategories", versionKey: false });

module.exports = DrugCategoriesSchema;