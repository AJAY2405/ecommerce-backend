// import multer from "multer"

// const storage=multer.memoryStorage();
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("photo/")) {
//     console.log("File data = ",file)

//     cb(null, true); // accept file
//   } else {
//     cb(new Error("Only image files are allowed!"), false);
//   }
// };


// export const singleUpload=multer({storage}).single("file")

// middlewares/uploadPhoto.js
import multer from "multer";

const storage = multer.memoryStorage();     

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
  console.log("FILE = ",file)

    return cb(null, true);
  } 
  cb(new Error("Only image files are allowed!"));
};

export const singleUpload = multer({ storage, fileFilter }).single("photo");
