import express from "express";
import cors from "cors";
import 'dotenv/config';
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use("/api", chatRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Database connection error:", error);
    }
}

// Route ko 'async' banaya taaki fetch ka wait kar sake
// app.post("/test", async (req, res) => {
//     const options = {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
//         },
//         body: JSON.stringify({
//             model: "gemini-1.5-pro",
//             messages: [{
//                 role: "user",
//                 content: req.body.message
//             }]
//         })
//     };

//     try {
//         const response = await fetch("https://generativelanguage.googleapis.com/v1beta2/models/gemini-1.5-pro:generateContent?key=${process.env.OPENAI_API_KEY}", options);
//         const data = await response.json();
//         // console.log(data.choices[0].message.content);
//         res.send(data.choices[0].message.content);
//     }
//     catch (error) {
//         console.log("Error Details:", error);
//     }
// });


// app.listen(PORT, async () => {
//     console.log(`Server is running on port ${PORT}`);
//     await connectDB(); // Server start hote hi DB connect hoga
// });
