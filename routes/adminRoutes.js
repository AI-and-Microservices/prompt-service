const express = require('express');
const controller = require('../controllers/adminPromptController');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');

router.post('/prompts/', wrapAsync(controller.createPrompt));
router.get('/prompts/', wrapAsync(controller.listPrompts));
router.get('/prompts/:id', wrapAsync(controller.getPrompt));
router.put('/prompts/:id', wrapAsync(controller.updatePrompt));
router.delete('/prompts/:id', wrapAsync(controller.deletePrompt));

module.exports = router;