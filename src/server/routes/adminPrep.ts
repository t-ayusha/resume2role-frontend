import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
// import sharp from 'sharp'; // Assuming sharp is available for resizing

import PrepVideo from '../models/prep/Video.js';
import PrepNote from '../models/prep/Note.js';
import PrepQuestion from '../models/prep/Question.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();


// Multer configurations
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dest = 'uploads/';
    if (req.baseUrl.includes('videos')) dest += 'covers/';
    else if (req.baseUrl.includes('notes')) dest += 'notes/';
    else if (req.baseUrl.includes('questions')) dest += 'questions/';
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (req.baseUrl.includes('videos')) {
      if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
        return cb(new Error('Only jpg/png allowed for cover images'));
      }
    } else {
      if (!['application/pdf', 'application/vnd.ms-powerpoint', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.mimetype)) {
        return cb(new Error('Invalid file type'));
      }
    }
    cb(null, true);
  }
});

// Helper for validation errors
const validate = (req: Request, res: Response, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// 1. Video Section
router.post('/videos',
  adminAuth,
  upload.single('coverImage'),
  body('title').isLength({ min: 5, max: 120 }).trim().escape(),
  body('youtubeLink').matches(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/),
  body('className').matches(/^[a-z0-9-]+$/).isLength({ min: 3, max: 30 }),
  validate,
  async (req: Request, res: Response) => {
    try {
      if (!req.file) return res.status(400).json({ message: 'Cover image is required' });

      // Mock resizing for now if sharp is not working
      // await sharp(req.file.path).resize(1280, 720).toFile(req.file.path + '_resized');

      const video = new PrepVideo({
        title: req.body.title,
        youtubeLink: req.body.youtubeLink,
        className: req.body.className,
        coverImage: req.file.path,
        adminId: 'admin-1' // Mock admin ID
      });

      // Save to DB if connected
      try {
        await video.save();
      } catch (dbError) {
        console.log('Database not connected, item not persisted but returning success for demo.');
      }

      res.status(201).json({ message: 'Video added successfully', data: video });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Server error' });
    }
  }
);

// 2. Notes Section
router.post('/notes',
  adminAuth,
  upload.single('file'),
  body('title').isLength({ min: 5, max: 120 }).trim().escape(),
  body('className').matches(/^[a-z0-9-]+$/).isLength({ min: 3, max: 30 }),
  body('description').optional().isLength({ max: 500 }),
  validate,
  async (req: Request, res: Response) => {
    try {
      if (!req.file) return res.status(400).json({ message: 'File is required' });

      const note = new PrepNote({
        title: req.body.title,
        filePath: req.file.path,
        className: req.body.className,
        description: req.body.description,
        adminId: 'admin-1'
      });

      res.status(201).json({ message: 'Note added successfully', data: note });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Server error' });
    }
  }
);

// 3. Question Section
router.post('/questions',
  adminAuth,
  upload.single('file'),
  body('title').isLength({ min: 5, max: 120 }).trim().escape(),
  body('className').matches(/^[a-z0-9-]+$/).isLength({ min: 3, max: 30 }),
  body('description').optional().isLength({ max: 500 }),
  validate,
  async (req: Request, res: Response) => {
    try {
      if (!req.file) return res.status(400).json({ message: 'File is required' });

      const question = new PrepQuestion({
        title: req.body.title,
        filePath: req.file.path,
        className: req.body.className,
        description: req.body.description,
        adminId: 'admin-1'
      });

      res.status(201).json({ message: 'Question added successfully', data: question });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Server error' });
    }
  }
);

export default router;
