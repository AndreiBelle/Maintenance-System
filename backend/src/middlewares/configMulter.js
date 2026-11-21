const multer = require("multer");

const uploadEquipmentPhoto = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = { uploadEquipmentPhoto };