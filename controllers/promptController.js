const Prompt = require('../models/Prompt');
const kafkaService = require('../services/kafkaService');
const logger = require('../utils/logger');
const crossServerRequest = require('../utils/crossServiceRequest');

exports.createPrompt = async (req, res) => {
    try {
        const userId = req.user._id;
        const name = req.getParams('name', '');
        const type = req.getParams('type', '');
        const referenceId = req.getParams('referenceId', '');
        const referenceType = req.getParams('referenceType', '');
        const key = req.getParams('key', '');
        const content = req.getParams('content', '');
        const isPublic = req.getParams('isPublic', false);
    
        if (!name) return res.error('Prompt name is required', 400);
        if (!type) return res.error('Prompt type is required', 400);
        if (!content) return res.error('Prompt content is required', 400);
    
        const prompt = new Prompt({
          name,
          type,
          referenceId,
          referenceType,
          key,
          content,
          isPublic,
          userId
        });
    
        await prompt.save();
        logger.info('Prompt created', { prompt });
    
        return res.success(prompt, 'Prompt created successfully', 201);
      } catch (error) {
        return res.error(error, 400);
      }
    
};

exports.listPrompts = async (req, res) => {
    const userId = req.user._id;
    const limit = req.getParams('limit', 20);
    const offset = req.getParams('offset', 0);
    const search = req.getParams('search', '');
    const type = req.getParams('type', '');
    const referenceType = req.getParams('referenceType', '');
    const referenceId = req.getParams('referenceId', '');
  
    const query = { userId };
  
    if (search) {
      query['$text'] = { $search: search };
    }
    if (type) query.type = type;
    if (referenceType) query.referenceType = referenceType;
    if (referenceId) query.referenceId = referenceId;
  
    const prompts = await Prompt.find(query)
      .skip(offset)
      .limit(limit)
      .sort({ updatedAt: -1 });
  
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

exports.adminListPrompts = async (req, res) => {
    const isAdmin = req.user.roles?.includes('admin');
    if (!isAdmin) return res.error('Unauthorized', 403);
  
    const search = req.getParams('search', '');
    const type = req.getParams('type', '');
    const referenceId = req.getParams('referenceId', '');
    const userId = req.getParams('userId', '');
    const limit = req.getParams('limit', 20);
    const offset = req.getParams('offset', 0);
  
    const query = { current: true };
  
    if (search) query['$text'] = { $search: search };
    if (type) query.type = type;
    if (referenceId) query.referenceId = referenceId;
    if (userId) query.userId = userId;
  
    const prompts = await Prompt.find(query).skip(offset).limit(limit).sort({ updatedAt: -1 });
  
    res.success(prompts);
  };
  