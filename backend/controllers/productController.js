const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

exports.getAll = async (req, res) => {
  try {
    const products = await Product.findAll(req.user.id);
    res.json(products);
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getOne = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id, req.user.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json(product);
  } catch (err) {
    console.error('Get product error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required.' });
    }

    const image = req.file ? `/uploads/products/${req.file.filename}` : null;
    const id = await Product.create({
      name,
      description: description || '',
      price: parseFloat(price),
      image,
      user_id: req.user.id,
    });

    const product = await Product.findById(id, req.user.id);
    res.status(201).json({ message: 'Product created.', product });
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (price !== undefined) updates.price = parseFloat(price);

    if (req.file) {
      updates.image = `/uploads/products/${req.file.filename}`;

      // Delete old image
      const existing = await Product.findById(req.params.id, req.user.id);
      if (existing && existing.image) {
        const oldPath = path.join(__dirname, '..', existing.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    const updated = await Product.update(req.params.id, req.user.id, updates);
    if (!updated) return res.status(404).json({ message: 'Product not found.' });

    const product = await Product.findById(req.params.id, req.user.id);
    res.json({ message: 'Product updated.', product });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.remove = async (req, res) => {
  try {
    // Delete image file
    const existing = await Product.findById(req.params.id, req.user.id);
    if (existing && existing.image) {
      const imgPath = path.join(__dirname, '..', existing.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    const deleted = await Product.delete(req.params.id, req.user.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found.' });
    res.json({ message: 'Product deleted.' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};
