import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api"; // axios instance
import { motion, AnimatePresence } from "framer-motion";
import "./FlipCard.css"; // keep your flip card styles
import { BASE_URL } from '../api';
export default function ServicesPage() {
  const [allCategories, setAllCategories] = useState([]);
  const [subpages, setSubpages] = useState([]);
  const [selectedCats, setSelectedCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const listRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, spRes] = await Promise.all([
          api.get("/categories"),
          api.get("/subpages"),
        ]);
        setAllCategories(catRes.data);
        setSubpages(spRes.data);
      } catch {
        setError("Failed to load services. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const toggleCategory = (catName) => {
    setSelectedCats((prev) =>
      prev.includes(catName) ? prev.filter((c) => c !== catName) : [...prev, catName]
    );
  };

  const filteredSubpages =
    selectedCats.length === 0
      ? subpages
      : subpages.filter((sp) =>
        selectedCats.includes(sp.category?.name || sp.category)
      );

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-[#F5F5F5]">
        <p>Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-red-400">
        <p>{error}</p>
      </div>
    );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 1.2 } }}
        exit={{ opacity: 0, transition: { duration: 0.5 } }}
        className="min-h-screen pt-16 flex flex-col md:flex-row bg-black font-sans text-[#F5F5F5]"
      >
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="md:w-80 bg-gray-900/50 border border-gray-700 p-6 rounded-lg m-6 md:mr-0 md:ml-6 shadow-lg max-h-[calc(100vh-3rem)] overflow-y-auto"
        >
          <h2 className="text-[#008080] font-bold text-xl mb-4">Categories</h2>
          <ul>
            {allCategories.map((cat) => (
              <li key={cat._id} className="mb-3">
                <label className="flex items-center gap-3 cursor-pointer select-none text-slate-200">
                  <input
                    type="checkbox"
                    checked={selectedCats.includes(cat.name)}
                    onChange={() => toggleCategory(cat.name)}
                    className="form-checkbox h-5 w-5 bg-gray-800 border-gray-600 text-[#40E0D0] focus:ring-[#40E0D0]/50"
                  />
                  <span className="font-semibold">{cat.name}</span>
                </label>
              </li>
            ))}
          </ul>
        </motion.aside>

        {/* Flip Cards */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.5 } }}
          className="flex-1 p-6 mt-6 md:mt-0 max-w-full overflow-x-hidden"
        >
          {filteredSubpages.length === 0 ? (
            <div className="text-center text-slate-400 mt-20 text-lg">
              No services found for selected categories.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSubpages.map((service) => (
                <FlipCard
                  key={service._id}
                  service={service}
                  navigate={navigate}
                />
              ))}
            </div>
          )}
        </motion.main>
      </motion.div>
    </AnimatePresence>
  );
}

function FlipCard({ service, navigate }) {
  const imageUrl =
    service.image
      ? `${BASE_URL}${service.image}`
      : service.img
        ? service.img
        : "https://placehold.co/600x400/000000/F5F5F5?text=Service";

  return (
    <motion.div
      className="flip-card w-full h-96 rounded-xl shadow-lg cursor-pointer"
      tabIndex={0}
      onClick={() => navigate(`/subpage/${service.slug}`)}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/subpage/${service.slug}`)}
      role="button"
      aria-label={`View details for ${service.title}`}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flip-card-inner w-full h-full">
        <div className="flip-card-front w-full h-full rounded-xl bg-gray-900 flex flex-col">
          <div className="h-48 overflow-hidden rounded-t-xl">
            <img
              src={imageUrl}
              alt={service.title || service.name}
              draggable={false}
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.src = "https://placehold.co/600x400/000000/F5F5F5?text=Service")}
            />
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <h3 className="font-bold text-lg text-center text-[#F5F5F5]">
              {service.title || service.name}
            </h3>
          </div>
        </div>

        <div className="flip-card-back w-full h-full rounded-xl bg-gray-900 border border-gray-700 flex flex-col justify-between p-6">
          <div>
            <h3 className="font-semibold text-xl text-[#F5F5F5]">{service.title || service.name}</h3>
            <p className="text-slate-300 text-sm mb-3 line-clamp-3">
              {service.description || service.desc}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/subpage/${service.slug}`);
              }}
              className="flex-1 flex items-center justify-center gap-1 py-2 px-3 bg-[#40E0D0] text-black rounded-md font-bold hover:bg-[#2E8B57] hover:text-white transition-colors duration-300"
              aria-label={`Learn more about ${service.title}`}
            >
              Learn More
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M5 3l5 5-5 5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}