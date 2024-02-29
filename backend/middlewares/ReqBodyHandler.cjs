const path = require("path");
const multer = require("multer");
global.__basedir = __dirname;

const excelFilter = (req, file, cb) => {
  if (
    file.mimetype.includes("excel") ||
    file.mimetype.includes("spreadsheetml")
  ) {
    cb(null, true);
  } else {
    cb("Please upload only excel file.", false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../assets/uploads/");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const formData = multer({ storage: storage, fileFilter: excelFilter });
module.exports = formData;