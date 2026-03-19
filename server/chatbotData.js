// src/assets/chatbotData.js

const chatbotData = [
  // General & Greetings
  { q: 'hello', a: 'Hello! I\'m ISAC, your AI assistant. How can I help you today?' },
  { q: 'hi', a: 'Hi there! I\'m here to guide you through our services. What\'s on your mind?' },
  { q: 'help me', a: 'Of course! I can provide a website guide, answer common questions, or help you connect with our team.' },
  { q: 'thank you', a: 'You\'re welcome! Feel free to ask if you have any other questions.' },
  { q: 'bye', a: 'Goodbye! Feel free to reach out if you need any more assistance.' },
  
  // Custom Website-specific FAQs
  { 
    q: 'how to join as talent', 
    a: 'To join our team as a gig worker or intern, you need to apply by filling out our Join Talent form. After that, you will be contacted to proceed with verification and training.',
    cta: { text: "Go to Join as Talent Form", link: "/join-as-talent" }
  },
  { 
    q: 'how to team up', 
    a: 'To request a proposal for your business, please fill out our Team-Up Request form on the website. An expert will get back to you shortly.',
    cta: { text: "Go to Team-Up Request Form", link: "/team-up-request" }
  },
  { q: 'about website', a: 'Our website serves as a platform to connect innovative businesses with top talent. We offer a variety of services, including HR, software development, and AI solutions.' },
  { 
    q: 'what services you provide', 
    a: 'We provide a wide range of services, including staffing, recruitment, consulting, website/software development, and AI-driven solutions. You can explore all our services on the Services page.',
    cta: { text: "Explore Our Services", link: "/services" }
  },
  { 
    q: 'procedure to contact you', 
    a: 'The best way to contact us is through our Contact page. You can fill out the form, and a member of our team will get back to you. Our email and phone number are also available on the page.',
    cta: { text: "Go to Contact Page", link: "/contact" }
  },
  { q: 'what is innovative staffing', a: 'Innovative Staffing Solutions redefines recruitment by bridging businesses with a talented pool of gig workers, interns, and professionals to build stronger teams.' },
  
  // General FAQs (from your previous data)
  { q: 'verify business account', a: 'To verify your business account, you will need to sign a Letter of Agreement based on your business type and specific requirements. Verification is typically completed within 24–48 hours, and all your information is kept strictly confidential and secure.' },
  { q: 'documents required for verification', a: 'Signing the official agreement document is mandatory to complete verification.' },
  { q: 'verification time', a: 'Verification is typically completed within 24–48 hours.' },
  { q: 'business information secure', a: 'Yes. All business information is kept strictly confidential and secure.' },
  
  { q: 'payment methods', a: 'We accept UPI, RTGS, NEFT, Cash, Cheque, and Demand Draft (DD).' },
  { q: 'refunds or cancellations', a: 'All fees are non-refundable, unless otherwise stated in a signed contract.' },
  { q: 'hidden charges', a: 'There are no hidden charges. Transaction-based deductions may apply depending on the mode of payment.' },
  { q: 'pay in installments', a: 'Yes. We offer subscription-based payment options: Monthly, Three months, Six months, and Yearly. These are available for both project-based and subscription-based services.' },
  
  { q: 'nda before hiring', a: 'Yes. All projects require a signed NDA for confidentiality. We follow a standard NDA format for all clients.' },
  { q: 'project details confidential', a: 'Yes. We ensure complete confidentiality for all client projects.' },
  { q: 'custom nda', a: 'No. We follow a standard NDA format for all clients.' },
  { q: 'handle sensitive information', a: 'All sensitive data is stored securely and only accessible to authorized personnel involved in the project.' },
  
  { 
    q: 'start working with your platform', 
    a: 'Simply fill out our enquiry form. A project consultant will reach out via your preferred mode of communication.',
    cta: { text: "Go to Contact Page", link: "/contact" }
  },
  { q: 'track project progress', a: 'Yes. Daily progress reports are shared with you via email.' },
  { q: 'client support', a: 'We provide 24/7 client support for all active projects.' },
  { 
    q: 'view case studies or reviews', 
    a: 'You can explore our Case Studies and Testimonials sections directly on the website.',
    cta: { text: "View Case Studies", link: "/case-studies" }
  },
  
  { q: 'contact for technical issues', a: 'You can directly contact your assigned project consultant via email or phone. Our support team is available 24/7.' },
  { q: 'technical support 24/7', a: 'Yes. Our support team is available round the clock.' },

  // Gig Worker-specific FAQs
  { q: 'verify identity as a gig worker', a: 'Verification involves completing KYC and an aptitude assessment based on your chosen domain of interest. This is usually completed within 24-48 hours.' },
  { q: 'documents needed for gig workers', a: 'You will need to provide: Aadhar Card (mandatory), Qualification certificates (if any), and an Experience letter (if applicable).' },
  { q: 'gig worker verification time', a: 'Verification is usually completed within 24–48 hours.' },
  { q: 'gig worker data safe', a: 'Yes. Your data is kept strictly confidential. If clients request access, it is only shared in a non-disclosable format.' },
  
  { q: 'gigs with a stipend', a: 'Mostly yes, unless otherwise specified for specific opportunities.' },
  { q: 'when will I receive payment', a: 'Payments are released immediately after project completion.' },
  { q: 'hidden deductions for gig workers', a: 'There are no hidden charges. Transaction-based deductions may apply depending on the mode of payment.' },
  { q: 'leave gig midway', a: 'No. Payments are made only upon successful completion of the assigned project.' },
  
  { q: 'sign nda as gig worker', a: 'Yes. All gig workers and interns are required to sign an NDA before starting any project.' },
  { q: 'showcase work in portfolio', a: 'Yes. With client approval, you can add completed work to your portfolio.' },
  { q: 'protect my projects', a: 'All resources and tools provided are secure, reliable, and access-controlled.' },
  { q: 'concerns about confidentiality', a: 'A formal agreement between the client and our company ensures confidentiality at every step.' },
  
  { 
    q: 'apply for gigs', 
    a: 'You can apply by filling out the Join Talent form or by emailing us directly, based on your preference.',
    cta: { text: "Go to Join Talent Form", link: "/join-as-talent" }
  },
  { 
    q: 'matched with projects', 
    a: 'Matching is based on your aptitude performance during the selection process.',
    cta: { text: "Go to Join Talent Form", link: "/join-as-talent" }
  },
  { q: 'remote or on-site work', a: 'The work mode depends on client requirements.' },
  { q: 'certificate or proof of work', a: 'Yes. You will receive a Letter of Recommendation (LOR), Internship Certificate, and a Project Completion Certificate.' },
  
  { q: 'training before gigs', a: 'Yes. We provide quick, hands-on training while you work on live projects.' },
  { q: 'contact for challenges', a: 'You can directly reach out to your assigned Project Manager.' },
  { q: 'mentorship or guidance', a: 'Yes, 100% mentorship and guidance are provided throughout the project.' },
  { q: 'support outside working hours', a: 'Yes. Our support team is available 24/7.' },
  
  { 
    q: 'help me get a full-time role', 
    a: 'Yes. Based on your performance and experience, there may be opportunities for full-time placement within our company.',
    cta: { text: "Explore Careers", link: "/careers" }
  },
  { q: 'extend my gig/internship', a: 'Yes. Extensions are possible upon mutual agreement.' },
  { q: 'networking opportunities', a: 'Yes. You will have opportunities to connect with peers, mentors, and industry professionals.' },
];

export default chatbotData;