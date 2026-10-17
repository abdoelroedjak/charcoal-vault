/* ═══════════════════════════════════════════════
   CHARCOAL VAULT — Interactions & Behavior
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  // ═══════════════════════════════════════════════
  // PRICING DATA STRUCTURE
  // ═══════════════════════════════════════════════
  //
  // All prices are per metric ton (1,000 kg).
  // markup: set to null — Charcoal Vault will add its own margin here.
  // finalBuyerPrice: computed from supplierPrice + markup when markup is set.
  //
  // To apply markup later, set markup to a number (USD/MT) or a function,
  // then call computeFinalPrices(). The UI will update automatically
  // via the getPriceDisplay() helper.

  var CV_PRICING = {
    currency: 'USD',
    unit: 'MT',
    unitLabel: 'Metric Ton (1,000 kg)',
    moq: '18 MT',
    moqTons: 18,
    lastUpdated: null, // set to ISO date string when prices change
    disclaimer: 'Prices are supplier-based reference prices and may fluctuate with raw material costs. Final quotations are confirmed based on current pricing, quantity, packaging requirements, and shipping terms.',

    terms: {
      EXW: {
        label: 'EXW',
        description: 'Ex Works — buyer arranges pickup and shipping',
        options: [
          {
            id: 'exw-goods-only',
            packaging: 'Goods Only + Inner Plastic',
            supplierPrice: 1450,
            pricingBasis: 'per_mt',
            shippingTerm: 'EXW',
            markup: null,
            finalBuyerPrice: null
          },
          {
            id: 'exw-masterbox',
            packaging: 'Masterbox Doublewall 10kg',
            supplierPrice: 1525,
            pricingBasis: 'per_mt',
            shippingTerm: 'EXW',
            markup: null,
            finalBuyerPrice: null
          },
          {
            id: 'exw-innerbox-masterbox',
            packaging: 'Innerbox 1kg + Masterbox 10kg',
            supplierPrice: 1575,
            pricingBasis: 'per_mt',
            shippingTerm: 'EXW',
            markup: null,
            finalBuyerPrice: null
          }
        ]
      },
      FOB: {
        label: 'FOB',
        description: 'Free on Board — price includes loading onto vessel',
        options: [
          {
            id: 'fob-goods-only',
            packaging: 'Goods Only + Inner Plastic',
            supplierPrice: 1475,
            pricingBasis: 'per_mt',
            shippingTerm: 'FOB',
            markup: null,
            finalBuyerPrice: null
          },
          {
            id: 'fob-masterbox',
            packaging: 'Masterbox Doublewall 10kg',
            supplierPrice: 1550,
            pricingBasis: 'per_mt',
            shippingTerm: 'FOB',
            markup: null,
            finalBuyerPrice: null
          },
          {
            id: 'fob-innerbox-masterbox',
            packaging: 'Innerbox 1kg + Masterbox 10kg',
            supplierPrice: 1600,
            pricingBasis: 'per_mt',
            shippingTerm: 'FOB',
            markup: null,
            finalBuyerPrice: null
          }
        ]
      }
    },

    // Reference price shown publicly (lowest available)
    referencePrice: {
      amount: 1450,
      term: 'EXW',
      packaging: 'Goods Only + Inner Plastic',
      note: 'Subject to current raw material pricing.'
    }
  };

  /**
   * Compute final buyer prices when markup is set.
   * Call this after setting markup values on any option.
   * Markup can be a flat USD amount or a percentage object { percent: 10 }.
   */
  function computeFinalPrices() {
    Object.keys(CV_PRICING.terms).forEach(function (termKey) {
      CV_PRICING.terms[termKey].options.forEach(function (opt) {
        if (opt.markup === null) {
          opt.finalBuyerPrice = null;
        } else if (typeof opt.markup === 'number') {
          opt.finalBuyerPrice = opt.supplierPrice + opt.markup;
        } else if (opt.markup && typeof opt.markup.percent === 'number') {
          opt.finalBuyerPrice = Math.round(opt.supplierPrice * (1 + opt.markup.percent / 100));
        }
      });
    });
  }

  /**
   * Returns the display price for a given option.
   * If finalBuyerPrice is set, returns that. Otherwise returns null
   * (UI should show "Price on request").
   */
  function getPriceDisplay(option) {
    if (option.finalBuyerPrice !== null) {
      return 'USD ' + option.finalBuyerPrice.toLocaleString() + ' / MT';
    }
    return null;
  }

  // Laboratory Proximate Test Analysis Data (ASTM Standards)
  var CV_LAB_SPECS = [
    {
      parameter: 'Moisture',
      unit: 'Pct',
      wetBasis: 5.43,
      dryBasis: null,
      method: 'ASTM D1762-84 (REAPPROVED 2021)'
    },
    {
      parameter: 'Ash Content',
      unit: 'Pct',
      wetBasis: 1.79,
      dryBasis: 1.89,
      method: 'ASTM D1762-84 (REAPPROVED 2021)'
    },
    {
      parameter: 'Volatile Matter',
      unit: 'Pct',
      wetBasis: 15.55,
      dryBasis: 16.44,
      method: 'ASTM D1762-84 (REAPPROVED 2021)'
    },
    {
      parameter: 'Fixed Carbon',
      unit: 'Pct',
      wetBasis: 77.23,
      dryBasis: 81.67,
      method: 'By Calculation'
    },
    {
      parameter: 'Gross Calorific Value',
      unit: 'Kcal/kg',
      wetBasis: 7211,
      dryBasis: 7625,
      method: 'ASTM D 5865-19'
    }
  ];

  // Expose for console/admin use (not public API)
  window.__CV_PRICING = CV_PRICING;
  window.__CV_LAB_SPECS = CV_LAB_SPECS;
  window.__CV_computePrices = computeFinalPrices;
  window.__CV_getPriceDisplay = getPriceDisplay;

  // ── DOM References ─────────────────────────
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileCta = document.getElementById('mobileCta');
  const contactForm = document.getElementById('contactForm');

  // ── Scroll State — Sticky Nav ──────────────
  let lastScroll = 0;
  let ticking = false;

  function onScroll() {
    const scrollY = window.scrollY;

    // Nav border on scroll
    if (scrollY > 20) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }

    // Mobile CTA visibility (show after scrolling past hero)
    if (mobileCta) {
      const heroHeight = document.getElementById('hero')?.offsetHeight || 600;
      if (scrollY > heroHeight * 0.7) {
        mobileCta.classList.add('is-visible');
      } else {
        mobileCta.classList.remove('is-visible');
      }
    }

    lastScroll = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });


  // ── Mobile Navigation ──────────────────────
  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      const isOpen = mobileNav.classList.contains('is-open');

      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileNav);
    });
  }

  function openMobileNav() {
    mobileNav.classList.add('is-open');
    navToggle.classList.add('is-active');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    mobileNav.classList.remove('is-open');
    navToggle.classList.remove('is-active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  // Close mobile nav on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
      closeMobileNav();
    }
  });


  // ── Smooth Scroll for Anchor Links ─────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = nav ? nav.offsetHeight : 0;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });

        // Close mobile nav if open
        if (mobileNav && mobileNav.classList.contains('is-open')) {
          closeMobileNav();
        }
      }
    });
  });


  // ── Reveal on Scroll (Intersection Observer) ─
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Stagger siblings slightly
          const parent = entry.target.parentElement;
          const siblings = parent ? parent.querySelectorAll('.reveal') : [];
          let delay = 0;

          siblings.forEach(function (sibling) {
            if (sibling === entry.target) {
              entry.target.style.transitionDelay = delay + 'ms';
            }
            if (!sibling.classList.contains('is-visible')) {
              delay += 80;
            }
          });

          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show all immediately
    reveals.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }


  // ── Contact & Form Handling ────────────────
  const TARGET_EMAIL = 'charcoalvault@gmail.com';
  const TARGET_WA_NUM = '6281294779925';
  const TARGET_WA_DISPLAY = '+62 812-9477-9925';
  const DEFAULT_WA_TEXT = 'Hello Charcoal Vault, I would like to inquire about shisha charcoal supply.';

  const PRODUCT_LABELS = {
    'cube-charcoal': 'Cube Charcoal',
    'bulk-supply': 'Bulk Supply',
    'other': 'Other / Special Request'
  };

  const directWaBtn = document.getElementById('directWaBtn');

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getFormDataValues() {
    if (!contactForm) return {};
    const formData = new FormData(contactForm);
    return {
      name: (formData.get('name') || '').trim(),
      business: (formData.get('business') || '').trim(),
      whatsapp: (formData.get('whatsapp') || '').trim(),
      email: (formData.get('email') || '').trim(),
      product: (formData.get('product') || '').trim(),
      quantity: (formData.get('quantity') || '').trim(),
      message: (formData.get('message') || '').trim()
    };
  }

  function buildInquiryMessage(data) {
    const productName = PRODUCT_LABELS[data.product] || data.product || 'Not specified';
    const lines = [
      'NEW B2B SUPPLY INQUIRY — CHARCOAL VAULT',
      '═══════════════════════════════════════',
      'Name: ' + (data.name || '-'),
      'Business / Brand: ' + (data.business || '-'),
      'Client WhatsApp: ' + (data.whatsapp || '-'),
      'Client Email: ' + (data.email || '-'),
      'Product: ' + productName,
      'Estimated Quantity: ' + (data.quantity || '18 MT (MOQ)'),
      '───────────────────────────────────────',
      'Message:',
      data.message || '(No additional message provided)',
      '═══════════════════════════════════════'
    ];
    return lines.join('\n');
  }

  function buildMailtoUrl(data) {
    const productName = PRODUCT_LABELS[data.product] || data.product || '';
    const subject = 'B2B Charcoal Supply Inquiry' + (productName ? ' [' + productName + ']' : '') + ' — ' + (data.name || 'Client');
    const body = buildInquiryMessage(data);
    return 'mailto:' + TARGET_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  function buildWhatsAppUrl(data) {
    if (data && (data.name || data.business || data.product || data.quantity || data.message)) {
      const productName = PRODUCT_LABELS[data.product] || data.product || '-';
      const msg =
        'Hello Charcoal Vault, I would like to submit a B2B supply inquiry:\n\n' +
        '• Name: ' + (data.name || '-') + '\n' +
        '• Business: ' + (data.business || '-') + '\n' +
        '• Product: ' + productName + '\n' +
        '• Quantity: ' + (data.quantity || '18 MT (MOQ)') + '\n' +
        '• Email: ' + (data.email || '-') + '\n' +
        '• My WhatsApp: ' + (data.whatsapp || '-') + '\n' +
        (data.message ? '• Notes: ' + data.message : '');
      return 'https://wa.me/' + TARGET_WA_NUM + '?text=' + encodeURIComponent(msg);
    }
    return 'https://wa.me/' + TARGET_WA_NUM + '?text=' + encodeURIComponent(DEFAULT_WA_TEXT);
  }

  function syncWaButton() {
    if (directWaBtn && contactForm) {
      const data = getFormDataValues();
      directWaBtn.href = buildWhatsAppUrl(data);
    }
  }

  if (contactForm) {
    contactForm.addEventListener('input', syncWaButton);
    contactForm.addEventListener('change', syncWaButton);
  }

  function completeLocalSubmission(data, mailtoUrl, waUrl, submitBtn, originalText, formStatus, isFallback) {
    submitBtn.textContent = 'INQUIRY READY';
    submitBtn.style.opacity = '1';
    submitBtn.style.background = '#1a3a22';
    submitBtn.style.borderColor = '#2d6a3f';

    // Trigger default email client pre-addressed to charcoalvault@gmail.com
    try {
      window.location.href = mailtoUrl;
    } catch (err) {
      console.warn('Mailto link navigation caught:', err);
    }

    if (formStatus) {
      formStatus.className = 'form-status form-status--success';
      const title = isFallback
        ? 'Inquiry Prepared for ' + TARGET_EMAIL
        : 'Inquiry Sent / Opened for ' + TARGET_EMAIL;
      const note = isFallback
        ? 'Automated web gateway is unavailable in this session. Your default email application has been opened with your inquiry pre-filled to <strong>' + TARGET_EMAIL + '</strong>.'
        : 'Your email application has been opened with your inquiry pre-filled and addressed to <strong>' + TARGET_EMAIL + '</strong>. (When hosted on your live domain, submissions route automatically in the background).';

      formStatus.innerHTML =
        '<strong>✓ ' + title + '</strong><br>' +
        note + '<br>' +
        '<div class="form-status__actions">' +
          '<a href="' + mailtoUrl + '" class="form-status__action-btn">Open in Email (' + TARGET_EMAIL + ')</a>' +
          '<a href="' + waUrl + '" target="_blank" rel="noopener noreferrer" class="form-status__action-btn">Chat on WhatsApp (' + TARGET_WA_DISPLAY + ')</a>' +
        '</div>';
    }

    contactForm.reset();
    syncWaButton();

    // Re-enable button cleanly so it never hangs
    setTimeout(function () {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      submitBtn.style.opacity = '';
      submitBtn.style.background = '';
      submitBtn.style.borderColor = '';
    }, 4000);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const submitBtn = document.getElementById('submitBtn') || contactForm.querySelector('button[type="submit"]');
      const formStatus = document.getElementById('formStatus');
      const originalText = submitBtn.textContent;

      const data = getFormDataValues();

      if (!data.name || !data.email) {
        if (formStatus) {
          formStatus.className = 'form-status form-status--error';
          formStatus.textContent = 'Please fill in both your Name and Email address.';
        }
        return;
      }

      submitBtn.textContent = 'SENDING INQUIRY...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      if (formStatus) {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
      }

      const mailtoUrl = buildMailtoUrl(data);
      const waUrl = buildWhatsAppUrl(data);

      // Check execution protocol:
      // If loaded via file://, browsers block cross-origin AJAX due to null origin,
      // and FormSubmit rejects file:// submissions. Handle locally with direct email + WhatsApp.
      const isLocalFile = window.location.protocol === 'file:';

      if (isLocalFile) {
        completeLocalSubmission(data, mailtoUrl, waUrl, submitBtn, originalText, formStatus, false);
        return;
      }

      // Hosted / Live web server (http: or https:)
      fetch('https://formsubmit.co/ajax/' + TARGET_EMAIL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: 'New Supply Inquiry — ' + data.name + (data.business ? ' [' + data.business + ']' : ''),
          _template: 'table',
          _captcha: 'false',
          name: data.name,
          business: data.business || 'N/A',
          whatsapp: data.whatsapp || 'N/A',
          email: data.email,
          product: PRODUCT_LABELS[data.product] || data.product || 'N/A',
          quantity: data.quantity || '18 MT (MOQ)',
          message: data.message || 'N/A'
        })
      })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('HTTP ' + response.status);
        }
        return response.json();
      })
      .then(function (result) {
        submitBtn.textContent = 'INQUIRY SENT TO EMAIL';
        submitBtn.style.opacity = '1';
        submitBtn.style.background = '#1a3a22';
        submitBtn.style.borderColor = '#2d6a3f';

        if (formStatus) {
          formStatus.className = 'form-status form-status--success';
          formStatus.innerHTML =
            '<strong>✓ Inquiry Sent to ' + TARGET_EMAIL + '</strong><br>' +
            'Thank you, ' + escapeHtml(data.name) + '. Your inquiry has been sent directly to our team. We will review and reply promptly.<br>' +
            '<div class="form-status__actions">' +
              '<a href="' + waUrl + '" target="_blank" rel="noopener noreferrer" class="form-status__action-btn">' +
                'Also message on WhatsApp (' + TARGET_WA_DISPLAY + ')' +
              '</a>' +
            '</div>';
        }

        contactForm.reset();
        syncWaButton();

        setTimeout(function () {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.opacity = '';
          submitBtn.style.background = '';
          submitBtn.style.borderColor = '';
        }, 7000);
      })
      .catch(function (error) {
        // Fallback gracefully without redirecting or breaking the page
        completeLocalSubmission(data, mailtoUrl, waUrl, submitBtn, originalText, formStatus, true);
      });
    });
  }


  // ── Initial State ──────────────────────────
  // Trigger scroll handler once on load
  onScroll();

})();
