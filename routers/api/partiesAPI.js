const express = require('express');
const PartiesHandler = require('../../handlers/partiesHandler');


router = express.Router();



router.route('/:party')
        .get(PartiesHandler.getEntity);


router.route('/manage')
        .post(PartiesHandler.createEntity)// add a new party
        .put(PartiesHandler.updateEntity) // Update an existing party
        .delete(PartiesHandler.deleteEntity); // Delete an existing party
/*router.route('/:party')
    .get(usersHandler.userInfo);

router.route('/manage')
    .post(usersHandler.createUser)// add a new party
    .put(usersHandler.updateUser) // Update an existing party
    .delete(usersHandler.deleteUser); // Delete an existing party*/


//maybe adding a chat