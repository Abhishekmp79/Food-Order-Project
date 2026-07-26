//connect Node.js with Cloudinary
//cloudinary is a cloud-based image and video management service 
//that provides a comprehensive solution for uploading, storing, manipulating media files.
//It allows developers to easily integrate media management capabilities into their applications
// without having to worry about the underlying infrastructure.

const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
console.log("Cloudinary keys loaded?", {
    cloud: process.env.CLOUDINARY_CLOUD_NAME ? "✓ SET" : "✗ MISSING",
    key: process.env.CLOUDINARY_API_KEY ? "✓ SET" : "✗ MISSING",
    secret: process.env.CLOUDINARY_API_SECRET ? "✓ SET" : "✗ MISSING",
});