import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus, Handshake, Briefcase, CheckCircle, ArrowRight } from 'lucide-react';
import growth from "../assets/GrowthCase.jpeg"
import safe from "../assets/SafeOpp.jpeg";
import staffing from "../assets/StaffingSol.jpeg"

export default function CaseStudyDetailPage() {
  const { slug } = useParams();
  const [caseStudy, setCaseStudy] = useState(null);
  const [loading, setLoading] = useState(true);

  // In a real app, you would fetch this from your backend
  const mockCaseStudies = {
    "career-growth-for-students": {
      id: "1",
      title: "Career Growth for Students",
      metaDescription: "Help students move from theory to real work: live projects, mentor-led teams, portfolio-building and assessed outcomes that make them hireable.",
      heroHeadline: "From classroom to client-ready",
      heroSubheadline: "Real project work, mentor guidance, and portfolio-grade deliverables so students graduate with experience — not just a certificate.",
      impactHighlight: "Bridge the employability gap by turning coursework into client-facing projects and measurable career outcomes.",
      image: growth,
      challenge: {
        headline: "The Challenge:",
        intro: "Many students complete courses without ever doing work that mirrors real industry expectations. Causes we identified:",
        points: [
          "Curriculum focuses on theory; hands-on project work is limited.",
          "Colleges and instructors have limited bandwidth to source real projects.",
          "Students lack mentorship, exposure to client communication, and a credible portfolio.",
          "Recruiters expect demonstrable outcomes; without them students struggle to convert applications into interviews."
        ],
        whyItMatters: "Why it matters: lack of real-world experience delays career starts, reduces confidence, and widens the skills gap between graduates and employer needs."
      },
      approach: {
        headline: "Our Approach:",
        intro: "We designed a platform and program that simulates real-world delivery while being safe and structured for learners.",
        features: [
          { name: "Curated live projects", description: "Real scoped assignments from startups, small businesses, and internal R&D that are safe for learners." },
          { name: "Mentor matching", description: "Industry mentors guide small teams through client communication, scope management, and technical reviews." },
          { name: "Micro-internships", description: "Short, outcome-focused engagements (4–12 weeks) so students can complete multiple projects during studies." },
          { name: "Portfolio builder", description: "Every completed project is packaged as a case page (problem → approach → outcome) suitable for LinkedIn/GitHub/portfolio sites." },
          { name: "Assessment & badges", description: "Standardized rubric for technical skills, soft skills, and delivery discipline." },
          { name: "Career support", description: "Resume review and employer introductions." }
        ],
        process: [
          "Project intake: Client or internal brief is refined into a student-friendly scope.",
          "Team formation: Students are matched by skill level and interest.",
          "Onboarding & training: Quick bootcamp covering tools, client etiquette, and quality standards.",
          "Mentored execution: Weekly mentor check-ins, sprint reviews, and milestone deliverables.",
          "Review & showcase: Final deliverable reviewed by mentor and packaged into a portfolio piece.",
          "Career handoff: Employer matching and interview support using student deliverables."
        ],
        solutionInAction: {
          headline: "Solution in Action",
          text: "A typical project could be a 6-week UI/UX prototype for an EdTech startup. Students perform user research, build wireframes and a clickable prototype, and present to the client in a final demo. Mentors provide feedback on scope, testing, and presentation. The end result is a portfolio case study and a live demo that the student can present during interviews."
        }
      },
      results: {
        headline: "The Results",
        intro: "Rather than promising precise ROI up-front, we focus on outcomes we systematically deliver:",
        points: [
          "Students complete portfolio-ready projects during their studies.",
          "Increased confidence in interview situations (practical experience with real feedback).",
          "Improved visibility to employers via demonstrable deliverables.",
          "Faster transition from student to entry-level contributor."
        ],
        kpis: [
          "Projects completed per cohort",
          "% of students with 1+ portfolio projects after program",
          "Employer satisfaction (qualitative ratings)",
          "Interview callback rate for participants (if tracked)"
        ]
      },
      cta: {
        headline: "Want students who are ready on day one?",
        text: "Contact us to pilot a student project program.",
        buttonText: "Contact Us to Pilot a Program",
        link: "/join-as-talent",
        buttonIcon: UserPlus
      }
    },
    "safe-opportunities-for-students-and-women": {
      id: "2",
      title: "Safe Opportunities for Students & Women",
      metaDescription: "Protect learners from scams and low-quality “opportunities” by offering a verified ecosystem of freelancing and microjob options with clear safeguards and real growth paths.",
      heroHeadline: "Safe, verified pathways to real earning and skill growth",
      heroSubheadline: "We stop scammers and fake listings before they reach learners — and create a trusted route to legitimate freelancing and gig work.",
      impactHighlight: "Reduce exploitation and create reliable income and skill-building opportunities for vulnerable aspirants.",
      image: safe,
      challenge: {
        headline: "The Challenge",
        intro: "Students and women seeking flexible income often fall prey to:",
        points: [
          "Fake freelance listings promising quick riches via affiliate marketing or get-rich-quick schemes.",
          "Unclear payment terms, lack of milestones, and no recourse if work is stolen or unpaid.",
          "Predatory “consultants” or recruiters who charge upfront fees without delivering real jobs.",
          "A lack of trusted intermediaries who verify employers and protect workers."
        ],
        whyItMatters: "Consequences include financial loss, disillusionment, and a reluctance to pursue genuine freelance work."
      },
      approach: {
        headline: "Our Approach",
        intro: "We built a verification-first ecosystem where opportunity quality, trust, and worker protection are baked into the platform.",
        features: [
          { name: "Employer verification", description: "Identity checks and business validation before listings go live." },
          { name: "Job vetting", description: "All job postings are reviewed for clarity of scope, deliverables, and payment terms." },
          { name: "Escrow & milestone payments", description: "Funds are held until agreed milestones are completed." },
          { name: "Transparent contracts", description: "Standardized micro-contracts reduce ambiguity." },
          { name: "Training to spot scams", description: "Short learning modules teach how to identify red flags and protect personal data." },
          { name: "Community moderation & grievance system", description: "Quick dispute resolution and an appeals process." },
          { name: "Women-first safeguards", description: "Option for female-only cohorts, trusted female mentors, and privacy-first work profiles." }
        ],
        process: [
          "Opportunity submission: Employer posts job; platform reviewer checks legitimacy.",
          "Job onboarding: Clear deliverables, timeline, and payment schedule added.",
          "Worker onboarding: Candidate completes a safety module and agrees to the contract.",
          "Milestone delivery: Work is submitted to the mentor/client; escrow is released per milestone.",
          "Feedback & rating: Both sides rate the engagement; flags prompt review."
        ],
        solutionInAction: {
          headline: "Solution in Action",
          text: "A student applies for a content-writing gig. The job has clear milestones (research → draft → final), payment is held in escrow, and a mentor reviews the draft before client review. If a dispute arises, the platform mediates with documented communications and the milestone process."
        }
      },
      results: {
        headline: "The Results",
        intro: "What this enables:",
        points: [
          "Fewer scams and less financial risk for workers.",
          "Better-quality gigs with transparent payment and scope.",
          "A sense of safety that encourages more women and students to pursue freelancing.",
          "A growing reputation for verified, credible opportunities."
        ],
        kpis: [
          "Number of fraudulent listings blocked",
          "% of disputes resolved in favor of verified workers (or time-to-resolution)",
          "Average earnings per verified gig",
          "Retention rate for female participants"
        ]
      },
      cta: {
        headline: "Looking for safe freelance work?",
        text: "Businesses: Post a verified opportunity.",
        buttonText: "Explore Verified Gigs",
        link: "/services",
        buttonIcon: Handshake
      }
    },
    "staffing-solutions-for-businesses": {
      id: "3",
      title: "Staffing Solutions for Businesses",
      metaDescription: "On-demand staffing that lets businesses hire for hours or days, not just months — curated talent, fast match-making, predictable SLAs and growth-ready staffing pipelines.",
      heroHeadline: "Flexible staffing for the way modern companies actually work",
      heroSubheadline: "From one-day event staffing to multi-week product sprints — we provide pre-vetted talent you can scale on demand.",
      impactHighlight: "Replace inefficient monthly hiring with flexible, cost-effective staffing that aligns to real business rhythms.",
      image: staffing,
      challenge: {
        headline: "The Challenge",
        intro: "Small and medium businesses — and even teams in larger firms — face friction when they need short-term help:",
        points: [
          "Traditional hiring platforms and agencies push minimums (month-long contracts, notice periods).",
          "Recruitment and admin overhead (interviews, payroll setup) is expensive for short tasks.",
          "Skills mismatches and poor onboarding lead to wasted time and costs.",
          "Businesses miss opportunities (e.g., seasonal spikes, events, product launches) because they can’t hire flexibly."
        ]
      },
      approach: {
        headline: "Our Approach",
        intro: "We created a micro-staffing market that removes the friction from short-term hiring, backed by curation and operational guarantees.",
        features: [
          { name: "On-demand booking", description: "Book talent for 1 day, a week, or any custom duration." },
          { name: "Curated talent pools", description: "Pre-vetted profiles with skill tags and short work histories." },
          { name: "Trial-day option", description: "Try a worker for a day before scaling to longer bookings." },
          { name: "SLA & replacement guarantee", description: "If the worker doesn’t meet the requirement, we provide a vetted replacement." },
          { name: "Admin handled", description: "Contracts, payouts, NDAs and compliance handled by us." },
          { name: "Upskilling & bench", description: "We train talent and maintain a bench for repeated or scaling needs." }
        ],
        process: [
          "Requirement intake: Business submits a brief (skills, duration, deliverables).",
          "Shortlist & trial: We provide candidates and offer a trial day.",
          "Engagement: Full booking with milestones, if applicable.",
          "Post-engagement feedback: Rapid feedback loop informs future matches.",
          "Scale or convert: Good fits can be scaled to longer engagements or converted to hires."
        ],
        solutionInAction: {
          headline: "Solution in Action",
          text: "A typical project could be a 6-week UI/UX prototype for an EdTech startup. Students perform user research, build wireframes and a clickable prototype, and present to the client in a final demo. Mentors provide feedback on scope, testing, and presentation. The end result is a portfolio case study and a live demo that the student can present during interviews."
        }
      },
      results: {
        headline: "The Results",
        intro: "What this enables:",
        points: [
          "Businesses save on recruitment time and HR admin for short-term needs.",
          "Faster time-to-market for campaigns and product features.",
          "Access to a pool of trained, reliable talent without long-term commitment.",
          "Predictable costs and SLAs."
        ],
        kpis: [
          "Average time-to-fill for short-term roles",
          "Replacement rate within first 48–72 hours",
          "Cost-savings estimate vs. traditional hiring",
          "Business satisfaction score post-engagement"
        ]
      },
      cta: {
        headline: "Book a demo",
        text: null,
        buttonText: "Book a Demo",
        link: "/team-up-request",
        buttonIcon: Briefcase
      }
    }
  };

  useEffect(() => {
    // Using mock data for demonstration
    const caseData = mockCaseStudies[slug];
    if (caseData) {
      setCaseStudy(caseData);
    }
    setLoading(false);
  }, [slug]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-[#008080] bg-[#E6F7F5] font-bold text-xl tracking-widest uppercase">Loading Project...</div>;
  }

  if (!caseStudy) {
    return <div className="flex items-center justify-center min-h-screen text-[#134E4A] bg-[#E6F7F5] font-medium">Case study not found.</div>;
  }

  return (
    <motion.main
      className="min-h-screen bg-[#E6F7F5] text-[#134E4A] font-sans selection:bg-[#B9F2EC] selection:text-[#134E4A]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex flex-col lg:flex-row items-center justify-center py-20 px-8 md:px-20 overflow-hidden bg-gradient-to-b from-[#B9F2EC] to-[#E6F7F5]">
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/40 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        {/* Left Column: Image with "Frosted Glass" logic */}
        <div className="w-full lg:w-1/2 flex justify-center z-10">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative"
            >
                {/* The "Plate" behind the image */}
                <div className="absolute inset-0 bg-[#008080]/10 backdrop-blur-md rounded-3xl -rotate-6 translate-x-4 translate-y-4"></div>
                <img 
                    src={caseStudy.image}
                    alt={caseStudy.title}
                    className="relative rounded-3xl shadow-2xl w-full max-w-lg aspect-[4/5] lg:aspect-square object-cover border-8 border-white/50"
                />
            </motion.div>
        </div>

        {/* Right Column: Content */}
        <div className="w-full lg:w-1/2 text-left lg:pl-16 mt-16 lg:mt-0 z-10">
            <motion.h1
                className="text-5xl md:text-7xl font-black mb-6 text-[#134E4A] leading-[1.1] tracking-tight"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
            >
                {caseStudy.heroHeadline}
            </motion.h1>
            <motion.p
                className="text-xl md:text-2xl text-[#0F766E] font-medium max-w-2xl mb-10 leading-relaxed opacity-80"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                {caseStudy.heroSubheadline}
            </motion.p>
            <motion.div
                className="inline-block p-8 bg-white/60 backdrop-blur-xl rounded-3xl max-w-xl border border-white shadow-xl shadow-[#008080]/5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
            >
                <p className="text-lg italic text-[#008080] font-semibold leading-relaxed">"{caseStudy.impactHighlight}"</p>
            </motion.div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto py-24 px-8">
        
        {/* The Challenge */}
        <motion.section
          className="mb-32 bg-white rounded-[2.5rem] p-12 shadow-sm border-l-[12px] border-[#008080]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-sm uppercase tracking-[0.4em] font-black mb-8 text-[#008080]">{caseStudy.challenge.headline}</h2>
          <p className="text-3xl font-bold text-[#134E4A] mb-12 leading-tight">{caseStudy.challenge.intro}</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {caseStudy.challenge.points.map((point, index) => (
              <li key={index} className="flex items-start group">
                <span className="flex-shrink-0 h-2 w-2 bg-[#86E0D6] rounded-full mt-3 mr-4 group-hover:scale-150 transition-transform duration-300"></span>
                <span className="text-lg text-[#0F766E] font-medium leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
          {caseStudy.challenge.whyItMatters && (
            <div className="mt-16 p-8 bg-[#B9F2EC]/30 rounded-2xl border-t border-white">
                <p className="text-[#134E4A] font-bold italic text-lg leading-relaxed">{caseStudy.challenge.whyItMatters}</p>
            </div>
          )}
        </motion.section>

        {/* Our Approach */}
        <motion.section
          className="mb-32"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="text-center mb-20">
            <h2 className="text-sm uppercase tracking-[0.4em] font-black mb-6 text-[#008080]">{caseStudy.approach.headline}</h2>
            <p className="text-3xl text-[#134E4A] font-bold max-w-3xl mx-auto">{caseStudy.approach.intro}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {caseStudy.approach.features.map((feature, index) => (
              <div key={index} className="p-10 rounded-[2rem] bg-white border border-[#B9F2EC] hover:shadow-2xl hover:shadow-[#008080]/10 transition-all duration-500">
                <div className="flex items-center mb-6">
                    <div className="p-3 bg-[#E6F7F5] rounded-xl mr-4 text-[#008080]">
                        <CheckCircle size={24} />
                    </div>
                    <h4 className="text-2xl font-black text-[#134E4A] tracking-tight">{feature.name}</h4>
                </div>
                <p className="text-[#0F766E] text-lg leading-relaxed font-medium opacity-80">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-24">
              <h3 className="text-2xl font-black mb-12 text-[#134E4A] flex items-center justify-center">
                  <span className="w-12 h-[2px] bg-[#B9F2EC] mr-6"></span>
                  STRATEGIC ROADMAP
                  <span className="w-12 h-[2px] bg-[#B9F2EC] ml-6"></span>
              </h3>
              <div className="space-y-4">
                {caseStudy.approach.process.map((step, index) => (
                  <div key={index} className="flex items-center p-6 bg-white/40 rounded-2xl border border-white hover:bg-white hover:translate-x-3 transition-all duration-300 group">
                      <span className="text-xl font-black text-[#86E0D6] mr-8 group-hover:text-[#008080] transition-colors">0{index + 1}</span>
                      <span className="text-[#134E4A] text-lg font-bold">{step}</span>
                  </div>
                ))}
              </div>
          </div>
        </motion.section>

        {/* Solution in Action */}
        {caseStudy.approach.solutionInAction && (
          <motion.section
            className="mb-32 p-16 rounded-[3rem] bg-[#134E4A] text-white shadow-2xl relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute top-0 right-0 p-20 bg-white/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <div className="relative z-10">
                <div className="flex items-center mb-8">
                    <div className="px-4 py-1.5 bg-[#86E0D6] text-[#134E4A] rounded-full text-xs font-black uppercase tracking-widest mr-6">The Use Case</div>
                    <h3 className="text-3xl font-black tracking-tight">{caseStudy.approach.solutionInAction.headline}</h3>
                </div>
                <p className="text-2xl text-[#B9F2EC] font-light leading-relaxed opacity-90">{caseStudy.approach.solutionInAction.text}</p>
            </div>
          </motion.section>
        )}

        {/* The Results */}
        <motion.section
          className="mb-32"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-sm uppercase tracking-[0.4em] font-black mb-8 text-[#008080]">{caseStudy.results.headline}</h2>
          <p className="text-4xl font-black text-[#134E4A] mb-16 leading-tight">{caseStudy.results.intro}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 mb-20">
            {caseStudy.results.points.map((point, index) => (
              <div key={index} className="flex items-center p-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#008080] mr-6"></div>
                  <p className="text-xl text-[#0F766E] font-bold">{point}</p>
              </div>
            ))}
          </div>
          {caseStudy.results.kpis && caseStudy.results.kpis.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {caseStudy.results.kpis.map((kpi, index) => (
                  <div key={index} className="text-center p-8 bg-white rounded-3xl border-b-4 border-[#86E0D6] shadow-sm">
                      <p className="text-xs font-black uppercase tracking-widest text-[#008080] mb-3 opacity-60">Impact 0{index + 1}</p>
                      <p className="text-lg text-[#134E4A] font-black leading-tight">{kpi}</p>
                  </div>
                ))}
            </div>
          )}
        </motion.section>

        {/* Final Call-to-Action */}
        <motion.section
          className="text-center p-20 bg-white rounded-[4rem] border border-[#B9F2EC] shadow-2xl shadow-[#008080]/5 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl font-black mb-8 text-[#134E4A] tracking-tight leading-tight">{caseStudy.cta.headline}</h2>
          {caseStudy.cta.text && <p className="text-2xl mb-12 text-[#0F766E] font-medium max-w-2xl mx-auto opacity-80">{caseStudy.cta.text}</p>}
          <Link to={caseStudy.cta.link} className="group relative inline-flex items-center px-12 py-6 bg-[#134E4A] text-white rounded-2xl font-black text-xl overflow-hidden hover:bg-[#0F766E] transition-all duration-500 shadow-xl">
            <span className="relative z-10 mr-4">{caseStudy.cta.buttonText}</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </motion.section>

        <div className="mt-24 text-center">
            <Link to="/case-studies" className="text-[#008080] hover:text-[#134E4A] font-black text-sm tracking-[0.3em] uppercase transition-all inline-flex items-center">
                <ArrowRight className="mr-3 rotate-180" size={20} />
                BACK TO PROJECTS
            </Link>
        </div>

      </div>
    </motion.main>
  );
}