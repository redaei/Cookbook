const express = require('express')
const router = express.Router()

const User = require('../models/user.js')
const Ingredient = require('../models/ingredient.js')
const Recipe = require('../models/recipe.js')

// router logic will go here - will be built later on in the lab
router.get('/', async (req, res) => {
  try {
    const ingredients = await Ingredient.find({})

    res.render('ingredients/index.ejs', { ingredients })
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

router.get('/new', async (req, res) => {
  res.render('ingredients/new.ejs')
})

router.post('/', async (req, res) => {
  try {
    const newIngredient = new Ingredient(req.body)
    await newIngredient.save()
    res.redirect('/ingredients')
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})
router.post('/add', async (req, res) => {
  try {
    const newIngredient = new Ingredient(req.body)
    await newIngredient.save()
    //res.redirect('/ingredients')
  } catch (error) {
    console.log(error)
    //res.redirect('/')
  }
})

router.get('/:ingredientId', async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.ingredientId)

    res.render('ingredients/show.ejs', { ingredient })
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

router.delete('/:ingredientId', async (req, res) => {
  try {
    let isUsed = false
    const recipes = await Recipe.find({ ingredients: { $exists: true } })

    const ingredient = await Ingredient.findById(req.params.ingredientId)

    recipes.forEach((recipe) => {
      if (recipe.ingredients.includes(req.params.ingredientId)) {
        isUsed = true
        return true
      }
    })

    if (isUsed) {
      let message =
        'This ingredient is already used in some recipes. You cannot delete it!!!'

      res.render('ingredients/show.ejs', { ingredient, message })
    } else {
      await ingredient.deleteOne()
      res.redirect('/ingredients')
    }
  } catch (error) {
    console.error(error)
    res.redirect('/')
  }
})

router.get('/:ingredientId/edit', async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.ingredientId)

    res.render('ingredients/edit.ejs', {
      ingredient
    })
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

router.put('/:ingredientId', async (req, res) => {
  try {
    const currentIngredient = await Ingredient.findById(req.params.ingredientId)

    await currentIngredient.updateOne(req.body)
    res.redirect('/ingredients')
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

module.exports = router
