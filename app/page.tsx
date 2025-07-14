'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { FiBookmark, FiEdit, FiLock, FiZap, FiCheckCircle } from 'react-icons/fi';

export default function Home() {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  const slideUp = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  return (
    <>
      <Head>
        <title>Notebook | Premium Note & Bookmark Manager</title>
        <meta name="description" content="All-in-one solution for your notes and bookmarks with premium features" />
      </Head>

      {/* Hero Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50"
      >
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center">
            <motion.div variants={slideUp}>
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg mx-auto mb-6">
                <span className="text-4xl">📓</span>
              </div>
            </motion.div>
            <motion.h1 variants={slideUp} className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Organize Your Digital Life
            </motion.h1>
            <motion.p variants={slideUp} className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto">
              The premium workspace for your notes and bookmarks. Fast, beautiful, and private.
            </motion.p>
            <motion.div variants={slideUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/signup" 
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-lg transition-all transform hover:-translate-y-1"
              >
                Get Started - It's Free
              </Link>
              <Link 
                href="/login" 
                className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-lg shadow-lg transition-all transform hover:-translate-y-1"
              >
                Existing User? Login
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Everything you need to stay organized</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <FiEdit className="text-indigo-600 text-4xl" />,
                title: "Smart Notes",
                desc: "Rich text editing with markdown support and organization tools"
              },
              {
                icon: <FiBookmark className="text-purple-600 text-4xl" />,
                title: "Bookmark Manager",
                desc: "Save, tag and search your web resources with smart previews"
              },
              {
                icon: <FiLock className="text-green-600 text-4xl" />,
                title: "End-to-End Encrypted",
                desc: "Your data is protected with industry-leading security"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:w-1/2"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-indigo-100 rounded-2xl opacity-50"></div>
                <div className="relative bg-white p-8 rounded-xl shadow-lg">
                  <FiZap className="text-yellow-500 text-4xl mb-4" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Lightning Fast</h2>
                  <p className="text-gray-600 mb-6">Built with modern technologies to ensure snappy performance even with thousands of entries.</p>
                  <div className="space-y-3">
                    {[
                      "Instant search across all your content",
                      "Optimized database architecture",
                      "Progressive Web App capabilities"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <FiCheckCircle className="text-green-500" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:w-1/2"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Performance Meets Elegance</h2>
              <p className="text-xl text-gray-600 mb-8">We've optimized every aspect of Notebook to ensure buttery smooth interactions while maintaining a beautiful, distraction-free interface.</p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: "99.9%", label: "Uptime" },
                  { value: "≤100ms", label: "Response Time" },
                  { value: "256-bit", label: "Encryption" },
                  { value: "100%", label: "Privacy" }
                ].map((stat, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white p-4 rounded-lg shadow-md text-center"
                  >
                    <div className="text-2xl font-bold text-indigo-600">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Transform Your Productivity?</h2>
            <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">Join thousands of professionals who trust Notebook with their ideas and resources.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/signup" 
                className="px-8 py-4 bg-white hover:bg-gray-100 text-indigo-600 font-bold rounded-lg shadow-xl transition-all transform hover:scale-105"
              >
                Start Free Trial
              </Link>
              <Link 
                href="/features" 
                className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:bg-opacity-10 font-medium rounded-lg transition-all transform hover:scale-105"
              >
                Explore Features
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <span className="text-2xl">📓</span>
              <span className="text-xl font-bold text-white">Notebook</span>
            </div>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition">Terms</Link>
              <Link href="/contact" className="hover:text-white transition">Contact</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            © {new Date().getFullYear()} Notebook. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  )
}