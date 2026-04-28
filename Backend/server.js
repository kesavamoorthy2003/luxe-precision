const app = require('./src/app')
const prisma = require('./src/config/db'); // Path correct-ah paarunga

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Luxe Precision Server running on port ${PORT}`)
})