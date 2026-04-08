import Document from '../models/Document.js';
import fs from 'fs';

export const getDocuments = async (req, res) => {
  try {
    const docs = await Document.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const doc = await Document.create({
      userId: req.user.id,
      name: req.file.originalname,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      folder: req.body.folder || 'General',
      path: req.file.path
    });
    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    if (fs.existsSync(doc.path)) fs.unlinkSync(doc.path);
    await doc.destroy();
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const downloadDocument = async (req, res) => {
  try {
    const doc = await Document.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    if (!fs.existsSync(doc.path)) {
      return res.status(404).json({ message: 'File not found on server' });
    }
    res.download(doc.path, doc.name);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};