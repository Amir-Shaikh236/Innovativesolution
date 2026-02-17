import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from 'lucide-react';

// Data for the Terms and Conditions content
const termsData = [
  {
    title: "Eligibility",
    id: "eligibility",
    content: (
      <>
        [cite_start]<p className="mb-2">You must be at least 18 years old to use our services[cite: 202].</p>
        [cite_start]<p>By using our services, you confirm that you meet this requirement[cite: 203].</p>
      </>
    ),
  },
  {
    title: "Services",
    id: "services",
    content: (
      <>
        [cite_start]<p className="mb-2">We provide staffing, recruitment, consulting, management, website/software development, and AI-driven solutions[cite: 205].</p>
        [cite_start]<p>The scope of each service will be defined in the respective agreement or proposal shared with the client[cite: 206].</p>
      </>
    ),
  },
  {
    title: "Client Responsibilities",
    id: "client-responsibilities",
    content: (
      <>
        <ul className="list-disc list-inside space-y-2">
          [cite_start]<li>Clients must provide accurate and complete information necessary for service delivery[cite: 208].</li>
          [cite_start]<li>Timely communication, approvals, and feedback are required to ensure smooth execution of projects[cite: 209].</li>
          [cite_start]<li>Clients are responsible for complying with all applicable laws while using our services[cite: 210].</li>
          [cite_start]<li>Misuse of our services for unlawful purposes is strictly prohibited[cite: 211].</li>
        </ul>
      </>
    ),
  },
  {
    title: "Payments & Refunds",
    id: "payments-refunds",
    content: (
      <>
        <ul className="list-disc list-inside space-y-2">
          [cite_start]<li>Payment terms will be specified in the service agreement or invoice[cite: 213].</li>
          [cite_start]<li>All fees are non-refundable unless otherwise stated in a written contract[cite: 214].</li>
          [cite_start]<li>Delayed payments may attract penalties or suspension of services[cite: 215].</li>
        </ul>
      </>
    ),
  },
  {
    title: "Confidentiality & Data Protection",
    id: "confidentiality-data",
    content: (
      <>
        <ul className="list-disc list-inside space-y-2">
          [cite_start]<li>We respect client confidentiality and will not disclose sensitive business or personal information to third parties, except as required by law[cite: 217].</li>
          [cite_start]<li>Data shared with us will be handled in accordance with applicable data protection regulations[cite: 218].</li>
          [cite_start]<li>However, we cannot guarantee absolute security of digital transmissions or storage[cite: 219].</li>
          [cite_start]<li>We are not responsible for breaches caused by third-party tools, integrations, or platforms used in projects[cite: 220].</li>
        </ul>
      </>
    ),
  },
  {
    title: "Intellectual Property",
    id: "intellectual-property",
    content: (
      <>
        <ul className="list-disc list-inside space-y-2">
          [cite_start]<li>All content, designs, software, and AI solutions created by us remain our intellectual property until full payment is received[cite: 222].</li>
          [cite_start]<li>After full payment, rights may be transferred to the client as per the project agreement[cite: 223].</li>
          [cite_start]<li>Clients must not resell, redistribute, or misuse our intellectual property without written consent[cite: 224].</li>
          [cite_start]<li>Unauthorized use of our trademarks, logos, or brand identity is strictly prohibited[cite: 225].</li>
        </ul>
      </>
    ),
  },
  {
    title: "Limitation of Liability",
    id: "limitation-liability",
    content: (
      <>
        <p className="mb-2">While we strive to deliver high-quality services, we are not liable for:</p>
        <ul className="list-disc list-inside space-y-2">
          [cite_start]<li>Indirect, incidental, or consequential damages[cite: 228].</li>
          [cite_start]<li>Loss of data, business opportunities, or profits due to service delays or interruptions or unforeseen circumstances[cite: 229].</li>
          [cite_start]<li>Issues caused by third-party tools, platforms, or service providers[cite: 230].</li>
        </ul>
      </>
    ),
  },
  {
    title: "Termination",
    id: "termination",
    content: (
      <>
        <ul className="list-disc list-inside space-y-2">
          [cite_start]<li>Either party may terminate services with written notice[cite: 232].</li>
          [cite_start]<li>In case of termination, the client must pay for all work completed up to the termination date[cite: 233].</li>
        </ul>
      </>
    ),
  },
  {
    title: "Reviews & Testimonials",
    id: "reviews-testimonials",
    content: (
      <>
        <ul className="list-disc list-inside space-y-2">
          [cite_start]<li>Clients may provide reviews or testimonials, which we may publish on our website, portfolio, or social media platforms[cite: 235].</li>
          [cite_start]<li>By submitting feedback, clients grant us the right to use it for marketing purposes[cite: 236].</li>
        </ul>
      </>
    ),
  },
  {
    title: "Third-Party Links",
    id: "third-party-links",
    content: (
      <>
        [cite_start]<p>Our website may contain links to third-party platforms (Instagram, LinkedIn, Twitter/X, WhatsApp etc.). We are not responsible for the content or privacy practices of these platforms[cite: 238, 239].</p>
      </>
    ),
  },
  {
    title: "Governing Law",
    id: "governing-law",
    content: (
      <>
        [cite_start]<p>These Terms & Conditions are governed by the laws of India[cite: 241]. [cite_start]Any disputes will be subject to the jurisdiction of courts located in Pune, Maharashtra[cite: 242].</p>
      </>
    ),
  },
  {
    title: "Changes to Terms",
    id: "changes-to-terms",
    content: (
      <>
        [cite_start]<p className="mb-2">We reserve the right to update or modify these Terms & Conditions at any time[cite: 244].</p>
        [cite_start]<p>Updated versions will be posted on this website with a revised effective date[cite: 245].</p>
      </>
    ),
  },
];

const AccordionItem = ({ title, content, isOpen, onClick }) => (
  <div className="border-b border-gray-700">
    <button
      onClick={onClick}
      className="flex justify-between items-center w-full py-4 text-left font-bold text-lg text-[#F5F5F5] focus:outline-none"
    >
      <span>{title}</span>
      <motion.div
        initial={false}
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <ChevronDown size={24} className="text-[#40E0D0]" />
      </motion.div>
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="content"
          initial="collapsed"
          animate="open"
          exit="collapsed"
          variants={{
            open: { opacity: 1, height: "auto" },
            collapsed: { opacity: 0, height: 0 },
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden text-slate-300 pb-4"
        >
          {content}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default function TermsPage() {
  const [openItems, setOpenItems] = useState({});

  const handleAccordionToggle = (id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <main className="min-h-screen bg-black text-[#F5F5F5] font-sans px-6 py-20 md:py-32 flex flex-col items-center">

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">Terms and Conditions</h1>
        <p className="text-lg text-slate-300 max-w-xl mx-auto">
          Welcome to Innovative Staffing Solutions (“we,” “our,” “us”). By accessing or using our website [innovativestaffingsolutions.online], you agree to comply with and be bound by these Terms and Conditions. If you do not agree, please refrain from using our website or services. These Terms and Conditions govern your access to and use of our website and related services. Please read them carefully.
        </p>
        <p className="mt-4 text-sm font-semibold text-[#40E0D0]">Effective Date: 2023</p>
      </motion.section>

      <div className="w-full max-w-6xl bg-gray-900/50 border border-gray-700 rounded-3xl p-8 md:p-12">
        {/* Quick Navigation Menu */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Quick Navigation</h3>
          <ul className="flex flex-wrap gap-4 text-sm text-slate-300">
            {termsData.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="hover:text-[#40E0D0] transition-colors duration-200">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Accordion Sections */}
        <div className="space-y-4">
          {termsData.map((item) => (
            <div key={item.id} id={item.id} className="relative pt-8 md:pt-12">
              <AccordionItem
                title={item.title}
                content={item.content}
                isOpen={openItems[item.id]}
                onClick={() => handleAccordionToggle(item.id)}
              />
            </div>
          ))}
        </div>

        {/* Closing Section */}
        <div className="mt-12 text-center border-t border-gray-700 pt-8">
          <h3 className="text-xl font-bold mb-4">Contact Us</h3>
          <p className="text-sm text-slate-300 mb-4">
            If you have any questions regarding these Terms and Conditions, please contact us:
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-lg">
            <span className="flex items-center gap-2">
              <span className="text-xl">📧</span>
              <a href="mailto:contact@innovativestaffingsolutions.online" className="hover:text-[#40E0D0] transition-colors">
                contact@innovativestaffingsolutions.online
              </a>
            </span>
            <span className="flex items-center gap-2">
              <span className="text-xl">📞</span>
              <a href="tel:+917821929953" className="hover:text-[#40E0D0] transition-colors">
                +91 78219 29953
              </a>
            </span>
          </div>
          <p className="mt-6 text-sm italic text-slate-400">
            By using our website and services, you agree that you have read, understood, and accepted these Terms and Conditions.
          </p>
        </div>
      </div>
    </main>
  );
}