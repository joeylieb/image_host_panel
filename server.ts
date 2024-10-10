import express from "express";
import path from "path";
import morgan from "morgan";
const app = express();

app.use(morgan(":method :url :status :response-time ms - :res[content-length]"));

app.use(express.static(path.join(__dirname, "build")))

app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(5000, () => {
    console.log("Server is running on port 5000.");
})
