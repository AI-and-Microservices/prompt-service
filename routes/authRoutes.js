const express = require('express');
const cacheMiddleware = require('../middlewares/cacheMiddleware')
const promptController = require('../controllers/promptController');

const router = express.Router();

router.post('/prompts/', promptController.createPrompt);
router.get('/prompts/', cacheMiddleware((req) => `prompts:${req.user._id}`), promptController.listPrompts);
router.get('/prompts/:id', cacheMiddleware((req) => `promptId:${req.params.id}:${req.user._id}`), promptController.getPrompt);
router.put('/prompts/:id', cacheMiddleware((req) => `promptId:${req.params.id}:${req.user._id}`), promptController.updatePrompt);
router.delete('/prompts/:id', cacheMiddleware((req) => `promptId:${req.params.id}:${req.user._id}`), promptController.deletePrompt);

module.exports = router;