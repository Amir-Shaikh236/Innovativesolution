import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight } from "lucide-react";
import IT from "../assets/IT.jpeg";
import EDU from "../assets/EDU.jpeg";
import retail from "../assets/retail.jpeg";
import finance from "../assets/finance.jpeg";
import non from "../assets/non.jpeg";

export default function IndustryPlaybookPage() {
  const { slug } = useParams();
  const [playbook, setPlaybook] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data to match your document content
  const mockPlaybooks = {
    "it-saas": {
      heroHeadline: "Empowering Innovation: Scalable Solutions for a Cloud-First World",
      heroTagline: "We design adaptive digital solutions that scale with growth, strengthen customer engagement, and ensure compliance.",
      heroImage: IT,
      challenges: [
        "Fast-paced technology shifts outpacing existing infrastructures.",
        "Customer retention issues in highly competitive SaaS markets.",
        "Data privacy and compliance requirements (GDPR, SOC2).",
        "High churn due to onboarding and adoption struggles."
      ],
      approach: "We design adaptive digital solutions that scale with growth, strengthen customer engagement, and ensure compliance. From product strategy to deployment, we integrate cloud-first architectures and customer-centric experiences.",
      useCases: [
        "SaaS product onboarding journeys to reduce churn.",
        "Workflow automation for IT service management.",
        "Scalable cloud infrastructure to support hyper-growth.",
        "Integrating AI for predictive customer support."
      ],
      stats: [
        `Global SaaS market expected to hit $908B by 2030.`,
        `35% of SaaS revenue is lost to churn without retention strategies.`,
        `94% of enterprises already use cloud services.`
      ],
      futureOutlook: "We see SaaS moving toward AI-driven personalization, usage-based pricing, and hyper-automation. Companies that invest in customer experience and predictive analytics will lead the next wave.",
      ctaMainButton: "Explore Solutions",
      ctaMainLink: "/services",
      ctaSecondaryButton: "Get a Custom Proposal",
      ctaSecondaryLink: "/team-up-request"
    },
    "education": {
      heroHeadline: "Transforming Learning: From Classrooms to Cloudrooms",
      heroTagline: "We bridge gaps in access, design engaging digital platforms, and build data-driven solutions to personalize education. We help institutions, EdTechs, and educators reimagine the learning experience.",
      heroImage: EDU,
      challenges: [
        "Unequal access to digital learning resources.",
        "Low engagement in virtual/hybrid learning formats.",
        "Difficulties in measuring student outcomes effectively.",
        "Rising demand for personalized and adaptive learning tools."
      ],
      approach: "We bridge gaps in access, design engaging digital platforms, and build data-driven solutions to personalize education. We help institutions, EdTechs, and educators reimagine the learning experience.",
      useCases: [
        "Smart learning management systems (LMS).",
        "Gamified learning apps for higher engagement.",
        "AI tutors for personalized progress tracking.",
        "Online exam and assessment platforms."
      ],
      stats: [
        `Global EdTech market will reach $404B by 2025.`,
        `Students using gamified tools show 60% better engagement.`,
        `1 in 3 universities are shifting to hybrid-first models.`
      ],
      futureOutlook: "The future of education is personalized, lifelong, and accessible anywhere. AI tutors, immersive AR/VR classrooms, and credential-based learning will redefine global education.",
      ctaMainButton: "Explore Solutions",
      ctaMainLink: "/services",
      ctaSecondaryButton: "Get a Custom Proposal",
      ctaSecondaryLink: "/team-up-request"
    },
    "retail-ecommerce": {
      heroHeadline: "Future-Proof Commerce: Personalized, Seamless, Everywhere",
      heroTagline: "We design commerce strategies that integrate personalization, simplify checkout, and optimize supply chain operations. Our digital-first solutions focus on conversion and customer loyalty.",
      heroImage: retail,
      challenges: [
        "Intense competition and price wars in e-commerce.",
        "High cart abandonment rates (average 70%).",
        "Struggles with omnichannel customer experiences.",
        "Supply chain disruptions affecting fulfillment."
      ],
      approach: "We design commerce strategies that integrate personalization, simplify checkout, and optimize supply chain operations. Our digital-first solutions focus on conversion and customer loyalty.",
      useCases: [
        "Personalized recommendation engines.",
        "Seamless payment & one-click checkout systems.",
        "AI-driven inventory & demand forecasting.",
        "Loyalty apps to boost repeat purchases."
      ],
      stats: [
        `Global e-commerce sales projected at $8.1T by 2026.`,
        `73% of shoppers expect omnichannel experiences.`,
        `Mobile commerce makes up 60% of sales.`
      ],
      futureOutlook: "Retail is shifting to phygital commerce—blending physical and digital. Brands that integrate AR try-ons, voice commerce, and AI-powered personalization will win.",
      ctaMainButton: "Explore Solutions",
      ctaMainLink: "/services",
      ctaSecondaryButton: "Get a Custom Proposal",
      ctaSecondaryLink: "/team-up-request"
    },
    "finance": {
      heroHeadline: "Smart, Secure, Scalable: Reimagining the Financial Ecosystem",
      heroTagline: "We deliver secure, compliant, and innovative financial technology solutions. From digital payments to robo-advisors, we empower financial firms to stay ahead in a digital-first economy.",
      heroImage: finance,
      challenges: [
        "Rising cyber threats and fraud in digital transactions.",
        "Compliance complexity (AML, KYC, GDPR).",
        "Demand for faster, seamless customer experiences.",
        "Legacy infrastructure slowing innovation."
      ],
      approach: "We deliver secure, compliant, and innovative financial technology solutions. From digital payments to robo-advisors, we empower financial firms to stay ahead in a digital-first economy.",
      useCases: [
        "Digital banking apps with biometric security.",
        "Automated KYC/AML verification systems.",
        "AI-based fraud detection.",
        "Wealth management platforms with robo-advisory."
      ],
      stats: [
        `FinTech market projected at $324B by 2026.`,
        `Digital payments grew 40% year-over-year in India (2024).`,
        `73% of Gen Z prefers mobile banking over physical branches.`
      ],
      futureOutlook: "The future of finance lies in embedded finance, decentralized finance (DeFi), and AI-powered financial guidance. Trust and security will remain the industry’s strongest currency.",
      ctaMainButton: "Explore Solutions",
      ctaMainLink: "/services",
      ctaSecondaryButton: "Get a Custom Proposal",
      ctaSecondaryLink: "/team-up-request"
    },
    "non-profit": {
      heroHeadline: "Purpose Meets Impact: Digital Solutions for Changemakers",
      heroTagline: "We empower nonprofits with affordable, scalable solutions for fundraising, donor management, and impact storytelling. Our tools focus on amplifying reach and making every resource count.",
      heroImage: non,
      challenges: [
        "Limited funding and resource constraints.",
        "Difficulties in donor engagement & retention.",
        "Transparency & impact measurement.",
        "Slow adoption of modern digital tools."
      ],
      approach: "We empower nonprofits with affordable, scalable solutions for fundraising, donor management, and impact storytelling. Our tools focus on amplifying reach and making every resource count.",
      useCases: [
        "Donor management & CRM systems.",
        "Digital fundraising campaigns.",
        "Storytelling dashboards showing real-world impact.",
        "Volunteer coordination platforms."
      ],
      stats: [
        `55% of donors prefer giving online.`,
        `Mobile giving donations grew 205% in the past 5 years.`,
        `Nonprofits that adopt CRM systems see 30% more donor retention.`
      ],
      futureOutlook: "Nonprofits will thrive by embracing data-driven impact measurement, digital fundraising, and AI-driven donor engagement. Purpose-led organizations will need tech as their strongest ally.",
      ctaMainButton: "Explore Solutions",
      ctaMainLink: "/services",
      ctaSecondaryButton: "Get a Custom Proposal",
      ctaSecondaryLink: "/team-up-request"
    }
  };

  useEffect(() => {
    // Using mock data for demonstration
    const playbookData = mockPlaybooks[slug];
    if (playbookData) {
      setPlaybook(playbookData);
    }
    setLoading(false);
  }, [slug]);

  if (loading) {
    return <div className="text-center py-16 bg-[#E6F7F5] text-[#134E4A] min-h-screen">Loading playbook...</div>;
  }

  if (!playbook) {
    return <div className="text-center py-16 bg-[#E6F7F5] text-[#134E4A] min-h-screen">Playbook not found.</div>;
  }

  // Helper function to capitalize and format the slug
  const formatSlug = (s) => {
    if (!s) return '';
    return s.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <motion.main
      className="min-h-screen bg-[#E6F7F5] text-[#134E4A] font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section - Updated with Frosted Teal Glass Effect */}
      <section className="relative w-full min-h-[70vh] flex flex-col md:flex-row items-center justify-center py-16 md:py-24 px-6 md:px-12 bg-[#B9F2EC]">
        {/* Left Column: Image with Frosted Glass Background */}
        <div className="relative w-full md:w-1/2 flex justify-center p-4">
          {/* Solid Frosted Glass Plate */}
          <div className="absolute inset-0 m-auto w-72 h-72 md:w-[450px] md:h-[450px] bg-teal-500/20 backdrop-blur-md border border-white/30 rounded-3xl -rotate-6" />
          
          <motion.img
            src={playbook.heroImage}
            alt={`${formatSlug(slug)} industry solutions`}
            className="relative z-10 rounded-2xl shadow-2xl w-full max-w-md h-auto object-cover border-4 border-white/50"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          />
        </div>
        
        {/* Right Column: Content */}
        <div className="w-full md:w-1/2 text-center md:text-left p-4 mt-8 md:mt-0">
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold mb-4 text-[#0F766E]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {playbook.heroHeadline}
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl max-w-xl mx-auto md:mx-0 text-[#145E59]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {playbook.heroTagline}
          </motion.p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto py-16 px-6">
        
        {/* The Challenges */}
        <motion.section
          className="mb-12 p-8 rounded-2xl bg-white shadow-sm border border-l-4 border-[#40E0D0]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4 text-[#008080]">Challenges</h2>
          <ul className="list-disc list-inside space-y-2 text-[#145E59]">
            {playbook.challenges.map((challenge, index) => (
              <li key={index}>{challenge}</li>
            ))}
          </ul>
        </motion.section>
        
        {/* Our Approach */}
        <motion.section
          className="mb-12 p-8 rounded-2xl bg-white shadow-sm border border-l-4 border-[#008080]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4 text-[#008080]">Our Approach</h2>
          <p className="text-lg text-[#145E59]">{playbook.approach}</p>
        </motion.section>

        {/* Use Cases / Applications */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4 text-[#008080]">Use Cases / Applications</h2>
          <ul className="list-disc list-inside space-y-2 text-[#145E59]">
            {playbook.useCases.map((useCase, index) => (
              <li key={index}>{useCase}</li>
            ))}
          </ul>
        </motion.section>

        {/* Stats & Insights */}
        <motion.section
          className="mb-12 p-8 rounded-2xl bg-white shadow-sm border border-l-4 border-[#40E0D0]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4 text-[#008080]">Stats & Insights</h2>
          <ul className="list-disc list-inside space-y-2 text-[#145E59]">
            {playbook.stats.map((stat, index) => (
              <li key={index}>{stat}</li>
            ))}
          </ul>
        </motion.section>

        {/* Future Outlook / Thought Leadership */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4 text-[#008080]">Future Outlook / Thought Leadership</h2>
          <p className="text-lg text-[#145E59]">{playbook.futureOutlook}</p>
        </motion.section>

        {/* Final Call-to-Action */}
        <motion.section
          className="text-center p-8 bg-[#0F766E] rounded-2xl shadow-xl border border-[#008080]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-white">Let’s Build for {formatSlug(slug)}</h2>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-center">
            <Link to={playbook.ctaMainLink} className="inline-flex items-center justify-center px-8 py-4 bg-[#86E0D6] text-[#134E4A] rounded-full font-bold hover:bg-white transition-colors duration-300">
              {playbook.ctaMainButton} <ArrowRight className="ml-2" />
            </Link>
            <Link to={playbook.ctaSecondaryLink} className="inline-flex items-center justify-center px-8 py-4 border border-white text-white rounded-full font-semibold hover:bg-white/10 transition">
              {playbook.ctaSecondaryButton}
            </Link>
          </div>
        </motion.section>
      </div>
    </motion.main>
  );
}