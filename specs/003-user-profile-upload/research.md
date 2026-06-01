# Technical Research: Profile Image Upload & Verification

## Decision: Multer Storage Strategy
- **Chosen Option**: Memory Storage (`multer.memoryStorage()`)
- **Rationale**: Since the uploaded images are immediately streamed to Cloudinary, there is no need to write them to the local disk space. This avoids clean-up issues, disk permission complexities, and local storage size exhaustion.
- **Alternatives Considered**: Disk Storage (`multer.diskStorage()`). Rejected due to unnecessary temporary I/O overhead on short-lived API server containers.

## Decision: Cloudinary Buffer Streaming
- **Chosen Option**: `cloudinary.v2.uploader.upload_stream`
- **Rationale**: By using Cloudinary's streaming upload, the program can pipe the memory buffer directly to the Cloudinary API. Wrapping this in a Promise makes it highly compatible with modern async/await patterns.
- **Example Implementation Pattern**:
  ```javascript
  const cloudinary = require('cloudinary').v2;
  const streamifier = require('streamifier'); // Or standard stream.Readable
  
  const uploadImageBuffer = (fileBuffer) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'profile_pictures' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(fileBuffer);
    });
  };
  ```

## Decision: Mocks for Testing Environments
- **Chosen Option**: Full Service-Level Mocks.
- **Rationale**: Mocks ensure tests run offline, remain fully independent of external platform uptimes, and avoid consumption of production rate-limits or remote space.
