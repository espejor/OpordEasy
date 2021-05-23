const express = require ('express');    
const router = express.Router();

const operationCtrl = require ('../controllers/operation.controller');

// Routes predefinidas

router.get('/', operationCtrl.getOperations)
router.get('/:id', operationCtrl.getOperation)
router.put('/:id', operationCtrl.updateOperation)
router.delete('/:id', operationCtrl.deleteOperation)
router.post('/', operationCtrl.createOperation)
router.get('/Units', () => {console.log('---------- UNITS')})



// exportamos las rutas
module.exports = router;
