import React from 'react';
import BookingWizard from '../components/BookingWizard';

const BookService = () => {
    return (
        <div className="book-page">
            <div className="book-hero">
                <h1 className="page-title">Reserve Your <span className="gradient-text">Experience</span></h1>
                <p className="page-subtitle"> secure your slot for a flawless draping session.</p>
            </div>

            <div className="wizard-container fade-in-up">
                <BookingWizard />
            </div>

            <style jsx="true">{`
        .book-page {
          padding-top: 100px; /* Space for fixed navbar */
          min-height: 100vh;
          background-image: radial-gradient(circle at 10% 20%, rgba(212, 175, 55, 0.05) 0%, transparent 20%);
        }

        .book-hero {
          text-align: center;
          padding: 40px 20px;
        }

        .page-title {
          font-size: 3rem;
          margin-bottom: 16px;
          color: var(--secondary-velvet);
        }

        .page-subtitle {
          color: var(--text-muted);
          font-size: 1.1rem;
        }

        .wizard-container {
          position: relative;
          z-index: 10;
        }

        .fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default BookService;
