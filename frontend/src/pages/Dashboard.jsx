import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/api';
import Navbar from '../components/Navbar';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiImage } from 'react-icons/fi';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'https://ejs.makoyot.xyz';

function ProductModal({ product, onClose, onSaved }) {
  const [form, setForm] = useState({ name: '', description: '', price: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const isEdit = !!product;

  useEffect(() => {
    if (product) {
      setForm({ name: product.name, description: product.description || '', price: product.price });
      if (product.image) setPreview(`${API_BASE}${product.image}`);
    }
  }, [product]);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('description', form.description);
    fd.append('price', form.price);
    if (file) fd.append('image', file);
    try {
      if (isEdit) {
        await updateProduct(product.id, fd);
        toast.success('Product updated!');
      } else {
        await createProduct(fd);
        toast.success('Product created!');
      }
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEdit ? 'Edit Product' : 'New Product'}</h3>
          <button className="btn-icon" onClick={onClose}><FiX size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Price *</label>
            <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Image</label>
            <div className="file-upload">
              {preview ? (
                <img src={preview} alt="Preview" className="img-preview" />
              ) : (
                <div className="file-placeholder"><FiImage size={32} /><span>Click to upload</span></div>
              )}
              <input type="file" accept="image/*" onChange={handleFile} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const loadProducts = async () => {
    try {
      const { data } = await getProducts();
      setProducts(data);
    } catch {
      toast.error('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      toast.success('Product deleted.');
      loadProducts();
    } catch {
      toast.error('Delete failed.');
    }
  };

  const openCreate = () => { setEditProduct(null); setModalOpen(true); };
  const openEdit = (p) => { setEditProduct(p); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditProduct(null); };
  const onSaved = () => { closeModal(); loadProducts(); };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h2>Products</h2>
          <button className="btn btn-primary" onClick={openCreate}><FiPlus size={18} /> Add Product</button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <FiImage size={48} />
            <p>No products yet. Create your first one!</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((p) => (
              <div key={p.id} className="product-card">
                <div className="product-img-wrapper">
                  {p.image ? (
                    <img src={`${API_BASE}${p.image}`} alt={p.name} className="product-img" />
                  ) : (
                    <div className="product-img-placeholder"><FiImage size={32} /></div>
                  )}
                </div>
                <div className="product-body">
                  <h4>{p.name}</h4>
                  <p className="product-desc">{p.description}</p>
                  <p className="product-price">₱{Number(p.price).toFixed(2)}</p>
                  <div className="product-actions">
                    <button className="btn btn-sm btn-outline" onClick={() => openEdit(p)}><FiEdit2 /> Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}><FiTrash2 /> Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {modalOpen && <ProductModal product={editProduct} onClose={closeModal} onSaved={onSaved} />}
    </>
  );
}
