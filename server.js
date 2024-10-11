const path = require("path");
const morgan = require("morgan");
const express = require("express");
const app = express();

app.use(morgan("tiny"));
app.use(require('prerender-node').set('prerenderToken', 'EPH7xmEFqEgXazQV3Djz'));
app.use(express.static(path.join(__dirname, "build")))

app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(5000, () => {
    console.log("Server is running on port 5000.");
})
