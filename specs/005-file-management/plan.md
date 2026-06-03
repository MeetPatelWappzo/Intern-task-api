# Implementation Plan: File Management Module

**Branch**: `005-file-management` | **Date**: 2026-06-03
**Input**: Feature specification from `/specs/005-file-management/spec.md`

## Summary

Create a dedicated and secure File Management module using Express.js, Multer, Cloudinary, and MongoDB. 
The API will expose a JWT-protected `POST /api/files/upload` endpoint for single image uploads (saving a tracking record to MongoDB) and a `DELETE /api/files/delete` endpoint to destroy assets. The deletion process MUST verify ownership against the database before calling Cloudinary.

## Technical Context

**Language/Version**: Node.js v20.x  
**Primary Dependencies**: Express.js, Mongoose, Multer, Cloudinary, jsonwebtoken, dotenv, swagger-ui-express, swagger-jsdoc  
**Storage**: MongoDB (Mongoose ODM) & Cloudinary Storage  
**Target Platform**: Node.js v20.x runtime  
**Constraints**: Enforce 2MB size limit in Multer; restrict uploads to image/jpeg and image/png; strict JWT ownership validation for deletions.

## Project Structure

```text
src/
├── models/
│   └── file.model.js          # NEW: Mongoose schema for tracking file ownership
├── controllers/
│   └── file.controller.js     # NEW: handles file upload & deletion logic
├── routes/
│   └── file.routes.js         # NEW: file endpoints definition & Swagger comments
├── middleware/
│   ├── auth.middleware.js     # EXISTING: token verification
│   └── upload.middleware.js   # EXISTING: Multer configuration
├── services/
│   └── cloudinary.service.js  # EXISTING: Cloudinary upload buffer helper
└── app.js                     # MODIFY: mount new file routes at /api/files
```
