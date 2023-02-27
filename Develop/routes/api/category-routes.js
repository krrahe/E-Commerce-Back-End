const router = require('express').Router();
const { Category, Product } = require('../../models');

// GET all categories with associated products
router.get('/', async (req, res) => {
  try {
    const categoryData = await Category.findAll({ include: Product });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET one category by id with associated products
router.get('/:id', async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id, { include: Product });
    if (!categoryData) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE a new category
router.post('/', async (req, res) => {
  try {
    const categoryData = await Category.create(req.body);
    res.status(201).json(categoryData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE a category by id
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Category.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    const updatedCategory = await Category.findByPk(req.params.id);
    res.status(200).json(updatedCategory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a category by id
router.delete('/:id', async (req, res) => {
  try {
    const deletedRows = await Category.destroy({
      where: { id: req.params.id }
    });
    if (!deletedRows) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;