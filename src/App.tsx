import React, { useState, useRef, useEffect } from 'react';
import { ChatWidget } from './components/ChatWidget';
import { GraduationCap, Users, BookOpen, Award, MapPin, Phone, Mail } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <GraduationCap size={40} className="text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">St. Francis Institute of Technology</h1>
              <p className="text-lg text-gray-600">Engineering Excellence Since 1999</p>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6">Shape Your Engineering Future</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join SFIT's legacy of excellence in engineering education. With state-of-the-art facilities, 
            industry partnerships, and a commitment to innovation, we prepare you for tomorrow's challenges.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Apply Now
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Virtual Tour
            </button>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <Users size={48} className="text-blue-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-800 mb-2">2500+</h3>
              <p className="text-gray-600">Students Enrolled</p>
            </div>
            <div className="p-6">
              <BookOpen size={48} className="text-green-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-800 mb-2">5</h3>
              <p className="text-gray-600">Engineering Branches</p>
            </div>
            <div className="p-6">
              <Award size={48} className="text-purple-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-800 mb-2">95%</h3>
              <p className="text-gray-600">Placement Rate</p>
            </div>
            <div className="p-6">
              <GraduationCap size={48} className="text-orange-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-800 mb-2">25+</h3>
              <p className="text-gray-600">Years of Excellence</p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Engineering Programs</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our comprehensive range of engineering disciplines, each designed to meet industry demands.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Computer Engineering', desc: 'Software development, AI, and system design' },
              { name: 'Information Technology', desc: 'Database systems, networking, and cybersecurity' },
              { name: 'Electronics & Telecom', desc: 'Communication systems and embedded technologies' },
              { name: 'Mechanical Engineering', desc: 'Design, manufacturing, and automation' },
              { name: 'Civil Engineering', desc: 'Infrastructure, construction, and urban planning' },
              { name: 'Postgraduate Programs', desc: 'Advanced specializations and research' }
            ].map((program, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{program.name}</h3>
                <p className="text-gray-600 mb-4">{program.desc}</p>
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  Learn More →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-600">
              Have questions? Our admissions team is here to help.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <MapPin size={32} className="text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">Visit Us</h3>
              <p className="text-gray-600">
                Mount Poinsur, S.V.P. Road<br />
                Borivali West, Mumbai - 400103
              </p>
            </div>
            <div className="p-6">
              <Phone size={32} className="text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">Call Us</h3>
              <p className="text-gray-600">
                +91 22 2890 2735<br />
                +91 22 2890 7324
              </p>
            </div>
            <div className="p-6">
              <Mail size={32} className="text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">Email Us</h3>
              <p className="text-gray-600">
                admissions@sfit.ac.in<br />
                info@sfit.ac.in
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap size={24} className="text-blue-400" />
                <span className="font-bold text-lg">SFIT</span>
              </div>
              <p className="text-gray-400">
                Empowering minds, shaping futures through quality engineering education.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Admissions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Academics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Placements</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Campus Life</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Programs</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Computer Engineering</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Information Technology</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Electronics & Telecom</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mechanical Engineering</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">YouTube</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 St. Francis Institute of Technology. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* Chat Widget */}
      <ChatWidget position="bottom-right" />
    </div>
  );
}

export default App;