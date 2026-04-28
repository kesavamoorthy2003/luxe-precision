import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0a0a0f] text-white pt-20 pb-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <span className="text-xl font-black tracking-[0.2em] text-white uppercase">
                Luxe<span className="text-blue-500">Precision</span>
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-sm font-light">
              Elevating everyday essentials through curated design, precision engineering, and uncompromising quality. Discover the intersection of high fashion and technology.
            </p>
            <div className="flex gap-4">
              {[
                { label: 'Facebook', href: '#', svgProps: { fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
                { label: 'Twitter', href: '#', svgProps: { fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, path: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z' },
                { label: 'Instagram', href: 'https://www.instagram.com/kesav_reigns', svgProps: { fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, path: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zm1.5-4.87h.01M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2z' },
                { label: 'WhatsApp', href: 'https://wa.me/917845140257', svgProps: { fill: 'currentColor', stroke: 'none' }, path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z' }
              ].map(({ label, href, svgProps, path }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" {...svgProps}>
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-sm font-bold tracking-widest uppercase mb-6">Customer Care</h4>
            <ul className="space-y-4">
              {['Contact Specialist', 'Shipping & Delivery', 'Returns & Exchanges', 'Track Order', 'Size Guide'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-white/50 text-sm hover:text-blue-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies & Legal */}
          <div>
            <h4 className="text-sm font-bold tracking-widest uppercase mb-6">Policies</h4>
            <ul className="space-y-4">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Sustainability', 'Accessibility'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-white/50 text-sm hover:text-blue-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="lg:col-span-1">
            <h4 className="text-sm font-bold tracking-widest uppercase mb-6">Contact</h4>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-white/50 text-sm">
                <MapPin size={18} className="shrink-0 text-blue-500" />
                <span>Tamil Nadu, Dindigul, India</span>
              </li>
              <li className="flex items-center gap-3 text-white/50 text-sm">
                <Phone size={18} className="shrink-0 text-blue-500" />
                <a href="tel:+917845140257" className="hover:text-blue-400 transition-colors">+91 7845140257</a>
              </li>
              <li className="flex items-center gap-3 text-white/50 text-sm">
                <Mail size={18} className="shrink-0 text-blue-500" />
                <a href="mailto:kesavanroman50@gmail.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">kesavanroman50@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 text-xs text-white/40">
          <p>© {currentYear} Luxe Precision Digital Boutique. All Rights Reserved.</p>
          <div className="flex gap-3 mt-4 md:mt-0">
            {['Visa', 'Mastercard', 'PayPal', 'UPI'].map((pm) => (
              <span key={pm} className="text-[10px] border border-white/20 text-white/40 px-3 py-1 rounded">{pm}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}