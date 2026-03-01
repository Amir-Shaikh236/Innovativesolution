import React, { useEffect, useState } from 'react';
import api from '../api';
import { BASE_URL } from '../api';
const SECTION_TYPES = [
  { value: 'overview', label: 'Overview' },
  { value: 'features', label: 'Features' },
  { value: 'target', label: 'Target Audience' },
  { value: 'cta', label: 'CTA' },
];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    order: 0,
    image: '',
    sections: [],
    _id: null,
  });
  const [previewURL, setPreviewURL] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch {
      setError('Failed to load categories');
    }
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setPreviewURL(URL.createObjectURL(file));
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm(prev => ({ ...prev, image: data.url }));
    } catch {
      setError('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSectionChange = (idx, field, value) => {
    setForm(prev => {
      const updated = [...(prev.sections || [])];
      updated[idx][field] = value;
      return { ...prev, sections: updated };
    });
  };

  const addSection = () => setForm(prev => ({
    ...prev,
    sections: [...(prev.sections || []), { type: '', heading: '', content: '' }],
  }));

  const removeSection = idx => setForm(prev => ({
    ...prev,
    sections: prev.sections.filter((_, i) => i !== idx),
  }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      if (form._id) {
        await api.put(`/categories/${form._id}`, form);
      } else {
        // The corrected part: use the current form state for the POST request
        await api.post('/categories', form);
      }
      // Reset the form only after a successful submission
      setForm({ name: '', slug: '', description: '', order: 0, image: '', sections: [], _id: null });
      setPreviewURL('');
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed');
    }
  };

  const handleEdit = cat => {
    setForm({ ...cat, sections: cat.sections || [] });
    setPreviewURL(cat.image || '');
  };

  const handleDelete = async id => {
    if (!window.confirm('Confirm deletion?')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch {
      setError('Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-[900px] mx-auto bg-white rounded-xl shadow px-12 py-10">
        <h1 className="text-4xl font-extrabold mb-10 text-gray-900">Category Management</h1>

        {error && <p className="mb-6 text-center text-red-600 font-semibold">{error}</p>}

        <form onSubmit={handleSubmit} className="mb-12">
          <div className="grid gap-8 md:grid-cols-1">
            {/* Main Info */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col gap-5">
              <label className="text-sm text-gray-800 mb-1 font-semibold">Category Name
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="input input-bordered w-full mt-1 px-4 py-2 rounded-md border-gray-300 bg-white shadow-inner text-base focus:ring-2 focus:ring-indigo-500"
                />
              </label>

              <label className="text-sm text-gray-800 mb-1 font-semibold">Slug
                <input
                  name="slug"
                  type="text"
                  value={form.slug}
                  onChange={handleChange}
                  required
                  className="input input-bordered w-full mt-1 px-4 py-2 rounded-md border-gray-300 bg-white shadow-inner text-base focus:ring-2 focus:ring-indigo-500"
                />
              </label>

              <label className="text-sm text-gray-800 mb-1 font-semibold">Order
                <input
                  name="order"
                  type="number"
                  value={form.order}
                  onChange={handleChange}
                  className="input input-bordered w-full mt-1 px-4 py-2 rounded-md border-gray-300 bg-white shadow-inner text-base focus:ring-2 focus:ring-indigo-500"
                />
              </label>

              <label className="text-sm text-gray-800 mb-1 font-semibold">Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className="textarea textarea-bordered w-full mt-1 px-4 py-2 rounded-md border-gray-300 bg-white shadow-inner text-base focus:ring-2 focus:ring-indigo-500"
                />
              </label>
            </div>

            {/* Image Upload */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4 justify-between">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Category Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="block w-full text-sm text-gray-600 file:rounded-lg file:border-none file:bg-indigo-600 file:text-white file:font-semibold file:py-2 file:px-4 file:hover:bg-indigo-700"
                />
                {uploading && <div className="mt-2 text-xs text-gray-500">Uploading...</div>}
                {previewURL && !uploading && (
                  <img src={previewURL} alt="Preview" className="mt-4 rounded-lg shadow border w-32 h-32 object-cover" />
                )}
              </div>
            </div>

            {/* Sections Editor */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-bold text-gray-800">Sections</span>
                <button type="button"
                  onClick={addSection}
                  className="inline-flex items-center bg-indigo-600 text-white px-3 py-1.5 rounded-md font-medium hover:bg-indigo-700 transition text-sm">
                  <span className="mr-2 text-lg">+</span> Add Section
                </button>
              </div>
              {form.sections?.length === 0 && (
                <div className="italic text-gray-400 px-1">No sections added yet.</div>
              )}
              {form.sections && form.sections.map((section, idx) => (
                <div key={idx} className="bg-white rounded border border-gray-200 shadow-inner p-4 mb-2 relative">
                  <button type="button" onClick={() => removeSection(idx)}
                    className="absolute right-3 top-3 text-red-500 font-extrabold hover:scale-110">×</button>
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium text-gray-700">
                      Type
                      <select value={section.type}
                        onChange={e => handleSectionChange(idx, 'type', e.target.value)}
                        className="w-full px-3 py-2 mt-1 border rounded-md border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                        required>
                        <option value="">Section Type</option>
                        {SECTION_TYPES.map(opt =>
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        )}
                      </select>
                    </label>
                    <label className="text-sm font-medium text-gray-700">
                      Heading
                      <input
                        type="text"
                        value={section.heading}
                        onChange={e => handleSectionChange(idx, 'heading', e.target.value)}
                        required={section.type !== 'cta'}
                        className="w-full px-3 py-2 mt-1 border rounded-md border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                      />
                    </label>
                    <label className="text-sm font-medium text-gray-700">
                      Content
                      <textarea
                        rows={section.type === 'features' || section.type === 'overview' ? 4 : 3}
                        value={section.content}
                        onChange={e => handleSectionChange(idx, 'content', e.target.value)}
                        className="w-full px-3 py-2 mt-1 border rounded-md border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8 w-full md:w-auto">
            <button
              type="submit"
              disabled={uploading}
              className="rounded-lg bg-indigo-600 px-8 py-3 text-white font-semibold hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 transition"
            >
              {form._id ? 'Update Category' : 'Add Category'}
            </button>

            {form._id && (
              <button
                type="button"
                disabled={uploading}
                onClick={() => {
                  setForm({ name: '', slug: '', description: '', order: 0, image: '', sections: [], _id: null });
                  setPreviewURL('');
                }}
                className="rounded-lg border border-gray-300 px-8 py-3 font-semibold text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>


        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-full table-auto border border-gray-200 rounded-lg bg-white">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Image</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Slug</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Description</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Order</th>
                <th className="p-4 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-600">
                    No categories found.
                  </td>
                </tr>
              )}
              {categories.map(cat => (
                <tr key={cat._id} className="hover:bg-indigo-50 transition cursor-pointer">
                  <td className="p-4 whitespace-nowrap">
                    {cat.image ? (
                      <img src={`${BASE_URL}${cat.image}`} alt={cat.name} className="w-16 h-16 rounded-lg border object-cover" />
                    ) : (
                      <span className="italic text-gray-400">No Image</span>
                    )}
                  </td>
                  <td className="p-4 whitespace-nowrap align-middle">{cat.name}</td>
                  <td className="p-4 whitespace-nowrap align-middle">{cat.slug}</td>
                  <td className="p-4 whitespace-nowrap align-middle">{cat.description}</td>
                  <td className="p-4 whitespace-nowrap align-middle">{cat.order}</td>
                  <td className="p-4 whitespace-nowrap align-middle text-center space-x-4">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="text-indigo-600 font-semibold hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="text-red-600 font-semibold hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}