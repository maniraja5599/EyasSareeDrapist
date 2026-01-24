import React from 'react';
import { Sparkles, Scissors, Clock, CheckCircle } from 'lucide-react';

const Services = () => {
    const services = [
        {
            title: 'Saree Pre-Pleating',
            description: 'Expertly folded and pressed pleats for easy draping in minutes.',
            icon: <Sparkles className="icon-gold" size={32} />,
            price: '₹250 - ₹500',
            duration: '30-45 mins'
        },
        {
            title: 'Draping Services',
            description: 'Professional on-site or in-studio draping for a flawless, elegant look.',
            icon: <Scissors className="icon-gold" size={32} />,
            price: '₹300 - ₹600',
            duration: '15-20 mins'
        },
        {
            title: 'Combo Package',
            description: 'The complete transformation: Pre-pleating followed by professional draping.',
            icon: <CheckCircle className="icon-gold" size={32} />,
            price: '₹500 - ₹900',
            tag: 'Best Value'
        }
    ];

    return (
        <section className="services-section">
            <div className="premium-container">
                <div className="section-header animate-fade-in">
                    <h2 className="section-title">Our <span className="gradient-text">Exquisite</span> Services</h2>
                    <p className="section-subtitle">Tailored perfection for every style and occasion.</p>
                </div>

                <div className="services-grid">
                    {services.map((service, index) => (
                        <div key={index} className="service-card glass-panel animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                            {service.tag && <span className="service-tag">{service.tag}</span>}
                            <div className="service-icon-wrapper">
                                {service.icon}
                            </div>
                            <h3 className="service-card-title">{service.title}</h3>
                            <p className="service-card-description">{service.description}</p>

                            <div className="service-meta">
                                <div className="meta-item">
                                    <Clock size={16} />
                                    <span>{service.duration || 'Flexible'}</span>
                                </div>
                            </div>

                            <div className="service-footer">
                                <span className="service-price">{service.price}</span>
                                <button className="btn-primary-sm">Book</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx="true">{`
        .services-section {
          padding: 100px 0;
          background-color: var(--accent-cream);
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-title {
          font-size: 2.5rem;
          margin-bottom: 16px;
        }

        .section-subtitle {
          color: var(--text-muted);
          font-size: 1.1rem;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }

        .service-card {
          padding: 40px;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: var(--transition-smooth);
        }

        .service-card:hover {
          transform: translateY(-10px);
          box-shadow: var(--shadow-lg);
        }

        .service-tag {
          position: absolute;
          top: 20px;
          right: 20px;
          background-color: var(--primary-gold);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .service-icon-wrapper {
          width: 64px;
          height: 64px;
          background: rgba(212, 175, 55, 0.1);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .icon-gold {
          color: var(--primary-gold);
        }

        .service-card-title {
          font-size: 1.5rem;
          margin-bottom: 16px;
        }

        .service-card-description {
          color: var(--text-muted);
          margin-bottom: 24px;
          flex-grow: 1;
        }

        .service-meta {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .service-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid rgba(0,0,0,0.05);
          padding-top: 24px;
        }

        .service-price {
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 1.25rem;
          color: var(--secondary-velvet);
        }

        .btn-primary-sm {
          background-color: var(--primary-gold);
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .btn-primary-sm:hover {
          background-color: var(--primary-gold-dark);
          transform: scale(1.05);
        }
      `}</style>
        </section>
    );
};

export default Services;
