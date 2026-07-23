document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Header Scroll Effect
  // ==========================================
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ==========================================
  // 2. Mobile Menu Navigation Toggle
  // ==========================================
  const mobileToggle = document.getElementById('mobile-toggle-btn');
  const mobileClose = document.getElementById('mobile-close-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  const openMobileMenu = () => {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden'; // Disable scroll when menu open
  };

  const closeMobileMenu = () => {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  };

  mobileToggle.addEventListener('click', openMobileMenu);
  mobileClose.addEventListener('click', closeMobileMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // ==========================================
  // 3. Interactive Sandbox Playground
  // ==========================================
  const sandboxInput = document.getElementById('sandbox-input');
  const sandboxBtn = document.getElementById('sandbox-btn');
  const suggestionTags = document.querySelectorAll('.suggestion-tag');
  
  const statePlaceholder = document.getElementById('sandbox-state-placeholder');
  const stateLoader = document.getElementById('sandbox-state-loader');
  const stateOutput = document.getElementById('sandbox-state-output');
  const progressBar = document.getElementById('generator-progress');
  const loaderStatus = document.getElementById('loader-status-text');
  
  const outputBadge = document.getElementById('output-badge-style');
  const outputName = document.getElementById('output-prompt-name');
  const outputValTime = document.getElementById('output-val-time');

  // Generation status text phases
  const loadingPhases = [
    { progress: 10, text: 'Tokenizing prompt input descriptor...' },
    { progress: 30, text: 'Constructing bounding boxes & voxels...' },
    { progress: 55, text: 'Synthesizing marching cubes mesh topology...' },
    { progress: 75, text: 'Baking high-resolution PBR texture maps...' },
    { progress: 90, text: 'Refining vertex colors & baking light maps...' },
    { progress: 100, text: 'Finalizing GLTF export bundle...' }
  ];

  // Visual database maps for custom images/shades based on keyword matching
  const generateMockOutput = (promptText) => {
    const text = promptText.toLowerCase();
    let bgImage = 'assets/feature-1.png'; // default fallback image
    let hueShift = '0deg';
    let saturate = '1';
    let generationTime = '0.74s';
    let badgeText = 'Subdivided Mesh';

    if (text.includes('cyberpunk') || text.includes('tokyo') || text.includes('synthwave')) {
      bgImage = 'assets/feature-1.png';
      hueShift = '280deg'; // Purple neon synthwave theme
      saturate = '1.5';
      generationTime = '0.62s';
      badgeText = 'Sci-Fi Voxel';
    } else if (text.includes('temple') || text.includes('jungle') || text.includes('forest') || text.includes('treehouse')) {
      bgImage = 'assets/feature-1.png';
      hueShift = '100deg'; // Lush green forest theme
      saturate = '1.2';
      generationTime = '0.88s';
      badgeText = 'Organic Asset';
    } else if (text.includes('mars') || text.includes('dust') || text.includes('red') || text.includes('desert')) {
      bgImage = 'assets/hero.png';
      hueShift = '330deg'; // Reddish/Orange space environment
      saturate = '1.4';
      generationTime = '0.95s';
      badgeText = 'Baked Environment';
    } else {
      // General random variation for user input
      bgImage = 'assets/hero.png';
      hueShift = '190deg'; // Cyan space style
      generationTime = '0.81s';
      badgeText = 'Generative Mesh';
    }

    return { bgImage, hueShift, saturate, generationTime, badgeText };
  };

  const startMeshGeneration = () => {
    const prompt = sandboxInput.value.trim();
    if (!prompt) {
      alert('Please enter a description first.');
      return;
    }

    // Deactivate interactive states
    sandboxBtn.disabled = true;
    statePlaceholder.style.display = 'none';
    stateOutput.classList.remove('active');
    
    // Activate loading state
    stateLoader.style.display = 'block';
    progressBar.style.width = '0%';
    
    let currentStep = 0;
    
    const interval = setInterval(() => {
      if (currentStep < loadingPhases.length) {
        const stepInfo = loadingPhases[currentStep];
        progressBar.style.width = `${stepInfo.progress}%`;
        loaderStatus.textContent = stepInfo.text;
        currentStep++;
      } else {
        clearInterval(interval);
        
        // Compute mock rendering configurations
        const outputConfig = generateMockOutput(prompt);

        // Populate values
        outputBadge.textContent = outputConfig.badgeText;
        outputName.textContent = prompt;
        outputValTime.textContent = outputConfig.generationTime;

        // Apply dynamically shifting graphics
        stateOutput.style.backgroundImage = `url('${outputConfig.bgImage}')`;
        stateOutput.style.filter = `hue-rotate(${outputConfig.hueShift}) saturate(${outputConfig.saturate})`;

        // Render output display state
        stateLoader.style.display = 'none';
        stateOutput.classList.add('active');
        sandboxBtn.disabled = false;
      }
    }, 450); // Generates over approx 2.7s
  };

  sandboxBtn.addEventListener('click', startMeshGeneration);

  // Suggestion Tags Handler
  suggestionTags.forEach(tag => {
    tag.addEventListener('click', () => {
      const selectedPrompt = tag.getAttribute('data-prompt');
      sandboxInput.value = selectedPrompt;
      startMeshGeneration();
    });
  });

  // ==========================================
  // 4. Monthly/Yearly Pricing Switcher
  // ==========================================
  const billingSwitcher = document.getElementById('billing-switcher');
  const labelMonthly = document.getElementById('label-monthly');
  const labelYearly = document.getElementById('label-yearly');
  
  const priceStarter = document.getElementById('price-starter');
  const pricePro = document.getElementById('price-pro');
  const priceEnterprise = document.getElementById('price-enterprise');

  billingSwitcher.addEventListener('change', () => {
    const isYearly = billingSwitcher.checked;
    
    if (isYearly) {
      labelMonthly.classList.remove('active');
      labelYearly.classList.add('active');
      
      // Update with discounted prices
      animatePriceChange(pricePro, 39);
      animatePriceChange(priceEnterprise, 159);
    } else {
      labelMonthly.classList.add('active');
      labelYearly.classList.remove('active');
      
      // Update back to monthly standard prices
      animatePriceChange(pricePro, 49);
      animatePriceChange(priceEnterprise, 199);
    }
  });

  // Mini animation numbers transition helper
  const animatePriceChange = (element, targetPrice) => {
    let currentVal = parseInt(element.textContent);
    const diff = targetPrice - currentVal;
    if (diff === 0) return;

    const step = diff > 0 ? 1 : -1;
    const duration = 200; // total animation time in ms
    const delay = Math.abs(duration / diff);

    const counter = setInterval(() => {
      currentVal += step;
      element.textContent = currentVal;
      if (currentVal === targetPrice) {
        clearInterval(counter);
      }
    }, Math.max(delay, 2));
  };

  // ==========================================
  // 5. FAQ Accordion Dropdowns
  // ==========================================
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const parent = question.parentElement;
      const isActive = parent.classList.contains('active');

      // Close all FAQs first
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // If clicked FAQ was not active, expand it
      if (!isActive) {
        parent.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ==========================================
  // 6. Reveal on Scroll Animation (Observer)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Stop observing once revealed
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px' // Fire slightly before element enters fully
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if observer not supported
    revealElements.forEach(el => el.classList.add('active'));
  }
});
