require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const authRoutes = require("./routes/authRoutes")
const assignmentRoutes = require("./routes/assignmentRoutes")
const submissionRoutes = require("./routes/submissionRoutes")
const adminRoutes = require("./routes/adminRoutes")

const app = express()


// midelware
app.use(cors())
app.use(express.json())

// for uploads folder
app.use("/uploads", express.static("uploads"))


// DB 
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
 console.log("MongoDB Connected")
})
.catch((err)=>{
 console.log("MongoDB Error:",err)
})


// ROUTES
app.use("/api/auth", authRoutes)

app.use("/api/assignments", assignmentRoutes)

app.use("/api/submissions", submissionRoutes)

app.use("/api/admin", adminRoutes)

app.use("/uploads", express.static("uploads"))
// TEST ROUTE
app.get("/",(req,res)=>{
 res.send("Assignment Submission API Running")
})


// SERVER
const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
 console.log(`Server running on port ${PORT}`)
})