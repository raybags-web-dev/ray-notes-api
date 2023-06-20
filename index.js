const express = require('express')
const methodOverride = require('method-override')
const app = express('')
const NoteModel = require('./models/noteModel')
const handleErrors = require('./middleware/async')
require('colors')

const notesRouter = require('./routes/notes')
// database handler
const connectDB = require('./db/connect')
require('dotenv').config()
const { MONGO_URI } = process.env
// set view engine
// app.use(express.json());
app.set('view engine', 'ejs')
// router setup
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

app.get(
  '/',
  handleErrors(async (req, res) => {
    const notes = await NoteModel.find().sort({ createdAt: 'desc' })
    res.render('notes/index', { notes })
  })
)

app.use('/notes', notesRouter)
// handle db connection
const runConnection = async () => {
  try {
    console.log(
      '\n=============================================================='
    )
    console.log('INITIALIZING CONNECTION TO SERVER...'.brightBlue)
    await connectDB(MONGO_URI)
    console.log(
      `${'******'.brightGreen} CONNECTED TO DATABASE ${'******'.brightGreen}`
    )
    const PORT = process.env.PORT || 6001
    app.listen(PORT, () =>
      console.log(`========= LISTENING ON PORT ${PORT} ==========`.brightBlue)
    )
  } catch (e) {
    console.error(e.message)
  }
}
runConnection()
