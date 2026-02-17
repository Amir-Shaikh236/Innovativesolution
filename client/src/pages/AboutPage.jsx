import React from "react";
import { Globe, Pin } from "lucide-react";

import founder from "../assets/founder.jpeg";

const StudentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-[#40E0D0]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M12 14l9-5-9-5-9 5 9 5z" />
    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-9.998 12.078 12.078 0 01.665-6.479L12 14z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-9.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
    />
  </svg>
);

const WomenIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-[#40E0D0]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

const BusinessIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-[#40E0D0]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const AboutPage = () => {
  const hiringProcess = [
    {
      title: "Talent Identification",
      description: "We look for smart, fast-working individuals.",
    },
    {
      title: "Skill Assessments",
      description: "Multiple rounds of interviews & hands-on tests.",
    },
    {
      title: "Confidence Building",
      description: "Mock interviews & mentoring sessions.",
    },
    {
      title: "Placement",
      description: "Matching the right talent with the right opportunity.",
    },
  ];

  return (
    <div className="bg-[#2F6690] text-[#F5F5F5] font-sans">
      <div className="container mx-auto px-6 py-12 md:py-20">
        {/* 1. Headline & 2. Subheadline */}
        <header className="text-center mb-16 md:mb-24 mt-10">
          <h1 className="text-2xl md:text-5xl font-bold text-[#008080] leading-tight">
            Empowering Careers
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold text-[#008080] leading-tight">
            Accelerating Businesses
          </h2>
          <p className="mt-6 text-lg md:text-xl text-[#F5F5F5] max-w-3xl mx-auto">
            We connect ambitious talent with startups and MSMEs, building
            smarter teams and stronger futures.
          </p>
        </header>

        <section id="why-we-started" className="mb-16 md:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 justify-center">
            {/* Founder Photo Placeholder */}
            <div className="flex justify-center lg:justify-center mt-50">
              <div className="bg-gray-900 w-full max-w-sm h-120  rounded-2xl  border-2 border-[#008080] flex items-center justify-center">
                <img
                  src={founder}
                  className="rounded-2xl shadow-2xl w-full max-w-lg aspect-square object-cover h-120 "
                  alt=""
                />
              </div>
            </div>

            {/* Pillar Cards */}
            <div className="space-y-6">
              {/* Pillar 1 */}
              <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 pt-1">
                    <StudentIcon />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#40E0D0] flex gap-2.5 align items-center">
                      <Pin />
                      Pillar 1 — Career Growth for Students
                    </h4>
                    <p className="mt-2 text-[#F5F5F5]/90">
                      Many students complete their studies with solid
                      theoretical knowledge but struggle when it comes to
                      real-world application. We saw this gap and built a system
                      where students work on live projects, mentor-led teams,
                      and portfolio-building tasks. Every experience is
                      assessed, so they walk away not just with skills, but with
                      proof of work that makes them truly hireable.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 ">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 pt-1">
                    <WomenIcon />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#40E0D0] flex gap-2.5 align items-center">
                      <Pin /> Pillar 2 — Safe Opportunities for Students & Women
                    </h4>
                    <p className="mt-2 text-[#F5F5F5]/90">
                      In today’s market, learners often face scams, unpaid gigs,
                      or low-quality opportunities disguised as “experience.”
                      For women restarting their careers, this challenge is even
                      greater. That’s why we created a verified ecosystem of
                      freelancing and microjob options — where every opportunity
                      is screened for quality, fairness, and growth potential.
                      Our model ensures safety, dignity, and real career
                      pathways for students and women alike.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 ">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 pt-1">
                    <BusinessIcon />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#40E0D0] flex gap-2.5 align items-center">
                      <Pin /> Pillar 3 — Staffing Solutions for Businesses
                    </h4>
                    <p className="mt-2 text-[#F5F5F5]/90">
                      Startups and MSMEs often need quick, flexible staffing —
                      not long-term contracts. We designed a solution where
                      companies can hire curated talent on-demand, whether for
                      hours, days, or specific projects. With fast matchmaking,
                      predictable SLAs, and growth-ready pipelines, businesses
                      save time, reduce costs, and scale with confidence.
                    </p>
                  </div>
                </div>
              </div>
              {/*Pillar 4*/}
              <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 ">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 pt-1 text-[#40E0D0]">
                    <Globe />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#40E0D0] flex gap-2.5 align items-center">
                      <Pin /> Pillar 4 — Empowering Micro Small Medium
                      Enterprises
                    </h4>
                    <p className="mt-2 text-[#F5F5F5]/90">
                      Micro, Small and Medium Enterprises (MSMEs) are the
                      backbone of the Indian economy. They include small-scale
                      businesses, startups, artisans, manufacturers, traders,
                      and service providers that operate with limited capital
                      but high potential. MSMEs play a crucial role in
                      generating employment, promoting innovation, supporting
                      local industries, and contributing significantly to GDP
                      and exports.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Who We Are */}
          <section
            id="who-we-are"
            className="max-w-4xl mx-auto text-center mb-16 mt-12 md:mb-24"
          >
            <h2 className="text-3xl font-bold text-[#008080] mb-6">
              Who We Are
            </h2>
            <p className="text-base md:text-lg leading-relaxed">
              At Innovative Staffing Solutions, we are driven by a clear
              mission: to empower enthusiastic young talent and women restarting
              their careers. Through hands-on training, skill development, and
              real-life project experience, we help individuals gain the
              confidence and capabilities they need to thrive — while driving
              sustainable growth for businesses.
            </p>
          </section>

          <div className="text-center pt-10">
            <h2 className="text-3xl font-bold text-[#008080] mb-6">
              Why We Started
            </h2>
            <p className="text-base md:text-lg max-w-4xl mx-auto mb-12">
              At Innovative Staffing Solutions, our journey began with a simple
              question: How can we bridge the gap between talent and opportunity
              in a way that’s safe, practical, and growth-focused? We identified
              three core challenges — and built our model around solving them:
            </p>
          </div>
        </section>

        {/* 5. What We Do */}
        <section id="what-we-do" className="mb-16 md:mb-24 text-center">
          <h2 className="text-3xl font-bold text-[#008080] mb-12">
            What We Do
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-900/50 border border-[#008080]/50 rounded-lg p-6 flex flex-col items-center">
              <span className="text-4xl mb-4">🧑‍💻</span>
              <h3 className="text-xl font-semibold mb-2">
                Training & Mentorship
              </h3>
              <p className="text-[#F5F5F5]/80">
                Preparing candidates with skills, projects, and confidence.
              </p>
            </div>
            <div className="bg-gray-900/50 border border-[#008080]/50 rounded-lg p-6 flex flex-col items-center">
              <span className="text-4xl mb-4">📊</span>
              <h3 className="text-xl font-semibold mb-2">Business Solutions</h3>
              <p className="text-[#F5F5F5]/80">
                Affordable staffing, management, and technology services for
                startups & MSMEs.
              </p>
            </div>
            <div className="bg-gray-900/50 border border-[#008080]/50 rounded-lg p-6 flex flex-col items-center">
              <span className="text-4xl mb-4">🎯</span>
              <h3 className="text-xl font-semibold mb-2">Smart Hiring</h3>
              <p className="text-[#F5F5F5]/80">
                A recruitment process designed to identify, test, and prepare
                high-performing candidates.
              </p>
            </div>
            <div className="bg-gray-900/50 border border-[#008080]/50 rounded-lg p-6 flex flex-col items-center">
              <span className="text-4xl mb-4">🤝</span>
              <h3 className="text-xl font-semibold mb-2">Partnerships</h3>
              <p className="text-[#F5F5F5]/80">
                Creating long-term connections between talent and organizations
                that value innovation.
              </p>
            </div>
          </div>
        </section>

        {/* 6. How We Hire */}
        <section id="how-we-hire" className="mb-16 md:mb-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#008080] mb-12">
            How We Hire
          </h2>
          <div className="relative">
            {/* The vertical line */}
            <div
              className="absolute left-4 top-0 h-full w-0.5 bg-[#008080]/50"
              aria-hidden="true"
            ></div>

            <div className="space-y-8">
              {hiringProcess.map((item, index) => (
                <div key={item.title} className="relative pl-12">
                  <div className="absolute left-0 top-1 flex items-center justify-center w-8 h-8 bg-[#008080] rounded-full">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#40E0D0]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[#F5F5F5]/80">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Mission, Vision, Values */}
        <section id="mission-vision-values" className="mb-16 md:mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-gray-900/50 p-6 rounded-lg">
              <span className="text-4xl">🌟</span>
              <h3 className="text-2xl font-bold text-[#008080] my-2">
                Mission
              </h3>
              <p className="text-[#F5F5F5]/90">
                To empower fresh talent and women professionals with the skills
                and confidence to succeed.
              </p>
            </div>
            <div className="bg-gray-900/50 p-6 rounded-lg">
              <span className="text-4xl">🔮</span>
              <h3 className="text-2xl font-bold text-[#008080] my-2">Vision</h3>
              <p className="text-[#F5F5F5]/90">
                To be the most trusted partner for startups and MSMEs in
                building future-ready teams.
              </p>
            </div>
            <div className="bg-gray-900/50 p-6 rounded-lg">
              <span className="text-4xl">💡</span>
              <h3 className="text-2xl font-bold text-[#008080] my-2">Values</h3>
              <p className="text-[#F5F5F5]/90">
                Integrity | Innovation | Diversity | Growth
              </p>
            </div>
          </div>
        </section>

        {/* 8. Our Impact */}
        <section id="impact" className="mb-16 md:mb-24">
          <h2 className="text-3xl font-bold text-center text-[#008080] mb-12">
            Our Impact
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="bg-gray-900/50 p-6 rounded-lg">
              <span className="block text-5xl font-bold text-[#40E0D0]">
                100+
              </span>
              <p className="mt-2 text-[#F5F5F5]/90">
                ✅ candidates trained and placed successfully
              </p>
            </div>
            <div className="bg-gray-900/50 p-6 rounded-lg">
              <span className="block text-5xl font-bold text-[#40E0D0]">
                10+
              </span>
              <p className="mt-2 text-[#F5F5F5]/90">
                ✅ startups scaled with our support
              </p>
            </div>
            <div className="bg-gray-900/50 p-6 rounded-lg">
              <span className="block text-5xl font-bold text-[#40E0D0]">
                70%
              </span>
              <p className="mt-2 text-[#F5F5F5]/90">
                ✅ women professionals reintroduced into workforce
              </p>
            </div>
            <div className="bg-gray-900/50 p-6 rounded-lg">
              <span className="block text-5xl font-bold text-[#40E0D0]">
                95%
              </span>
              <p className="mt-2 text-[#F5F5F5]/90">✅ client retention rate</p>
            </div>
          </div>
        </section>

        {/* 9. Why Choose Us */}
        <section
          id="why-choose-us"
          className="mb-16 md:mb-24 max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center text-[#008080] mb-12">
            Why Choose Us
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <li className="flex items-start space-x-3">
              <svg
                className="flex-shrink-0 h-6 w-6 text-[#40E0D0]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Tailored solutions for startups & MSMEs</span>
            </li>
            <li className="flex items-start space-x-3">
              <svg
                className="flex-shrink-0 h-6 w-6 text-[#40E0D0]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Affordable yet high-quality recruitment</span>
            </li>
            <li className="flex items-start space-x-3">
              <svg
                className="flex-shrink-0 h-6 w-6 text-[#40E0D0]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Focus on both talent growth and business success</span>
            </li>
            <li className="flex items-start space-x-3">
              <svg
                className="flex-shrink-0 h-6 w-6 text-[#40E0D0]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Long-term partnerships, not just placements</span>
            </li>
          </ul>
        </section>

        {/* 10. Closing Statement & 11. Call-to-Action */}
        <footer className="text-center">
          <p className="max-w-3xl mx-auto text-lg leading-relaxed mb-8">
            At Innovative Staffing Solutions, we don’t just fill vacancies — we
            build futures. By connecting driven individuals with
            forward-thinking companies, we accelerate careers and businesses
            alike.
          </p>
          <a
            href="#forms" // Replace with your form link or route
            className="inline-block bg-[#40E0D0] text-black font-bold py-3 px-8 rounded-lg text-lg hover:bg-[#2E8B57] hover:text-white transition-colors duration-300"
          >
            Get Started
          </a>
        </footer>
      </div>
    </div>
  );
};

export default AboutPage;
