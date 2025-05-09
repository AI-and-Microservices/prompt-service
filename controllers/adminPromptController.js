const Prompt = require('../models/Prompt');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');


exports.listPrompts = async (req, res) => {
  const { limit = 20, offset = 0, search = '', type, referenceType, referenceId, userId } = req.getAllParams();

  const query = {};
  if (search) query['$text'] = { $search: search };
  if (type) query.type = type;
  if (referenceType) query.referenceType = referenceType;
  if (referenceId) query.referenceId = referenceId;
  if (userId) query.userId = userId;

  const prompts = await Prompt.find(query)
    .skip(offset)
    .limit(limit)
    .sort({ updatedAt: -1 });

  res.success(prompts);
};

exports.getPrompt = async (req, res) => {
  const id = req.getParams('id', '');
  const prompt = await Prompt.findById(id);
  if (!prompt) throw new AppError('Prompt not found', 404, 'PROMPT_NOT_FOUND');
  res.success(prompt);
};

exports.createPrompt = async (req, res) => {
  const {
    name = '',
    key = '',
    type = '',
    referenceType = '',
    referenceId = '',
    content = '',
    isPublic = false,
    userId = null
  } = req.getAllParams();

  if (!name) throw new AppError('Prompt name is required', 400, 'MISSING_NAME');
  if (!type) throw new AppError('Prompt type is required', 400, 'MISSING_TYPE');
  if (!content) throw new AppError('Prompt content is required', 400, 'MISSING_CONTENT');

  const prompt = new Prompt({
    name,
    key,
    type,
    referenceType,
    referenceId,
    content,
    isPublic,
    userId
  });

  await prompt.save();
  logger.info('Admin created prompt', { id: prompt._id, type });

  res.success(prompt, 'Prompt created by admin', 201);
};

exports.updatePrompt = async (req, res) => {
  const id = req.getParams('id', '');
  const {
    name,
    key,
    type,
    referenceType,
    referenceId,
    content,
    isPublic,
    status
  } = req.getAllParams();

  const prompt = await Prompt.findById(id);
  if (!prompt) throw new AppError('Prompt not found', 404, 'PROMPT_NOT_FOUND');

  if (name) prompt.name = name;
  if (key) prompt.key = key;
  if (type) prompt.type = type;
  if (referenceType) prompt.referenceType = referenceType;
  if (referenceId) prompt.referenceId = referenceId;
  if (typeof isPublic === 'boolean') prompt.isPublic = isPublic;
  if (status) prompt.status = status;
  if (content) prompt.content = content;

  await prompt.save();
  logger.info('Admin updated prompt', { id: prompt._id });

  res.success(prompt, 'Prompt updated');
};

exports.deletePrompt = async (req, res) => {
  const id = req.getParams('id', '');
  const prompt = await Prompt.findByIdAndDelete(id);
  if (!prompt) throw new AppError('Prompt not found', 404, 'PROMPT_NOT_FOUND');
  logger.info('Admin deleted prompt', { id });
  res.success({ message: 'Prompt deleted' });
};
