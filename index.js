const express = require("express")
const cors = require("cors")
const bookRoute = require("./routes/book.routes")
const app= express();


// app.use(cors())
app.use(express.json());

app.use("/api/books",bookRoute);

const PORT=8080;

app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`);
});