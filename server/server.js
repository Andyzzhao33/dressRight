const express = require('express')
const app = express()

app.get("/api", (req, res) => {
    res.json({ message: ['Hello from server!', 'Wassup!'] })
})

app.listen(8000, () => { console.log('Server running on http://localhost:8000') })