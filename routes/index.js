var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

/* Handler function to wrap each route. - adapted from ADD IN ATTRIBUTION*/
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      next(error);
    }
  }
}

/* GET home page. */
router.get('/', asyncHandler(async (req, res) => {
  res.redirect('/books');
}));

/* GET full list of books. */
router.get('/books', asyncHandler(async (req,res) => {
  const books = await Book.findAll();
  res.render('index', { books, title: "Library" });
}));

/* GET create new book form. */
router.get('/books/new', (req, res) => {
  res.render('new-book', { book: {}, title: "New Book"});  
});

/* POST create new book. */
router.post('/', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books/" + book.id);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("new-book", { book, errors: error.errors, title: "New Book" })
    } else {
      throw error;
    }
  }
}));

/* GET book detail form. */
router.get('/books/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("update-book", { book, title: book.title });
  } else {
    res.sendStatus(404);
  }
}));

/* POST update book detail form. */
router.post('/books/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect('/books');
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("update-book", { book, errors: error.errors, title: book.title })
    } else {
      throw error;
    }
  }
}));

/* POST delete book listing. */
router.post('/books/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect('/books');
  } else {
    res.sendStatus(404);
  }
}));

module.exports = router;
