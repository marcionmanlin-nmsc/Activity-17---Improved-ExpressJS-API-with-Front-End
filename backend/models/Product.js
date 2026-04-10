const pool = require('../config/db');

const Product = {
  async create({ name, description, price, image, user_id }) {
    const [result] = await pool.execute(
      'INSERT INTO products (name, description, price, image, user_id) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, image, user_id]
    );
    return result.insertId;
  },

  async findAll(user_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM products WHERE user_id = ? ORDER BY created_at DESC',
      [user_id]
    );
    return rows;
  },

  async findById(id, user_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM products WHERE id = ? AND user_id = ?',
      [id, user_id]
    );
    return rows[0] || null;
  },

  async update(id, user_id, { name, description, price, image }) {
    const fields = [];
    const values = [];
    if (name !== undefined) { fields.push('name = ?'); values.push(name); }
    if (description !== undefined) { fields.push('description = ?'); values.push(description); }
    if (price !== undefined) { fields.push('price = ?'); values.push(price); }
    if (image !== undefined) { fields.push('image = ?'); values.push(image); }
    if (fields.length === 0) return false;
    values.push(id, user_id);
    const [result] = await pool.execute(
      `UPDATE products SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
      values
    );
    return result.affectedRows > 0;
  },

  async delete(id, user_id) {
    const [result] = await pool.execute(
      'DELETE FROM products WHERE id = ? AND user_id = ?',
      [id, user_id]
    );
    return result.affectedRows > 0;
  },
};

module.exports = Product;
