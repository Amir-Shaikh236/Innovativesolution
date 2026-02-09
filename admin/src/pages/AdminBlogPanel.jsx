import React, { useEffect, useState } from "react";
import api from "../api";
import { BASE_URL } from '../api';
export default function AdminBlogPanel() {
  const [blogs, setBlogs] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    summary: "",
    body: "",
    image: "", // Used for existing image paths or local preview URLs
    published: false,
    slug: "",
    category: "",
    tags: ""
  });
  // Re-introduce state to hold the raw file object
  const [imageFile, setImageFile] = useState(null);

  const blogCategories = [
    "Software Services", "AI Agents", "HR Solutions", "Case Studies", "Future of Work / Industry Trends"
  ];

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await api.get("/api/blogs/all");
      setBlogs(res.data);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    }
  };

  const resetForm = () => {
    setEditing(null);
    setImageFile(null);
    setForm({
      title: "", summary: "", body: "", image: "",
      published: false, slug: "", category: "", tags: ""
    });
  };

  const handleEdit = (blog) => {
    setEditing(blog._id);
    setImageFile(null); // Clear any staged file
    setForm({
      ...blog,
      tags: blog.tags ? blog.tags.join(", ") : "",
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await api.delete(`/api/blogs/${id}`);
        fetchBlogs();
      } catch (error) {
        console.error("Failed to delete blog:", error);
      }
    }
  };

  // CORRECTED: This function ONLY stages the file and creates a preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Set a local preview URL in the form
      setForm(prevForm => ({ ...prevForm, image: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalImageUrl = editing ? form.image : "";

    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      try {
        const uploadRes = await api.post("/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        // Debug log
        console.log("Upload response:", uploadRes.data);
        finalImageUrl = uploadRes.data.url;
        ;
        setForm(prevForm => ({ ...prevForm, image: finalImageUrl }));
        console.log("Final image URL after upload:", finalImageUrl);
      } catch (error) {
        console.error("Image upload failed:", error);
        alert("Image upload failed. Please try again.");
        return;
      }
    }

    console.log("Final image URL before validation:", finalImageUrl);

    if (!finalImageUrl && !editing) {
      alert("Please upload a cover image for the new blog post.");
      return;
    }


    const blogData = {
      ...form,
      image: finalImageUrl, // Use the final, correct URL
      tags: form.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
    };

    try {
      if (editing) {
        await api.put(`/api/blogs/${editing}`, blogData);
      } else {
        await api.post("/api/blogs", blogData);
      }
      resetForm();
      fetchBlogs();
    } catch (error) {
      console.error("Failed to save blog:", error);
      alert("Failed to save blog post.");
    }
  };


  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Blog Panel</h1>

      <form onSubmit={handleSubmit} className="mb-10 space-y-4 bg-white p-8 rounded-xl shadow-lg border">
        <h2 className="text-xl font-semibold">{editing ? "Edit Blog Post" : "Add New Blog Post"}</h2>

        <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className="border p-3 w-full rounded-lg" />
        <input placeholder="Slug" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} required className="border p-3 w-full rounded-lg" />
        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required className="border p-3 w-full rounded-lg">
          <option value="">Select Category</option>
          {blogCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <input placeholder="Summary" value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} required className="border p-3 w-full rounded-lg" />
        <input placeholder="Tags (comma-separated)" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} className="border p-3 w-full rounded-lg" />

        <label className="block text-sm font-medium text-gray-700">Cover Image</label>
        <input
          type="file"
          className="border p-3 w-full rounded-lg"
          onChange={handleImageChange} // Use the staging function
        />
        {form.image && (
          <div className="mt-2">
            <img
              // The src can be a local blob URL or a server path
              src={form.image.startsWith('blob:') ? form.image : `${BASE_URL}${form.image}`}
              alt="Image Preview"
              className="max-h-48 rounded-lg object-contain border"
            />
          </div>
        )}

        <textarea placeholder="Body" rows={10} value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} required className="border p-3 w-full rounded-lg" />

        <label className="flex items-center gap-2 text-gray-700">
          <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} />
          Published
        </label>

        <div className="flex space-x-2">
          <button type="submit" className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold">
            {editing ? "Update Blog" : "Add Blog"}
          </button>
          {editing && (
            <button type="button" className="flex-1 px-4 py-3 bg-gray-500 text-white rounded-lg font-semibold" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Blogs list */}
      <div className="divide-y border rounded-xl shadow-lg bg-white">
        {blogs.map(blog => (
          <div key={blog._id} className="flex items-center py-4 px-6">
            <div className="flex-1">
              <strong className="text-lg text-gray-800">{blog.title}</strong>
              <p className="text-sm text-gray-500">Slug: {blog.slug}</p>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => handleEdit(blog)} className="text-blue-600 font-medium">Edit</button>
              <button onClick={() => handleDelete(blog._id)} className="text-red-600 font-medium">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}