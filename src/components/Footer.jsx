import { Link } from 'react-router-dom';
import { Ticket, Mail, Phone, Facebook, CreditCard } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Logo & Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Ticket className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">
                Ticket<span className="text-primary">Bari</span>
              </span>
            </Link>
            <p className="text-background/70 text-sm leading-relaxed">
              Book bus, train, launch & flight tickets easily. Your trusted
              travel companion for hassle-free journeys across Bangladesh.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'All Tickets', path: '/tickets' },
                { name: 'Contact Us', path: '/contact' },
                { name: 'About', path: '/about' },
              ].map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-background/70 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:support@ticketbari.com"
                  className="flex items-center gap-2 text-background/70 hover:text-primary transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" />
                  support@ticketbari.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+8801700000000"
                  className="flex items-center gap-2 text-background/70 hover:text-primary transition-colors text-sm"
                >
                  <Phone className="w-4 h-4" />
                  +880 1700-000000
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com/ticketbari"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-background/70 hover:text-primary transition-colors text-sm"
                >
                  <Facebook className="w-4 h-4" />
                  Facebook Page
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Payment Methods */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Payment Methods</h4>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-background/10 rounded-lg">
                <CreditCard className="w-5 h-5" />
                <span className="text-sm font-medium">Stripe</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-background/10 rounded-lg">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                  alt="Visa"
                  className="h-4"
                />
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-background/10 rounded-lg">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg"
                  alt="Mastercard"
                  className="h-5"
                />
              </div>
            </div>
            <p className="text-background/50 text-xs mt-4">
              Secure payments powered by Stripe
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/10 mt-10 pt-6">
          <p className="text-center text-background/60 text-sm">
            © 2025 TicketBari. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
