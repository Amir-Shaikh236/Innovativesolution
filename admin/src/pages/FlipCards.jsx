import React, { useEffect, useState } from 'react';
import api from '../api';

export default function FlipCards() {
  const [flipcards, setFlipcards] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', image: '', link: '', order: 0, _id: null });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFlipcards();
  }, []);

  const fetchFlipcards = async () => {
    try {
      const { data } = await api.get('/api/flipcards');
      setFlipcards(data);
    } catch {
      setError('Failed to load flipcards');
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (form._id) {
        await api.put(`/flipcards/${form._id}`, form);
      } else {
        await api.post('/flipcards', form);
      }
      setForm({ title: '', description: '', image: '', link: '', order: 0, _id: null });
      fetchFlipcards();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save flipcard');
    }
  };

  const handleEdit = (fc) => setForm({ ...fc });

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this flipcard?')) return;
    try {
      await api.delete(`/flipcards/${id}`);
      fetchFlipcards();
    } catch {
      setError('Failed to delete flipcard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold mb-6">FlipCards</h2>

        {error && (
          <p className="mb-4 text-center text-red-600 font-semibold">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="mb-10 grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
            className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
            className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="link"
            placeholder="Link URL"
            value={form.link}
            onChange={handleChange}
            className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="order"
            type="number"
            placeholder="Order"
            value={form.order}
            onChange={handleChange}
            className="w-full max-w-[80px] px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex space-x-3">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-5 py-3 rounded-md font-semibold hover:bg-indigo-700 transition"
            >
              {form._id ? 'Update' : 'Add'}
            </button>
            {form._id && (
              <button
                type="button"
                onClick={() => setForm({ title: '', description: '', image: '', link: '', order: 0, _id: null })}
                className="border border-gray-300 text-gray-700 px-5 py-3 rounded-md font-semibold hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Link</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {flipcards.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No flipcards found.
                  </td>
                </tr>
              )}

              {flipcards.map(fc => (
                <tr key={fc._id} className="hover:bg-indigo-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">{fc.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{fc.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {fc.image ? (
                      <a href={fc.image} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                        View
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {fc.link ? (
                      <a href={fc.link} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                        Visit
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{fc.order}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center space-x-4">
                    <button onClick={() => handleEdit(fc)} className="text-indigo-600 hover:text-indigo-900 font-semibold">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(fc._id)} className="text-red-600 hover:text-red-900 font-semibold">
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
