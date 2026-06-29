import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Sparkles, Compass, Layers, Gift, Droplet, Grid } from 'lucide-react';

export default function CategoryNav() {
  const { activeCategory, setActiveCategory } = useContext(AppContext);

  const categories = [
    { id: 'WOMEN', label: "Women's Perfumes", icon: Sparkles },
    { id: 'MEN', label: "Men's Perfumes", icon: Compass },
    { id: 'UNISEX', label: "Unisex Fragrances", icon: Layers },
    { id: 'COMBOS', label: "Gift Sets & Combos", icon: Gift, scrollTarget: 'combo-builder' },
    { id: 'OILS', label: "Perfume Oils", icon: Droplet },
    { id: 'DISCOVERY', label: "Discovery Sets", icon: Grid }
  ];

  const handleCategorySelect = (cat) => {
    if (cat.scrollTarget) {
      const element = document.getElementById(cat.scrollTarget);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setActiveCategory(cat.id);
      const element = document.getElementById('collection');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="category-nav-bar">
      <div className="container category-nav-container">
        {/* All Category Button */}
        <button 
          className={`category-nav-btn ${activeCategory === 'ALL' ? 'active' : ''}`}
          onClick={() => setActiveCategory('ALL')}
        >
          <Layers size={22} />
          <span>All Fragrances</span>
        </button>

        {categories.map((cat) => {
          const IconComponent = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              className={`category-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleCategorySelect(cat)}
            >
              <IconComponent size={22} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
