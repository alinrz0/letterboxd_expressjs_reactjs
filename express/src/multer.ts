import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "src/images/"); // Set the folder to store uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Use a unique name for the uploaded file
    },
});

// Create the upload instance
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 *1024}, // 10MB file size limit
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only image files are allowed"));
        }
        cb(null, true);
    },
});


export { upload };