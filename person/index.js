const PersonSchema = require('./core/schema');
const PersonController = require('./core/controller');

const initController = function(app){
    PersonController(app);
};

module.exports = function (app) {

    if(app){
        initController(app);
    }

    return {
        PersonSchema: PersonSchema,
        createUserPerson: PersonController().createPerson,

    };
};