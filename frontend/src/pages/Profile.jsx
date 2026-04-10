import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getProfile, updateProfile } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { FiUser, FiCamera } from 'react-icons/fi';

export default function Profile() {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getProfile();
        setProfile(data);
        setName(data.name);
      } catch {
        toast.error('Failed to load profile.');
      }
    };
    load();
  }, []);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    fd.append('name', name);
    if (file) fd.append('profile_picture', file);
    try {
      const { data } = await updateProfile(fd);
      setProfile(data.user);
      updateUser({ id: data.user.id, name: data.user.name, email: data.user.email, profile_picture: data.user.profile_picture });
      setFile(null);
      setPreview(null);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <><Navbar /><div className="container"><p>Loading...</p></div></>;

  const avatarSrc = preview || (profile.profile_picture ? `${API_BASE}${profile.profile_picture}` : null);

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="profile-card">
          <h2>My Profile</h2>
          <form onSubmit={handleSubmit}>
            <div className="avatar-wrapper">
              <label htmlFor="avatar-input" className="avatar-label">
                {avatarSrc ? (
                  <img src={avatarSrc} alt="Profile" className="avatar-img" />
                ) : (
                  <div className="avatar-placeholder"><FiUser size={48} /></div>
                )}
                <div className="avatar-overlay"><FiCamera size={20} /></div>
              </label>
              <input id="avatar-input" type="file" accept="image/*" onChange={handleFileChange} hidden />
            </div>
            <div className="form-group">
              <label>Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={profile.email} disabled />
            </div>
            <div className="form-group">
              <label>Member Since</label>
              <input type="text" value={new Date(profile.created_at).toLocaleDateString()} disabled />
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
