const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "config/config.env") });

const connectDatabase = require("./config/database");
const User = require("./models/user");

const [email, newPassword] = process.argv.slice(2);

async function run() {
    if (!email || !newPassword) {
        console.log("Usage: node resetPassword.js <email> <newPassword>");
        console.log("Example: node resetPassword.js abhishek@gmail.com MyPass123");
        process.exit(1);
    }

    await connectDatabase();

    const user = await User.findOne({ email: String(email).trim().toLowerCase() });
    if (!user) {
        console.log("No user found with email: " + email);
        process.exit(1);
    }

    user.password = newPassword;
    user.passwordConfirm = newPassword;
    await user.save(); // bcrypt pre-save hook hashes it automatically

    console.log("Password reset successfully!");
    console.log("Email:    " + user.email);
    console.log("Password: " + newPassword);
    process.exit(0);
}

run().catch((err) => {
    console.error("Error:", err.message);
    process.exit(1);
});