import { FAQItem, Document } from '../types/urag';

export const mockFAQs: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'What are the admission requirements for engineering programs?',
    answer: 'For engineering programs at SFIT, candidates must have passed 12th standard with Physics, Chemistry, and Mathematics. Minimum 50% aggregate required. Admission through MHT-CET or JEE Main scores.',
    variations: [
      'What do I need to get into engineering at SFIT?',
      'Engineering admission criteria at SFIT?',
      'Requirements for BTech admission?'
    ]
  },
  {
    id: 'faq-2',
    question: 'What is the fee structure for undergraduate programs?',
    answer: 'The annual tuition fee for undergraduate engineering programs is approximately ₹1,50,000. Additional charges include development fee, library fee, and exam fee. Total annual cost is around ₹1,80,000.',
    variations: [
      'How much does it cost to study at SFIT?',
      'SFIT fee details for UG programs?',
      'Annual fees for engineering courses?'
    ]
  },
  {
    id: 'faq-3',
    question: 'When do admissions open for the next academic year?',
    answer: 'Admissions for the academic year 2024-25 typically open in May after MHT-CET results. The process includes counseling rounds from June to August. Keep checking our official website for exact dates.',
    variations: [
      'SFIT admission dates 2024?',
      'When can I apply for next year?',
      'Admission timeline for engineering programs?'
    ]
  },
  {
    id: 'faq-4',
    question: 'What courses are offered at SFIT?',
    answer: 'SFIT offers undergraduate programs in Computer Engineering, Information Technology, Electronics & Telecommunication, Mechanical Engineering, and Civil Engineering. We also have postgraduate programs in various specializations.',
    variations: [
      'Available courses at SFIT?',
      'What can I study at SFIT?',
      'Engineering branches offered?'
    ]
  },
  {
    id: 'faq-5',
    question: 'Is there a hostel facility available?',
    answer: 'Yes, SFIT provides separate hostel facilities for boys and girls. The hostels are well-equipped with modern amenities, WiFi, mess facilities, and 24/7 security. Hostel admission is based on merit and availability.',
    variations: [
      'Does SFIT have hostels?',
      'Accommodation facilities at SFIT?',
      'Hostel availability for students?'
    ]
  }
];

export const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    content: 'The admission process at St. Francis Institute of Technology follows the guidelines set by the Directorate of Technical Education, Maharashtra. Students seeking admission to undergraduate engineering programs must have completed their 12th standard education with Physics, Chemistry, and Mathematics as core subjects.',
    augmentedContent: 'SFIT follows DTE Maharashtra guidelines for admissions. The admission process at St. Francis Institute of Technology follows the guidelines set by the Directorate of Technical Education, Maharashtra. Students seeking admission to undergraduate engineering programs must have completed their 12th standard education with Physics, Chemistry, and Mathematics as core subjects. This ensures students have the necessary foundation for engineering studies.',
    summary: 'SFIT follows DTE Maharashtra guidelines for engineering admissions requiring PCM at 12th level.',
    metadata: {
      url: 'https://sfit.ac.in/admissions/process',
      title: 'Admission Process',
      section: 'admissions'
    }
  },
  {
    id: 'doc-2',
    content: 'The institute is affiliated with the University of Mumbai and approved by AICTE. All programs are NBA accredited ensuring quality education standards. The campus spans 7 acres in Borivali West, Mumbai, with state-of-the-art laboratories and modern infrastructure.',
    augmentedContent: 'SFIT maintains high educational standards through accreditation and modern facilities. The institute is affiliated with the University of Mumbai and approved by AICTE. All programs are NBA accredited ensuring quality education standards. The campus spans 7 acres in Borivali West, Mumbai, with state-of-the-art laboratories and modern infrastructure. This accreditation ensures industry-relevant curriculum and quality assurance.',
    summary: 'SFIT is Mumbai University affiliated, AICTE approved, NBA accredited with modern 7-acre campus.',
    metadata: {
      url: 'https://sfit.ac.in/about/accreditation',
      title: 'Accreditation & Infrastructure',
      section: 'about'
    }
  },
  {
    id: 'doc-3',
    content: 'The placement cell at SFIT has consistently achieved excellent results with top companies like TCS, Infosys, Wipro, Accenture, and L&T recruiting our students. The average package ranges from 4-8 LPA with highest packages going up to 15 LPA. We conduct regular training sessions, mock interviews, and soft skills development.',
    augmentedContent: 'SFIT placement cell ensures excellent career opportunities through industry partnerships and training. The placement cell at SFIT has consistently achieved excellent results with top companies like TCS, Infosys, Wipro, Accenture, and L&T recruiting our students. The average package ranges from 4-8 LPA with highest packages going up to 15 LPA. We conduct regular training sessions, mock interviews, and soft skills development. This comprehensive approach prepares students for successful careers.',
    summary: 'SFIT placement cell achieves 4-8 LPA average packages with top MNCs and comprehensive training.',
    metadata: {
      url: 'https://sfit.ac.in/placements/statistics',
      title: 'Placement Statistics',
      section: 'placements'
    }
  },
  {
    id: 'doc-4',
    content: 'Student life at SFIT is vibrant with various technical and cultural clubs. The college organizes annual technical festival "Zealicon" and cultural fest "Aarohi". Students participate in national level competitions, research projects, and industrial visits.',
    augmentedContent: 'SFIT promotes holistic development through diverse extracurricular activities and events. Student life at SFIT is vibrant with various technical and cultural clubs. The college organizes annual technical festival "Zealicon" and cultural fest "Aarohi". Students participate in national level competitions, research projects, and industrial visits. These activities enhance practical learning and personality development.',
    summary: 'SFIT offers vibrant student life with technical fest Zealicon, cultural fest Aarohi, and various clubs.',
    metadata: {
      url: 'https://sfit.ac.in/student-life/activities',
      title: 'Student Activities',
      section: 'student-life'
    }
  }
];