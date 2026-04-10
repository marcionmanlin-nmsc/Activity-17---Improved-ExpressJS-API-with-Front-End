const pool = require('../config/db');

const User = {
  async create({ name, email, password, verification_token }) {
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, verification_token) VALUES (?, ?, ?, ?)',
      [name, email, password, verification_token]
    );
    return result.insertId;
  },

  async findByEmail(email) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, name, email, profile_picture, is_verified, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async findByVerificationToken(token) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE verification_token = ?', [token]);
    return rows[0] || null;
  },

  async verify(id) {
    await pool.execute(
      'UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = ?',
      [id]
    );
  },

  async findByResetToken(token) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()',
      [token]
    );
    return rows[0] || null;
  },

  async setResetToken(id, token, expires) {
    await pool.execute(
      'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
      [token, expires, id]
    );
  },

  async updatePassword(id, password) {
    await pool.execute(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
      [password, id]
    );
  },

  async updateProfile(id, { name, profile_picture }) {
    const fields = [];
    const values = [];
    if (name !== undefined) { fields.push('name = ?'); values.push(name); }
    if (profile_picture !== undefined) { fields.push('profile_picture = ?'); values.push(profile_picture); }
    if (fields.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
  },
};

module.exports = User;
