import React, { useEffect, useState } from 'react';
import api from '../api';
import { BASE_URL } from '../api';
const SECTION_TYPES = [
  { value: 'features', label: 'Features' },
  { value: 'target', label: 'Target Audience' },
  { value: 'examples', label: 'Examples' },
  { value: 'benefits', label: 'Benefits' },
  { value: 'packages', label: 'Packages' },
  { value: 'cta', label: 'CTA' },
];

export default function Subpages() {
  const [subpages, setSubpages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    category: '',
    order: 0,
    image: '',
    sections: [],
    _id: null,
  });
  const [previewURL, setPreviewURL] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSubpages();
    fetchCategories();
  }, []);

  const fetchSubpages = async () => {
    try {
      const { data } = await api.get('/subpages');
      setSubpages(data);
    } catch {
      setError('Failed to load subpages');
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch {
      setError('Failed to load categories');
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSectionChange = (idx, field, value) => {
    setForm((prev) => {
      const updated = [...prev.sections];
      updated[idx][field] = value;
      return { ...prev, sections: updated };
    });
  };

  const addSection = () =>
    setForm((prev) => ({
      ...prev,
      sections: [...prev.sections, { type: '', heading: '', content: '' }],
    }));

  const removeSection = (idx) =>
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== idx),
    }));

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreviewURL(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((prev) => ({ ...prev, image: data.url }));
    } catch {
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.category) {
      setError('Category is required');
      return;
    }
    try {
      if (form._id) {
        await api.put(`/subpages/${form._id}`, form);
      } else {
        await api.post('/subpages', form);
      }
      setForm({
        title: '',
        slug: '',
        description: '',
        content: '',
        category: '',
        order: 0,
        image: '',
        sections: [],
        _id: null,
      });
      setPreviewURL('');
      fetchSubpages();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save subpage');
    }
  };

  const handleEdit = (sp) => {
    const categoryId = sp.category?._id || sp.category || '';
    setForm({ ...sp, category: categoryId, sections: sp.sections || [] });
    setPreviewURL(sp.image || '');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subpage?')) return;
    try {
      await api.delete(`/subpages/${id}`);
      fetchSubpages();
    } catch {
      setError('Failed to delete subpage');
    }
  };

  const renderSectionInput = (section, idx) => {
    switch (section.type) {
      case 'features':
      case 'benefits':
      case 'examples':
        return (
          <textarea
            rows={5}
            placeholder="Add list items here, one per line"
            value={section.content}
            onChange={(e) => handleSectionChange(idx, 'content', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md resize-y focus:ring-2 focus:ring-indigo-500"
          />
        );
      case 'packages':
        return (
          <textarea
            rows={7}
            placeholder="Add HTML or markdown content"
            value={section.content}
            onChange={(e) => handleSectionChange(idx, 'content', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md resize-y focus:ring-2 focus:ring-indigo-500"
          />
        );
      case 'cta':
        return (
          <input
            type="url"
            placeholder="Enter CTA URL"
            value={section.content}
            onChange={(e) => handleSectionChange(idx, 'content', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          />
        );
      default:
        return (
          <textarea
            rows={3}
            placeholder="Content"
            value={section.content}
            onChange={(e) => handleSectionChange(idx, 'content', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md resize-y focus:ring-2 focus:ring-indigo-500"
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-10">

        <h1 className="text-4xl font-extrabold mb-12">Subpages Management</h1>

        {error && (
          <div className="mb-8 bg-red-100 p-4 rounded text-red-700">{error}</div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

            <div className="space-y-6">
              <label className="block">
                <span className="text-gray-700 font-semibold">Title</span>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                />
              </label>

              <label className="block">
                <span className="text-gray-700 font-semibold">Slug</span>
                <input
                  type="text"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                />
              </label>

              <label className="block">
                <span className="text-gray-700 font-semibold">Category</span>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </label>

              <label className="block max-w-[100px]">
                <span className="text-gray-700 font-semibold">Order</span>
                <input
                  type="number"
                  name="order"
                  value={form.order}
                  onChange={handleChange}
                  placeholder="0"
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                />
              </label>
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-semibold">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                className="block w-full p-2 border rounded-md cursor-pointer border-gray-300 file:rounded-md file:bg-indigo-600 file:text-white file:border-0 file:px-4 file:py-2 hover:file:bg-indigo-700 transition"
              />
              {uploading && <p className="mt-2 text-sm text-gray-500">Uploading image...</p>}
              {previewURL && !uploading && (
                <img src={previewURL} alt="Preview" className="mt-4 rounded-md w-52 h-52 object-cover border border-gray-300" />
              )}
            </div>
          </div>

          {/* Description */}
          <label className="block mb-8">
            <span className="text-gray-700 font-semibold">Description</span>
            <textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 resize-y"
              placeholder="Brief description"
            />
          </label>

          {/* Sections Editor */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Sections</h2>
              <button type="button" onClick={addSection} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">+ Add Section</button>
            </div>
            {form.sections.length === 0 && <p className="italic text-gray-500">No sections added yet.</p>}
            <div className="space-y-6">
              {form.sections.map((section, idx) => (
                <div key={idx} className="p-6 bg-gray-50 border border-gray-300 rounded shadow-sm relative">
                  <button type="button" className="absolute top-4 right-4 font-semibold text-red-600 rounded hover:text-red-800" onClick={() => removeSection(idx)} aria-label="Delete section">&times;</button>
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <select className="flex-1 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500" value={section.type} onChange={e => handleSectionChange(idx, 'type', e.target.value)} required>
                      <option value="">Select section type</option>
                      {SECTION_TYPES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    <input type="text" placeholder="Section heading" className="flex-1 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500" value={section.heading} onChange={e => handleSectionChange(idx, 'heading', e.target.value)} required={section.type !== 'cta'} />
                  </div>
                  <textarea rows={section.type === 'features' || section.type === 'benefits' ? 5 : 3} className="w-full p-3 border border-gray-300 rounded resize-y focus:ring-2 focus:ring-indigo-500" placeholder="Section content" value={section.content} onChange={e => handleSectionChange(idx, 'content', e.target.value)} required />
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button type="submit" disabled={uploading} className="px-10 py-3 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700 transition">{
              form._id ? 'Update Subpage' : 'Add Subpage'
            }</button>
            {form._id && <button type="button" disabled={uploading} onClick={() => {
              setForm({ title: '', slug: '', description: '', content: '', category: '', order: 0, image: '', sections: [], _id: null });
              setPreviewURL('');
            }} className="px-10 py-3 rounded border border-gray-300 hover:bg-gray-100 transition">Cancel</button>}
          </div>
        </form>



        {/* Table listing subpages */}
        <div className="overflow-x-auto mt-10">
          <table className="min-w-full bg-white divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subpages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No subpages found.
                  </td>
                </tr>
              ) : (
                subpages.map((sp) => (
                  <tr
                    key={sp._id}
                    className="hover:bg-indigo-50 transition cursor-pointer"
                    onClick={() => handleEdit(sp)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sp.image ? (
                        <img
                          src={`${BASE_URL}${sp.image}`}
                          alt={sp.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-400 italic">No Image</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{sp.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{sp.slug}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sp.category
                        ? (typeof sp.category === 'object' ? sp.category.name : sp.category)
                        : <span className="text-gray-400 italic">No Category</span>}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">{sp.order}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center space-x-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(sp);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(sp._id);
                        }}
                        className="text-red-600 hover:text-red-900 font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  function renderSectionContentInput(section, idx) {
    switch (section.type) {
      case 'features':
      case 'benefits':
      case 'examples':
        return (
          <textarea
            rows={5}
            placeholder="Enter one item per line"
            value={section.content}
            onChange={(e) => handleSectionChange(idx, 'content', e.target.value)}
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
          />
        );
      case 'packages':
        return (
          <textarea
            rows={7}
            placeholder="Rich HTML or markdown content"
            value={section.content}
            onChange={(e) => handleSectionChange(idx, 'content', e.target.value)}
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
          />
        );
      case 'cta':
        return (
          <input
            type="url"
            placeholder="Enter CTA URL"
            value={section.content}
            onChange={(e) => handleSectionChange(idx, 'content', e.target.value)}
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        );
      default:
        return (
          <textarea
            rows={3}
            placeholder="Content"
            value={section.content}
            onChange={(e) => handleSectionChange(idx, 'content', e.target.value)}
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
          />
        );
    }
  }
}
