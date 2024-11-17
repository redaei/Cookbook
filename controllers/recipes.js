const express = require('express')
const router = express.Router()

const User = require('../models/user.js')
const Recipe = require('../models/recipe.js')
const Ingredient = require('../models/ingredient.js')

// router logic will go here - will be built later on in the lab
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find({ owner: req.session.user._id })

    res.render('recipes/index.ejs', { recipes })
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

router.get('/new', async (req, res) => {
  const ingredients = await Ingredient.find({})
  res.render('recipes/new.ejs', { ingredients })
})

router.post('/', async (req, res) => {
  try {
    const newRecipe = new Recipe(req.body)
    newRecipe.owner = req.session.user._id
    await newRecipe.save()
    res.redirect('/recipes')
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

router.get('/:recipeId', async (req, res) => {
  try {
    const populatedRecipe = await Recipe.findById(req.params.recipeId)
      .populate('owner')
      .populate('ingredients')

    res.render('recipes/show.ejs', { recipe: populatedRecipe })
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

router.delete('/:recipeId', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId)
    if (recipe.owner.equals(req.session.user._id)) {
      await recipe.deleteOne()
      res.redirect('/recipes')
    } else {
      res.send("You don't have permission to do that.")
    }
  } catch (error) {
    console.error(error)
    res.redirect('/')
  }
})

router.get('/:recipeId/edit', async (req, res) => {
  try {
    const ingredients = await Ingredient.find({})
    const populatedRecipe = await Recipe.findById(req.params.recipeId).populate(
      'owner'
    )

    res.render('recipes/edit.ejs', {
      recipe: populatedRecipe,
      ingredients
    })
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

router.put('/:recipeId', async (req, res) => {
  try {
    const currentRecipe = await Recipe.findById(req.params.recipeId)
    if (currentRecipe.owner.equals(req.session.user._id)) {
      await currentRecipe.updateOne(req.body)
      res.redirect('/recipes')
    } else {
      res.send("You don't have permission to do that.")
    }
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

module.exports = router
