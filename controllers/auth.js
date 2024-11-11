const User = require('../models/user.js')

const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const isSignedIn = require('../middleware/is-signed-in.js')

router.get('/', async (req, res) => {
  res.render('index.ejs')
})

router.get('/auth/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs')
})

router.post('/auth/sign-up', async (req, res) => {
  const userInDB = await User.findOne({ username: req.body.username })

  if (userInDB) {
    return res.send('Username already taken!')
  }

  if (req.body.password !== req.body.confirmPassword) {
    return res.send('Password and Confirm Password must match')
  }
  const hashedPassword = bcrypt.hashSync(req.body.password, 10)
  req.body.password = hashedPassword

  const user = await User.create(req.body)
  res.send(`Thanks for signing up ${user.username}`)
})

router.get('/auth/sign-in', (req, res) => {
  res.render('auth/sign-in.ejs')
})

router.post('/auth/sign-in', async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username })
    if (!userInDatabase) {
      return res.send('Login failed . Please try again.')
    }

    const validPassword = bcrypt.compareSync(
      req.body.password,
      userInDatabase.password
    )
    if (!validPassword) {
      return res.send('Login failed. Please try again.')
    }

    req.session.user = {
      username: userInDatabase.username,
      _id: userInDatabase._id
    }

    res.redirect('/')
  } catch (err) {
    console.log(err)
    res.send('error')
  }
})

router.get('/auth/sign-out', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

router.get('/vip-lounge', isSignedIn, (req, res) => {
  res.send(`Welcome to the party ${req.session.user.username}.`)
})

module.exports = router
