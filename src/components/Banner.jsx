import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Ban } from 'lucide-react';

const Banner = () => {
  const navigate = useNavigate();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const handleSearch = () => {
    navigate(`/tickets?from=${from}&to=${to}`);
  };

  return (
    <section className="relative min-h-[600px] hero-gradient overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-4 py-2 mb-6 animate-fade-in">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm text-primary-foreground/80">
              Trusted by 100,000+ travelers
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 animate-slide-up">
            Book Your Next
            <span className="block text-gradient bg-gradient-to-r from-amber-400 to-orange-500">
              Adventure Today
            </span>
          </h1>

          <p
            className="text-lg md:text-xl text-primary-foreground/70 mb-10 max-w-2xl mx-auto animate-slide-up"
            style={{ animationDelay: '0.1s' }}
          >
            Discover and book bus, train, launch & flight tickets easily.
            Seamless travel experience at your fingertips.
          </p>

          {/* Search Box */}
          <div
            className="bg-card/95 backdrop-blur-sm rounded-2xl p-6 shadow-elevated max-w-3xl mx-auto animate-slide-up"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="From (Location)"
                  value={from}
                  onChange={e => setFrom(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="To (Location)"
                  value={to}
                  onChange={e => setTo(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <button
                onClick={handleSearch}
                className="accent-gradient hover:opacity-90 transition-opacity h-12 text-accent-foreground font-semibold rounded-lg flex items-center justify-center gap-2"
              >
                <Search className="h-5 w-5" />
                Search Tickets
              </button>
            </div>
          </div>

          {/* Stats */}
          <div
            className="flex flex-wrap justify-center gap-8 mt-12 animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            {[
              { value: '50K+', label: 'Happy Customers' },
              { value: '1000+', label: 'Routes Available' },
              { value: '24/7', label: 'Customer Support' },
              { value: '99%', label: 'On-time Departure' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-primary-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-primary-foreground/60">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wave Bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
};

export default Banner;
