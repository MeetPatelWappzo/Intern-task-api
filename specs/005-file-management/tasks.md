# Tasks: File Management Module

**Input**: Design documents from `/specs/005-file-management/`
**Prerequisites**: plan.md, spec.md, data-model.md

## Phase 1: Setup & Database

- [ ] T001 Create `src/models/file.model.js` defining the Mongoose schema (`public_id`, `secure_url`, `authId` referencing 'Auth').
- [ ] T002 Create skeleton route handler file in `src/routes/file.routes.js`.
- [ ] T003 Create skeleton controller file in `src/controllers/file.controller.js`.
- [ ] T004 Mount file management routes prefix under `/api/files` in `src/app.js`.

## Phase 2: Upload Logic

- [ ] T005 Implement `uploadFile` handler in `src/controllers/file.controller.js`. It must upload to Cloudinary, then `File.create()` a document saving the URLs and `req.user.id`.
- [ ] T006 Wire JWT `verifyToken` and Multer `upload.single('image')` middleware on `POST /upload` inside `src/routes/file.routes.js`. Add Swagger JSDoc.

## Phase 3: Deletion Logic

- [ ] T007 Implement a utility helper `deleteImage` invoking `cloudinary.uploader.destroy` in `src/services/cloudinary.service.js`.
- [ ] T008 Implement `deleteFile` controller in `src/controllers/file.controller.js`. It MUST extract `req.query.public_id`, find the file in MongoDB, verify `file.authId === req.user.id`, delete from Cloudinary, and delete from MongoDB.
- [ ] T009 Wire the `DELETE /delete` route protected by `verifyToken` middleware in `src/routes/file.routes.js`. Add Swagger JSDoc.
