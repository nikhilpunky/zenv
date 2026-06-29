import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { X, ArrowRight, ArrowLeft, RefreshCw, ShoppingBag } from 'lucide-react';

export default function FragranceFinder() {
  const { 
    isFinderOpen, 
    setIsFinderOpen, 
    products, 
    addToCart,
    setQuickViewProduct
  } = useContext(AppContext);

  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({
    profile: '',
    occasion: '',
    intensity: ''
  });

  if (!isFinderOpen) return null;

  const QUESTIONS = [
    {
      step: 1,
      question: "Which scent profile resonates with you the most?",
      field: 'profile',
      options: [
        { value: 'floral', label: 'Floral & Romantic', desc: 'Freshly cut roses, peony petals, and soft floral fields.' },
        { value: 'woody', label: 'Woody & Warm', desc: 'Creamy sandalwood, aromatic amber, cedar logs, and spices.' },
        { value: 'fresh', label: 'Fresh & Sparkling', desc: 'Zesty bergamot, clean citrus slices, and green leaves.' },
        { value: 'musky', label: 'Soft & Luminous', desc: 'Powdery white musk, jasmine vines, and solar warmth.' }
      ]
    },
    {
      step: 2,
      question: "Where do you see yourself wearing this signature fragrance?",
      field: 'occasion',
      options: [
        { value: 'daily', label: 'Daily Wear & Office', desc: 'Clean, subtle, and non-intrusive for professional settings.' },
        { value: 'evening', label: 'Evening Events & Gala', desc: 'Smoky, commanding, and projection-heavy for special nights.' },
        { value: 'romantic', label: 'Date Nights & Intimacy', desc: 'Sophisticated, sensual, and drawing people closer.' },
        { value: 'anytime', label: 'Versatile / Signature scent', desc: 'An all-rounder that transitions effortlessly from day to night.' }
      ]
    },
    {
      step: 3,
      question: "What is your preferred fragrance projection strength?",
      field: 'intensity',
      options: [
        { value: 'light', label: 'Subtle & Intimate', desc: 'Sits close to the skin, offering a clean personal aura.' },
        { value: 'medium', label: 'Moderate & Balanced', desc: 'Noticeable trails without overwhelming the room.' },
        { value: 'strong', label: 'Intense & Unforgettable', desc: 'Strong silage, leaving a lasting impression in your wake.' }
      ]
    }
  ];

  const handleSelectOption = (field, value) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
      setCurrentStep(4); // Show result page
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setAnswers({ profile: '', occasion: '', intensity: '' });
    setCurrentStep(1);
  };

  // Recommendation engine logic
  const getRecommendation = () => {
    const { profile, occasion, intensity } = answers;

    // Default to discovery collection if they want everything
    if (occasion === 'anytime' && intensity === 'medium') {
      return products.find(p => p.id === 'discovery-set');
    }

    if (profile === 'floral') {
      return products.find(p => p.id === 'rose-blanche') || products[1];
    }
    
    if (profile === 'woody') {
      if (intensity === 'strong' || occasion === 'evening') {
        return products.find(p => p.id === 'oud-imperial') || products[4];
      }
      return products.find(p => p.id === 'santal-dor') || products[2];
    }
    
    if (profile === 'fresh') {
      return products.find(p => p.id === 'citrus-noir') || products[3];
    }
    
    if (profile === 'musky') {
      return products.find(p => p.id === 'ambre-soleil') || products[5];
    }

    // Fallback default
    return products.find(p => p.id === 'discovery-set');
  };

  const recommendedProduct = getRecommendation();
  const progressPercent = ((currentStep - 1) / 3) * 100;

  return (
    <div className="modal-overlay" onClick={() => setIsFinderOpen(false)}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px' }}
      >
        <button 
          className="modal-close-btn" 
          onClick={() => setIsFinderOpen(false)}
          aria-label="Close Finder"
        >
          <X size={18} />
        </button>

        <div className="finder-container">
          
          {currentStep <= 3 ? (
            <>
              {/* Header */}
              <span className="hero-subtitle">Scent Matcher</span>
              <h2 className="finder-question">
                {QUESTIONS[currentStep - 1].question}
              </h2>

              {/* Progress Bar */}
              <div className="finder-progress-bar">
                <div 
                  className="finder-progress-fill" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Options */}
              <div className="finder-options">
                {QUESTIONS[currentStep - 1].options.map((option) => (
                  <button
                    key={option.value}
                    className={`finder-option-btn ${answers[QUESTIONS[currentStep - 1].field] === option.value ? 'selected' : ''}`}
                    onClick={() => handleSelectOption(QUESTIONS[currentStep - 1].field, option.value)}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                        {option.label}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-light)' }}>
                        {option.desc}
                      </div>
                    </div>
                    <ArrowRight size={16} style={{ color: 'var(--color-gold)' }} />
                  </button>
                ))}
              </div>

              {/* Nav */}
              <div className="finder-nav">
                <button 
                  className="btn-outline" 
                  style={{ padding: '0.6rem 1.5rem', display: currentStep === 1 ? 'none' : 'flex', alignItems: 'center', gap: '0.5rem' }}
                  onClick={handlePrevStep}
                >
                  <ArrowLeft size={14} /> Back
                </button>
              </div>
            </>
          ) : (
            // Results State
            <div className="animate-fade-in">
              <span className="hero-subtitle">Your Perfect Match</span>
              <h2 className="finder-header-title">The Results Are In.</h2>
              <p className="finder-header-subtitle">
                Based on your preferences, we recommend experiencing:
              </p>

              {recommendedProduct && (
                <>
                  <div className="finder-result-card">
                    <img 
                      src={recommendedProduct.image} 
                      alt={recommendedProduct.name} 
                      className="finder-result-image"
                    />
                    <div className="finder-result-info">
                      <span className="finder-result-type">
                        {recommendedProduct.type} • {recommendedProduct.size}
                      </span>
                      <h3 className="finder-result-title">{recommendedProduct.name}</h3>
                      <p style={{ fontSize: '0.78rem', color: 'var(--color-gold-deep)', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                        {recommendedProduct.notes}
                      </p>
                      <p className="finder-result-desc">{recommendedProduct.description}</p>
                      
                      <div className="finder-result-actions">
                        <button 
                          className="btn-outline" 
                          style={{ padding: '0.6rem 1.2rem', fontSize: '0.75rem' }}
                          onClick={() => {
                            setIsFinderOpen(false);
                            setQuickViewProduct(recommendedProduct);
                          }}
                        >
                          View Details
                        </button>
                        <button 
                          className="btn-primary" 
                          style={{ padding: '0.6rem 1.2rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                          onClick={() => {
                            addToCart(recommendedProduct, 1);
                            setIsFinderOpen(false);
                          }}
                        >
                          <ShoppingBag size={14} /> Add to Cart — ₹{recommendedProduct.price}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                    <button 
                      className="btn-outline"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.5rem' }}
                      onClick={handleReset}
                    >
                      <RefreshCw size={14} /> Retake Quiz
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
