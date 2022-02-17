const express = require ('express');    
const router = express.Router();

const operationCtrl = require ('../controllers/operation.controller');

// Routes predefinidas

router.get('/units/', () => {console.log('---------- UNITS')})
router.get('/', operationCtrl.getOperations)
router.get('/:id', operationCtrl.getOperation)
router.put('/:id', operationCtrl.updateOperation)
router.delete('/:id', operationCtrl.deleteOperation)
router.post('/', operationCtrl.createOperation)



// exportamos las rutas
module.exports = router;
