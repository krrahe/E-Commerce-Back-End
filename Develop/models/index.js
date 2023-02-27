const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product, through: ProductTag, as: 'products' }]
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag, as: 'products' }]
    });
    if (!tagData) {
      res.status(404).json({ message: 'Tag not found!' });
    } else {
      res.status(200).json(tagData);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const tagData = await Tag.create(req.body);
    res.status(201).json(tagData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const [rowsUpdated] = await Tag.update(req.body, {
      where: { id: req.params.id }
    });
    if (rowsUpdated === 0) {
      res.status(404).json({ message: 'Tag not found!' });
    } else {
      res.status(200).json({ message: 'Tag updated successfully!' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const rowsDeleted = await Tag.destroy({
      where: { id: req.params.id }
    });
    if (rowsDeleted === 0) {
      res.status(404).json({ message: 'Tag not found!' });
    } else {
      res.status(200).json({ message: 'Tag deleted successfully!' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;