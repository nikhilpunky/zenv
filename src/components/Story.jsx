import React, { useEffect, useRef, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ArrowRight } from 'lucide-react';

/* ─── Scroll reveal hook ─────────────────────────────────────────────────── */
function useScrollReveal(rootRef) {
  useEffect(() => {
    const els = rootRef.current?.querySelectorAll('[data-sr]') ?? [];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const delay = Number(e.target.dataset.srDelay ?? 0);
            setTimeout(() => e.target.classList.add('sr-in'), delay);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function Story() {
  const ref = useRef(null);
  const { homepageSettings } = useContext(AppContext);
  useScrollReveal(ref);

  const storyOneParagraphs = homepageSettings?.storyOneBody 
    ? homepageSettings.storyOneBody.split('\n').filter(Boolean)
    : [
        'VESPERA was born from a simple conviction — that luxury fragrance should be within reach, without ever sacrificing craft, quality, or design.',
        'Every bottle is developed with intention, using premium ingredients and housed in packaging that honours the art of presentation.',
        'We believe fragrance is far more than scent. It is a translation of memory, an invisible portrait — and ultimately, an expression of absolute identity.'
      ];

  const storyTwoParagraphs = homepageSettings?.storyTwoBody 
    ? homepageSettings.storyTwoBody.split('\n').filter(Boolean)
    : [
        "Our creations draw inspiration from timeless traditions and the world's most exquisite natural ingredients.",
        'From carefully sourced botanicals to our meticulous blending process, every detail reflects our commitment to authenticity, sustainability, and the pursuit of olfactory perfection.'
      ];

  // Split title lines by dot or custom formatting if helpful
  const storyOneHeadingLines = homepageSettings?.storyOneHeading ? homepageSettings.storyOneHeading.split('\n') : ['Crafted to Leave a', 'Lasting Impression.'];
  const storyTwoHeadingLines = homepageSettings?.storyTwoHeading ? homepageSettings.storyTwoHeading.split('\n') : ['Rooted in Tradition.', 'Refined for Today.'];

  return (
    <article id="story" className="os-page" ref={ref} aria-label="Our Story">

      {/* ── Page heading ─────────────────────────────────────────────── */}
      <header className="os-page-header" data-sr data-sr-delay="0">
        <span className="os-overline">{homepageSettings?.storyTitle || 'Our Story'}</span>
        <div className="os-header-rule" aria-hidden="true" />
      </header>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1 — Image Left 55% · Content Right 45%
      ══════════════════════════════════════════════════════════════ */}
      <section className="os-section os-section--img-left" aria-label="Crafted to Leave a Lasting Impression">

        {/* Image */}
        <div className="os-img-pane" data-sr data-sr-delay="0">
          <div className="os-img-frame">
            <img
              src={homepageSettings?.storyOneImage || '/assets/story_one.png'}
              alt="Master perfumer measuring fragrance extracts in a atelier"
              className="os-img"
              loading="lazy"
              onError={(e) => { e.target.src = '/assets/story_one.png'; }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="os-content-pane" data-sr data-sr-delay="160">
          <h2 className="os-heading">
            {storyOneHeadingLines.map((line, idx) => {
              const parts = line.split(/(lasting)/i);
              return (
                <React.Fragment key={idx}>
                  {parts.map((part, pIdx) =>
                    part.toLowerCase() === 'lasting' ? <em key={pIdx}>{part}</em> : part
                  )}
                  {idx < storyOneHeadingLines.length - 1 && <br />}
                </React.Fragment>
              );
            })}
          </h2>
          <div className="os-rule" aria-hidden="true" />
          
          {storyOneParagraphs.map((pText, i) => (
            <p key={i} className="os-body">{pText}</p>
          ))}

          <a href="#collection" className="os-cta" aria-label="Discover our journey">
            <span className="os-cta-label">Discover Our Journey</span>
            <ArrowRight size={15} strokeWidth={1.6} className="os-cta-arrow" aria-hidden="true" />
          </a>
        </div>

      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2 — Content Left 45% · Image Right 55%
      ══════════════════════════════════════════════════════════════ */}
      <section className="os-section os-section--img-right" aria-label="Our Heritage">

        {/* Content */}
        <div className="os-content-pane" data-sr data-sr-delay="0">
          <span className="os-eyebrow">{homepageSettings?.storyTitle || 'Our Story'}</span>
          <h2 className="os-heading">
            {storyTwoHeadingLines.map((line, idx) => {
              if (line.toLowerCase().includes('refined')) {
                return (
                  <React.Fragment key={idx}>
                    Rooted in Tradition.<br />
                    <em>Refined</em> for Today.
                  </React.Fragment>
                );
              }
              return (
                <React.Fragment key={idx}>
                  {line}
                  {idx < storyTwoHeadingLines.length - 1 && <br />}
                </React.Fragment>
              );
            })}
          </h2>
          <div className="os-rule" aria-hidden="true" />

          {storyTwoParagraphs.map((pText, i) => (
            <p key={i} className="os-body">{pText}</p>
          ))}

          <a href="#highlights" className="os-cta" aria-label="Explore our heritage">
            <span className="os-cta-label">Explore Our Heritage</span>
            <ArrowRight size={15} strokeWidth={1.6} className="os-cta-arrow" aria-hidden="true" />
          </a>
        </div>

        {/* Image */}
        <div className="os-img-pane" data-sr data-sr-delay="160">
          <div className="os-img-frame">
            <img
              src={homepageSettings?.storyTwoImage || '/assets/story_two.png'}
              alt="Luxury raw perfume ingredients"
              className="os-img"
              loading="lazy"
              onError={(e) => { e.target.src = '/assets/story_two.png'; }}
            />
          </div>
        </div>

      </section>

    </article>
  );
}
