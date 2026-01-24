import React from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="hero-section">
      <div className="hero-overlay"></div>
      <div className="premium-container hero-content animate-fade-in">
        <div className="hero-text-area">
          <span className="hero-subtitle">PROFESSIONAL SAREE DRAPING & PRE-PLEATING</span>
          <h1 className="hero-title">
            The Art of <span className="gradient-text">Elegance</span> <br />
            Redefined.
          </h1>
          <p className="hero-description">
            Experience the finest saree pre-pleating and draping services in Namakkal.
            We transform your sarees into masterfully pleated layers for a flawless look.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate('/book')}>
              <Calendar size={18} style={{ marginRight: '8px' }} />
              Book Your Slot
            </button>
            <button className="btn-secondary-outline">
              Explore Services
              <ChevronRight size={18} style={{ marginLeft: '4px' }} />
            </button>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .hero-section {
          position: relative;
          min-height: 90vh;
          display: flex;
          align-items: center;
          background-image: url('${import.meta.env.BASE_URL}images/hero_bg_v3.png');
          /* background-color: black; */
          background-size: cover;
          background-position: center;
          color: white;
          overflow: hidden;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 100%);
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 2;
        }

        .hero-text-area {
          max-width: 700px;
        }

        .hero-subtitle {
          display: block;
          font-family: 'Outfit', sans-serif;
          font-weight: 500;
          letter-spacing: 0.2em;
          color: var(--primary-gold);
          margin-bottom: 20px;
          font-size: 0.9rem;
        }

        .hero-title {
          font-size: clamp(2.5rem, 8vw, 4.5rem);
          line-height: 1.1;
          margin-bottom: 24px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.5); /* Stronger shadow */
        }

        .hero-description {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.95); /* Increased opacity */
          margin-bottom: 40px;
          line-height: 1.8;
          max-width: 600px;
          text-shadow: 0 1px 4px rgba(0,0,0,0.6); /* Added shadow for readability */
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .btn-secondary-outline {
          background-color: transparent;
          color: white;
          padding: 12px 24px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-smooth);
          display: flex;
          align-items: center;
        }

        .btn-secondary-outline:hover {
          background-color: rgba(255, 255, 255, 0.1);
          border-color: white;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .hero-section {
            min-height: 80vh;
            text-align: center;
          }
          .hero-overlay {
            background: rgba(0,0,0,0.6);
          }
          .hero-text-area {
            margin: 0 auto;
          }
          .hero-actions {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Hero;
