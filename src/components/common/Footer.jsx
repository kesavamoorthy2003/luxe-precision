import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-[#2B3FE7] font-extrabold text-lg mb-3">LUXE PRECISION</p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Elevating everyday essentials through curated design and precision engineering.
            </p>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-4">
              Company
            </p>
            <ul className="space-y-3">
              {['Sustainability', 'Store Locator', 'Affiliate Program'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-xs text-gray-500 hover:text-[#2B3FE7] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-4">
              Support
            </p>
            <ul className="space-y-3">
              {['Shipping & Returns', 'Privacy Policy', 'Contact Specialist'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-xs text-gray-500 hover:text-[#2B3FE7] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-4">
              Newsletter
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email Address"
                className="flex-1 text-xs border border-gray-200 rounded px-3 py-2 
                  outline-none focus:border-[#2B3FE7] transition-colors"
              />
              <button className="bg-[#2B3FE7] text-white text-xs px-4 py-2 rounded 
                hover:bg-blue-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-gray-100 mt-10 pt-6">
          <p className="text-xs text-gray-400 text-center">
            © 2024 Luxe Precision Digital Boutique. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}