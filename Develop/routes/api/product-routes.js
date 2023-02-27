const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// GET all products with associated category and tag data
router.get("/", async (req, res) => {
  try {
    const productData = await Product.findAll({
      include: [{ model: Category }, { model: Tag }],
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET one product by id with associated category and tag data
router.get("/:id", async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag }],
    });
    if (!productData) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE a new product with associated tags
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIds = req.body.tagIds.map((tag_id) => ({
        product_id: product.id,
        tag_id,
      }));
      await ProductTag.bulkCreate(productTagIds);
      const productData = await Product.findByPk(product.id, {
        include: [{ model: Category }, { model: Tag }],
      });
      res.status(201).json(productData);
    } else {
      const productData = await Product.findByPk(product.id, {
        include: [{ model: Category }, { model: Tag }],
      });
      res.status(201).json(productData);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE a product by id and associated tags
router.put("/:id", async (req, res) => {
  try {
    const [updated] = await Product.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    if (req.body.tagIds) {
      const productTagIds = req.body.tagIds.map((tag_id) => ({
        product_id: req.params.id,
        tag_id,
      }));
      await ProductTag.destroy({ where: { product_id: req.params.id } });
      await ProductTag.bulkCreate(productTagIds);
    }
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag }],
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a product by id
router.delete("/:id", async (req, res) => {
  try {
    const deletedRows = await Product.destroy({
      where: { id: req.params.id },
    });
    if (!deletedRows) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    await ProductTag.destroy({ where: { product_id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
