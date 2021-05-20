const ext = require('../../modules/mongoose-extender');
const mExtender = new ext();

const AvailableDaysSchema = mExtender.Schema({
    UserId: {type: String},
    Saturday: {type: Boolean},
    Sunday: {type: Boolean},
    Monday: {type: Boolean},
    Tuesday: {type: Boolean},
    Wednesday: {type: Boolean},
    Thursday: {type: Boolean},
    Friday: {type: Boolean},
    SaturdayFrom: {type: String},
    SaturdayTo: {type: String},
    SundayFrom: {type: String},
    SundayTo: {type: String},
    MondayFrom: {type: String},
    MondayTo: {type: String},
    TuesdayFrom: {type: String},
    TuesdayTo: {type: String},
    WednesdayFrom: {type: String},
    WednesdayTo: {type: String},
    ThursdayFrom: {type: String},
    ThursdayTo: {type: String},
    FridayFrom: {type: String},
    FridayTo: {type: String},
}, { collection: "AvailableDays", versionKey: false });

module.exports = AvailableDaysSchema;