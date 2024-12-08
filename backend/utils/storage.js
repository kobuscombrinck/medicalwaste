const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

// Local storage implementation
const uploadDir = path.join(__dirname, '../uploads');

// Ensure upload directory exists
const initStorage = async () => {
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (error) {
    console.error('Error creating upload directory:', error);
  }
};

// Initialize storage on startup
initStorage();

const uploadToStorage = async (file) => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    const fileName = `${uuidv4()}-${file.originalname}`;
    const filePath = path.join(uploadDir, fileName);

    // Write file to local storage
    await fs.writeFile(filePath, file.buffer);

    // Return the file path relative to the upload directory
    return `/uploads/${fileName}`;
  } catch (error) {
    throw new Error(`Error uploading file: ${error.message}`);
  }
};

const deleteFromStorage = async (fileUrl) => {
  try {
    if (!fileUrl) {
      throw new Error('No file URL provided');
    }

    // Extract filename from URL
    const fileName = fileUrl.split('/').pop();
    const filePath = path.join(uploadDir, fileName);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      throw new Error('File not found in storage');
    }

    // Delete the file
    await fs.unlink(filePath);
  } catch (error) {
    throw new Error(`Error deleting file: ${error.message}`);
  }
};

module.exports = {
  uploadToStorage,
  deleteFromStorage,
  uploadDir // Export for use in express static middleware
};
