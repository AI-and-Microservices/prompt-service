const Prompt = require('../models/Prompt');
const kafkaService = require('../services/kafkaService');
const logger = require('../utils/logger');
const crossServerRequest = require('../utils/crossServiceRequest');

exports.createPrompt = async (req, res) => {
  try {
    const userId = req.user._id
    const name = req.getParams('name', '');
    const type = req.getParams('type', '');
    const referenceId = req.getParams('referenceId', '');
    const content = req.getParams('content', '');

    if (!name) return res.error('prompt Name is required', 400);
    if (!type) return res.error('prompt type is required', 400);
    if (!content) return res.error('prompt content is required', 400);

    const prompt = new Prompt({ name, type, userId, referenceId, content });
    await prompt.save();
    logger.info('Prompt created', { prompt })

    kafkaService.sendMessage('PROMPT_CREATED', prompt);
    return res.success(prompt, 'Prompt created successfully', 201);
  } catch (error) {
    return res.error(error, 400);
  }
};

exports.listPrompts = async (req, res) => {
  const limit = req.getParams('limit', 20);
  const offset = req.getParams('offset', 0);
  const search = req.getParams('search', '');
  const userId = req.user._id
  const query = {userId}
  if (search) {
    query['$text'] = { $search: search } 
  }

  const prompts = await Prompt.find(query).skip(offset).limit(limit).sort({ _id: -1 });
  res.success(prompts);
};

exports.getPrompt = async (req, res) => {
  const userId = req.user._id
  const name = req.getParams('name', '')
  const prompt = await Prompt.findOne({name, userId});
  if (!prompt) return res.error('Prompt not found', 404);
  res.success(prompt);
};

exports.updatePrompt = async (req, res) => {
  const userId = req.user._id
  const name = req.getParams('name', '');
  const content = req.getParams('content', '');
  const type = req.getParams('type', '');
  const referenceId = req.getParams('referenceId', '');
  const promptId = req.getParams('id', '')

  const query = {userId}
  if (promptId) query._id = promptId
  if (name) query.name = name
  if (referenceId) query.referenceId = referenceId

  const prompt = await Prompt.findOne(query);
  if (!prompt) return res.error('Prompt not found', 404);
  
  if (name) {
    prompt.name = name
  }
  if (content) {
    prompt.content = content
  }
  
  await prompt.save()

  res.success(prompt);
};

exports.deletePrompt = async (req, res) => {
  const prompt = await Prompt.findByIdAndDelete(req.getParams('id', ''));
  if (!prompt) return res.error('Prompt not found', 404);
  res.success({ message: 'Prompt deleted' });
};
