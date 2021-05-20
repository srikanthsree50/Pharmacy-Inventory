const baseSchema = {
    _id: {type: String, required: true, max: 36},
    Tags: [String],
    CreatedBy: {type: String, required: true, max: 36},
    CreatedDate: {type: Date, required: true},
    Language: {type: String, required: true},
    LastUpdatedBy: {type: String, required: true, max: 36},
    LastUpdatedDate: {type: Date, required: true},
    RolesAllowedToRead: {type: [String],  required: true, max: 36},
    RolesAllowedToWrite: {type: [String],  required: true, max: 36},
    RolesAllowedToUpdate: {type: [String],  required: true,  max: 36},
    RolesAllowedToDelete: {type: [String], default: []},
    IdsAllowedToRead: {type: [String], max: 36, required: true,},
    IdsAllowedToWrite: {type: [String], max: 36, required: true,},
    IdsAllowedToUpdate: {type: [String], max: 36, required: true},
    IdsAllowedToDelete: {type: [String], max: 36, default: []},
};

const options = {
    versionKey: false
};

module.exports = function (Schema) {
    let schema = new Schema(baseSchema, options);
    schema.set('toJSON', {
        transform: function (doc, ret, options) {
            if(ret._id){
                ret.ItemId = ret._id;
                delete ret._id;
            }
        }
    });
    return schema;
};