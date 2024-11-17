const User = require('../models/user.js')
const Recipe = require('../models/recipe.js')
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const isSignedIn = require('../middleware/is-signed-in.js')

// router.get('/', async (req, res) => {
//   res.render('home.ejs')
// })

router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs')
})

router.post('/sign-up', async (req, res) => {
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

router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in.ejs')
})

router.post('/sign-in', async (req, res) => {
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

    res.redirect('/recipes')
  } catch (err) {
    console.log(err)
    res.send('error')
  }
})

router.get('/sign-out', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({})

    res.render('auth/index.ejs', { users })
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

router.get('/users/:userId', async (req, res) => {
  try {
    const recipes = await Recipe.find({ owner: req.params.userId })

    res.render('recipes/index.ejs', { recipes })
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

module.exports = router
