// LuxePaws Premium E-commerce Logic with Supabase Backend & Multilingual Support (EN & TH)

// --- Supabase Credentials Configuration ---
// TO CONNECT TO YOUR DATABASE: Paste your Supabase project credentials below.
// If left blank, the website will automatically fall back to local mock data.
const SUPABASE_URL = 'https://oylfiyelvquejtswpbxu.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_XaV__6RxvquvwygZrW9HYw_l6Ct7Tfd'; 

let supabase = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("Supabase client initialized successfully.");
  } catch (e) {
    console.error("Failed to initialize Supabase client:", e);
  }
} else {
  console.log("Supabase credentials not configured. Running with local mock database fallback.");
}

// --- Local Mock Data Fallback ---
const localProducts = [
  {
    id: 1,
    title_en: "Nido Felt Dog Bed",
    title_th: "ที่นอนสุนัขใยสักหลาด Nido",
    price: 189.00,
    image_url: "assets/dog_bed.png",
    category: "dog",
    category_en: "Beds & Cushions",
    category_th: "ที่นอนและเบาะหนุน",
    badge_en: "Bestseller",
    badge_th: "ขายดีที่สุด",
    swatches: ["Grey", "Cream", "Charcoal"]
  },
  {
    id: 2,
    title_en: "Desco Oak Bowl Stand",
    title_th: "ที่วางชามข้าว Desco ไม้โอ๊ค",
    price: 99.00,
    image_url: "assets/pet_bowl.png",
    category: "accessories",
    category_en: "Feeding & Care",
    category_th: "การกินและการดูแล",
    badge_en: null,
    badge_th: null,
    swatches: ["Oak", "Ash Black"]
  },
  {
    id: 3,
    title_en: "Torre Cat Scratcher Tower",
    title_th: "คอนโดที่ฝนเล็บแมวรุ่น Torre",
    price: 249.00,
    image_url: "assets/cat_scratch.png",
    category: "cat",
    category_en: "Scratchers & Climbing",
    category_th: "ที่ฝนเล็บและการปีนป่าย",
    badge_en: "New",
    badge_th: "มาใหม่",
    swatches: ["Cream", "Grey"]
  }
];

// Active products array (loaded dynamically)
let activeProducts = [];
let isLoaded = false;

const translations = {
  en: {
    nav_shop_all: "Shop All",
    nav_dogs: "For Dogs",
    nav_cats: "For Cats",
    nav_story: "Our Story",
    hs1_title: "Nido Felt Dog Bed",
    hs1_desc: "Circular felt pet bed with plush cushion",
    quick_add: "Quick Add",
    hs2_title: "Desco Oak Bowl Stand",
    hs2_desc: "Minimalist wood & ceramic feeder stand",
    hero_subtitle: "New Collection",
    hero_title: "Beautiful Living With Your Pet",
    hero_desc: "Explore architectural design products and high-quality accessories that blend seamlessly into your home interior.",
    hero_cta: "Shop Now",
    slide2_sub: "Architectural Play",
    slide2_title: "Climbing Systems For Cats",
    slide2_desc: "Crafted with high-quality ash wood and cream sisal rope to keep your cat active without compromising your home's aesthetics.",
    slide3_sub: "Cozy Retreat",
    slide3_title: "Premium Fireplace Beds",
    slide3_desc: "Handcrafted dog beds built next to cozy fireplaces for ultimate warmth and designer pet luxury.",
    slide4_sub: "Aesthetic Utility",
    slide4_title: "Sleek Oak Food Feeder",
    slide4_desc: "Beautifully engineered double pet feeder stand that coordinates perfectly with modern kitchen interiors.",
    slide5_sub: "Editorial Sleeping",
    slide5_title: "Luxury Cat Cocoon Bed",
    slide5_desc: "Provide a cozy and private sanctuary for your cat with our architectural felt cat cave design.",
    
    col_subtitle: "Curated Spaces",
    col_title: "Designed for Comfort and Aesthetics",
    col1_sub: "Premium Comfort",
    col1_title: "Dog Beds & Cushions",
    explore: "Explore",
    col2_sub: "Architectural Play",
    col2_title: "Scratchers & Climbing",
    col3_sub: "Aesthetic Utility",
    col3_title: "Feeding & Bowls",
    shop_subtitle: "Product Catalog",
    shop_title: "Shop the Collection",
    filter_all: "All Products",
    filter_dog: "For Dogs",
    filter_cat: "For Cats",
    filter_acc: "Accessories",
    sort_label: "Sort:",
    sort_featured: "Featured",
    sort_low: "Price: Low to High",
    sort_high: "Price: High to Low",
    badge_bestseller: "Bestseller",
    badge_new: "New",
    add_to_bag: "Add to Bag",
    p1_title: "Nido Felt Dog Bed",
    p1_cat: "Beds & Cushions",
    p2_title: "Desco Oak Bowl Stand",
    p2_cat: "Feeding & Care",
    p3_title: "Torre Cat Scratcher Tower",
    p3_cat: "Scratchers & Climbing",
    story_subtitle: "Our Philosophy",
    story_title: "Designed for pets. Fits your style.",
    story_p1: "LuxePaws was born out of a desire to create products for dogs and cats that combine elegant, minimalist design with outstanding functionality.",
    story_p2: "We work with international designers and local manufacturers across Europe to select premium materials. From architectural cat climbing walls to felted nesting dog beds, every product is engineered for pet comfort while adding a timeless aesthetic to your modern home.",
    story_btn: "Discover Collection",
    news_title: "Join the LuxePaws Club",
    news_desc: "Subscribe to receive news about new product launches, designer collaborations, and exclusive invitations to pre-order collections.",
    news_placeholder: "Your Email Address",
    news_submit: "Subscribe",
    footer_desc: "Premium designer furniture and lifestyle accessories for dogs and cats. Form following comfort.",
    footer_col1_header: "Products",
    footer_col2_header: "Customer Care",
    footer_col3_header: "Follow Us",
    footer_ship: "Shipping & Returns",
    footer_care: "Materials & Care",
    footer_size: "Size Guide",
    footer_contact: "Contact Us",
    footer_copy: "© 2026 LuxePaws GmbH. All rights reserved.",
    footer_loc: "Designed with passion in Munich, Germany.",
    cart_header: "Your Shopping Bag",
    cart_empty: "Your bag is empty.",
    cart_subtotal_label: "Subtotal",
    cart_checkout: "Checkout",
    // Colors
    "Grey": "Grey",
    "Cream": "Cream",
    "Charcoal": "Charcoal",
    "Oak": "Oak",
    "Ash Black": "Ash Black",
    "Natural Cream": "Natural Cream",
    "Urban Grey": "Urban Grey",
    "Standard": "Standard"
  },
  th: {
    nav_shop_all: "เลือกช้อปทั้งหมด",
    nav_dogs: "สำหรับสุนัข",
    nav_cats: "สำหรับแมว",
    nav_story: "เรื่องราวของเรา",
    hs1_title: "ที่นอนสุนัขใยสักหลาด Nido",
    hs1_desc: "ที่นอนสัตว์เลี้ยงทรงกลมพร้อมเบาะนุ่มหนา",
    quick_add: "เพิ่มลงตะกร้าด่วน",
    hs2_title: "ที่วางชามข้าว Desco ไม้โอ๊ค",
    hs2_desc: "ชุดชามเซรามิกพร้อมขาตั้งไม้ดีไซน์มินิมอล",
    hero_subtitle: "คอลเลกชันใหม่",
    hero_title: "การใช้ชีวิตที่สวยงามร่วมกับสัตว์เลี้ยงของคุณ",
    hero_desc: "สัมผัสผลิตภัณฑ์ดีไซน์สไตล์สถาปัตยกรรมและอุปกรณ์คุณภาพสูงที่ผสมผสานเข้ากับการตกแต่งภายในบ้านของคุณได้อย่างลงตัว",
    hero_cta: "ช้อปเลย",
    slide2_sub: "ของเล่นดีไซน์โมเดิร์น",
    slide2_title: "คอนโดแมวปีนป่ายติดผนัง",
    slide2_desc: "ผลิตด้วยไม้แอชคุณภาพดีและเชือกป่านสีครีม เพื่อให้แมวของคุณได้ปีนป่ายโดยไม่ลดทอนความสวยงามของบ้านคุณ",
    slide3_sub: "มุมพักผ่อนแสนอบอุ่น",
    slide3_title: "ที่นอนข้างเตาผิงระดับพรีเมียม",
    slide3_desc: "ที่นอนสุนัขทำมือจัดวางข้างเตาผิง เพื่อความอบอุ่นและมอบความหรูหราเหนือระดับให้กับสัตว์เลี้ยง",
    slide4_sub: "ความงามแห่งประโยชน์ใช้สอย",
    slide4_title: "ชามข้าวไม้โอ๊คดีไซน์โมเดิร์น",
    slide4_desc: "ชุดชามอาหารคู่ขาตั้งไม้ที่ออกแบบมาอย่างพิถีพิถัน ลงตัวกับชุดครัวที่ทันสมัยอย่างสมบูรณ์แบบ",
    slide5_sub: "มุมนอนสไตล์แมกกาซีน",
    slide5_title: "บ้านแมวทรงรังไหมสุดหรู",
    slide5_desc: "มอบความเป็นส่วนตัวและความอบอุ่นให้แมวของคุณด้วยบ้านแมวทรงโดมใยสักหลาดดีไซน์พรีเมียม",
    
    col_subtitle: "พื้นที่ที่ได้รับการคัดสรร",
    col_title: "ออกแบบเพื่อความสบายและความสวยงาม",
    col1_sub: "ความสบายระดับพรีเมียม",
    col1_title: "ที่นอนและเบาะสำหรับสุนัข",
    explore: "สำรวจ",
    col2_sub: "ของเล่นดีไซน์โมเดิร์น",
    col2_title: "ที่ฝนเล็บและคอนโดแมวปีนป่าย",
    col3_sub: "ประโยชน์ใช้สอยที่มีความงาม",
    col3_title: "ชามและอุปกรณ์ให้อาหาร",
    shop_subtitle: "รายการสินค้า",
    shop_title: "เลือกช้อปสินค้า",
    filter_all: "สินค้าทั้งหมด",
    filter_dog: "สำหรับสุนัข",
    filter_cat: "สำหรับแมว",
    filter_acc: "อุปกรณ์และชามข้าว",
    sort_label: "จัดเรียง:",
    sort_featured: "แนะนำ",
    sort_low: "ราคา: ต่ำสุด - สูงสุด",
    sort_high: "ราคา: สูงสุด - ต่ำสุด",
    badge_bestseller: "ขายดีที่สุด",
    badge_new: "มาใหม่",
    add_to_bag: "เพิ่มลงตะกร้า",
    p1_title: "ที่นอนสุนัขใยสักหลาด Nido",
    p1_cat: "ที่นอนและเบาะหนุน",
    p2_title: "ที่วางชามข้าว Desco ไม้โอ๊ค",
    p2_cat: "การกินและการดูแล",
    p3_title: "คอนโดที่ฝนเล็บแมวรุ่น Torre",
    p3_cat: "ที่ฝนเล็บและการปีนป่าย",
    story_subtitle: "ปรัชญาของเรา",
    story_title: "ออกแบบเพื่อสัตว์เลี้ยง ลงตัวกับสไตล์ของคุณ",
    story_p1: "LuxePaws ถือกำเนิดขึ้นจากความตั้งใจที่จะสร้างสรรค์ผลิตภัณฑ์สำหรับสุนัขและแมวที่ผสานการออกแบบมินิมอลอันหรูหราเข้ากับฟังก์ชันการใช้งานที่โดดเด่น",
    story_p2: "เราทำงานร่วมกับนักออกแบบระดับนานาชาติและผู้ผลิตท้องถิ่นทั่วยุโรปเพื่อคัดสรรวัสดุระดับพรีเมียม ตั้งแต่คอนโดแมวปีนป่ายติดผนังไปจนถึงที่นอนใยสักหลาด ทุกผลิตภัณฑ์ได้รับการคิดค้นเพื่อความสบายของสัตว์เลี้ยงและมอบความสวยงามเหนือกาลเวลาให้กับบ้านของคุณ",
    story_btn: "ค้นพบคอลเลกชันของเรา",
    news_title: "เข้าร่วม LuxePaws Club",
    news_desc: "สมัครรับข้อมูลข่าวสารเกี่ยวกับการเปิดตัวผลิตภัณฑ์ใหม่ ความร่วมมือกับนักออกแบบ และสิทธิพิเศษในการสั่งจองคอลเลกชันล่วงหน้า",
    news_placeholder: "ที่อยู่อีเมลของคุณ",
    news_submit: "สมัครสมาชิก",
    footer_desc: "เฟอร์นิเจอร์ดีไซน์และอุปกรณ์ไลฟ์สไตล์ระดับพรีเมียมสำหรับสุนัขและแมว ดีไซน์ที่สอดคล้องกับความสบายสูงสุด",
    footer_col1_header: "รายการสินค้า",
    footer_col2_header: "ดูแลลูกค้า",
    footer_col3_header: "ติดตามเรา",
    footer_ship: "การจัดส่งและการคืนสินค้า",
    footer_care: "วัสดุและการดูแลรักษา",
    footer_size: "คู่มือวัดขนาด",
    footer_contact: "ติดต่อเรา",
    footer_copy: "© 2026 LuxePaws GmbH. สงวนลิขสิทธิ์ทั้งหมด",
    footer_loc: "ออกแบบด้วยใจรักในเมืองมิวนิก ประเทศเยอรมนี",
    cart_header: "ตะกร้าสินค้าของคุณ",
    cart_empty: "ไม่มีสินค้าอยู่ในตะกร้าของคุณ",
    cart_subtotal_label: "ยอดรวมย่อย",
    cart_checkout: "ชำระเงิน",
    // Colors
    "Grey": "สีเทา",
    "Cream": "สีครีม",
    "Charcoal": "สีชาร์โคล",
    "Oak": "สีไม้โอ๊ค",
    "Ash Black": "สีดำแอช",
    "Natural Cream": "สีครีมธรรมชาติ",
    "Urban Grey": "สีเทาเออร์บัน",
    "Standard": "มาตรฐาน"
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // --- Safe Storage Utility (fixes crashes when localStorage is blocked/disabled) ---
  const safeStorage = {
    getItem(key) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.warn("localStorage.getItem blocked:", e);
        return null;
      }
    },
    setItem(key, value) {
      try {
        localStorage.setItem(key, value);
        return true;
      } catch (e) {
        console.warn("localStorage.setItem blocked:", e);
        return false;
      }
    }
  };

  // --- Language Switcher Logic ---
  let currentLang = safeStorage.getItem('luxepaws_lang') || 'en';
  const newsletterForm = document.getElementById('newsletterForm');

  function setLanguage(lang) {
    currentLang = lang;
    safeStorage.setItem('luxepaws_lang', lang);
    document.documentElement.lang = lang;
    if (newsletterForm) newsletterForm.setAttribute('data-lang', lang);

    // Translate all standard text elements
    const translatableElements = document.querySelectorAll('[data-i18n]');
    translatableElements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });

    // Translate placeholders
    const translatablePlaceholders = document.querySelectorAll('[data-i18n-placeholder]');
    translatablePlaceholders.forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[lang] && translations[lang][key]) {
        el.placeholder = translations[lang][key];
      }
    });

    // Update active class on language toggle buttons
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Re-render product grid in the selected language
    renderProductGrid();

    // Re-render cart to update product titles and variables
    updateCartUI();
  }

  // Bind language toggle button click events
  const langSwitcher = document.querySelector('.lang-switcher');
  if (langSwitcher) {
    langSwitcher.addEventListener('click', (e) => {
      if (e.target.classList.contains('lang-btn') && !e.target.classList.contains('active')) {
        const selectedLang = e.target.getAttribute('data-lang');
        setLanguage(selectedLang);
      }
    });
  }

  // --- Dynamic Grid Rendering Engine ---
  const productGrid = document.getElementById('productGrid');

  async function loadProducts() {
    isLoaded = false;
    if (supabase) {
      try {
        console.log("Fetching products from Supabase database...");
        
        // Race the Supabase request against a 3-second timeout to prevent hangs
        const fetchPromise = supabase.from('products').select('*').order('id', { ascending: true });
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Database connection timed out (3s)")), 3000)
        );

        const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);
        
        if (error) throw error;
        if (!data || data.length === 0) {
          throw new Error("No data returned or empty table");
        }
        
        activeProducts = data || [];
        console.log("Products loaded from database successfully:", activeProducts);
      } catch (err) {
        console.error("Database fetch error. Falling back to local data:", err);
        activeProducts = localProducts;
      }
    } else {
      activeProducts = localProducts;
    }
    isLoaded = true;
    renderProductGrid();
  }

  function getSwatchColorClass(swatchName) {
    if (!swatchName) return '';
    switch (swatchName.toLowerCase()) {
      case 'grey':
      case 'urban grey':
        return 'swatch-grey';
      case 'cream':
      case 'natural cream':
        return 'swatch-cream';
      case 'charcoal':
      case 'ash black':
        return 'swatch-charcoal';
      case 'oak':
      case 'sand':
        return 'swatch-sand';
      case 'terracotta':
        return 'swatch-terracotta';
      default:
        return '';
    }
  }

  function renderProductGrid() {
    if (!productGrid) return;
    
    // Clear product grid
    productGrid.innerHTML = '';
    
    // If database request is not completed yet, show localized loading state
    if (!isLoaded) {
      const loadingText = currentLang === 'th' ? 'กำลังโหลดรายการสินค้า...' : 'Loading collection...';
      productGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; color: var(--color-muted); font-family: var(--font-accent); font-size: 1rem; padding: 4rem 0;">
          ${loadingText}
        </div>
      `;
      return;
    }
    
    // Safety check: ensure activeProducts is a valid array
    if (!activeProducts || !Array.isArray(activeProducts)) {
      activeProducts = localProducts;
    }
    
    if (activeProducts.length === 0) {
      const emptyText = currentLang === 'th' ? 'ไม่พบรายการสินค้า' : 'No products found.';
      productGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; color: var(--color-muted); font-family: var(--font-accent); font-size: 1rem; padding: 4rem 0;">
          ${emptyText}
        </div>
      `;
      return;
    }

    activeProducts.forEach(product => {
      if (!product) return;

      // Safe Localized properties (with empty string fallbacks to avoid rendering "undefined")
      const title = currentLang === 'th' ? (product.title_th || product.title_en || '') : (product.title_en || product.title_th || '');
      const categoryLabel = currentLang === 'th' ? (product.category_th || product.category_en || '') : (product.category_en || product.category_th || '');
      const badge = currentLang === 'th' ? product.badge_th : product.badge_en;
      const actionText = currentLang === 'th' ? 'เพิ่มลงตะกร้า' : 'Add to Bag';
      const priceVal = product.price ? parseFloat(product.price) : 0.00;
      const imgUrl = product.image_url || 'assets/dog_bed.png';
      const prodId = product.id ? product.id.toString() : '0';

      // Parse swatches array safely
      let swatchesArray = [];
      if (product.swatches && Array.isArray(product.swatches)) {
        swatchesArray = product.swatches;
      } else if (product.swatches) {
        try {
          swatchesArray = typeof product.swatches === 'string' ? JSON.parse(product.swatches) : product.swatches;
          if (!Array.isArray(swatchesArray)) swatchesArray = [];
        } catch (e) {
          swatchesArray = [];
        }
      }

      // Generate swatches HTML safely
      let swatchesHtml = '';
      if (swatchesArray && swatchesArray.length > 0) {
        swatchesHtml = `
          <div class="product-swatches">
            ${swatchesArray.map((swatch, idx) => {
              if (!swatch) return '';
              const activeClass = idx === 0 ? 'active' : '';
              const colorClass = getSwatchColorClass(swatch);
              return `<div class="swatch ${colorClass} ${activeClass}" data-color="${swatch}"></div>`;
            }).join('')}
          </div>
        `;
      }

      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.setAttribute('data-category', product.category || 'all');
      productCard.setAttribute('data-price', priceVal.toString());
      
      productCard.innerHTML = `
        <div class="product-image-wrap">
          ${badge ? `<span class="product-badge">${badge}</span>` : ''}
          <img src="${imgUrl}" alt="${title}" class="product-image">
          <div class="product-actions">
            <button class="btn quick-add-btn" data-id="${prodId}" data-price="${priceVal}" data-img="${imgUrl}">${actionText}</button>
          </div>
        </div>
        <div class="product-info">
          <div class="product-meta">
            <h3 class="product-title">${title}</h3>
            <span class="product-price">€${priceVal.toFixed(2)}</span>
          </div>
          <span class="product-category">${categoryLabel}</span>
          ${swatchesHtml}
        </div>
      `;
      
      productGrid.appendChild(productCard);
    });

    // Rebind newly created swatches events
    const newSwatches = productGrid.querySelectorAll('.swatch');
    newSwatches.forEach(swatch => {
      swatch.addEventListener('click', () => {
        const siblingSwatches = swatch.parentElement.querySelectorAll('.swatch');
        siblingSwatches.forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
      });
    });
  }

  // --- Hero Slider / Carousel Logic ---
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('sliderPrevBtn');
  const nextBtn = document.getElementById('sliderNextBtn');
  let currentSlide = 0;
  let slideInterval;

  function goToSlide(n) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  function startSlideShow() {
    slideInterval = setInterval(nextSlide, 7000); 
  }

  function resetSlideShowInterval() {
    clearInterval(slideInterval);
    startSlideShow();
  }

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetSlideShowInterval();
    });
    
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetSlideShowInterval();
    });
  }

  const dotsContainer = document.getElementById('sliderDotsContainer');
  if (dotsContainer) {
    dotsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('dot')) {
        const slideIndex = parseInt(e.target.getAttribute('data-slide'));
        goToSlide(slideIndex);
        resetSlideShowInterval();
      }
    });
  }

  if (slides.length > 0) {
    startSlideShow();
  }

  // --- Sticky Header Logic ---
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Mobile Navigation Toggle ---
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '100%';
      navLinks.style.left = '0';
      navLinks.style.width = '100%';
      navLinks.style.backgroundColor = 'var(--color-white)';
      navLinks.style.padding = '2rem';
      navLinks.style.boxShadow = 'var(--shadow-premium)';
    });
  }

  // --- Shopping Cart State Management ---
  let cart = [];
  const cartDrawer = document.getElementById('cartDrawer');
  const cartBackdrop = document.getElementById('cartBackdrop');
  const cartToggleBtn = document.getElementById('cartToggleBtn');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartEmptyMsg = document.getElementById('cartEmptyMsg');
  const cartCount = document.getElementById('cartCount');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  // Load cart from localStorage if exists
  let localCartData = null;
  try {
    localCartData = localStorage.getItem('luxepaws_cart');
  } catch (e) {
    console.warn("localStorage.getItem for cart blocked:", e);
  }

  if (localCartData) {
    try {
      cart = JSON.parse(localCartData);
    } catch (e) {
      cart = [];
    }
  }

  // Toggle Cart Drawer
  function openCart() {
    cartDrawer.classList.add('open');
    cartBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartDrawer.classList.remove('open');
    cartBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (cartToggleBtn) cartToggleBtn.addEventListener('click', openCart);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);

  // Add Item to Cart
  function addToCart(id, titleKey, price, img, colorKey = 'Standard') {
    const stringId = String(id);
    const parsedPrice = parseFloat(price) || 0;
    const existingItem = cart.find(item => String(item.id) === stringId && item.colorKey === colorKey);

    if (existingItem) {
      existingItem.qty += 1;
    } else {
      cart.push({
        id: stringId,
        titleKey,
        price: parsedPrice,
        img,
        colorKey,
        qty: 1
      });
    }

    try {
      localStorage.setItem('luxepaws_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn("localStorage.setItem for cart blocked:", e);
    }
    updateCartUI();
    openCart();
  }

  // Update Cart UI
  function updateCartUI() {
    const totalQty = cart.reduce((total, item) => total + item.qty, 0);
    if (cartCount) cartCount.textContent = totalQty;

    if (!cartItemsList) return;

    const items = cartItemsList.querySelectorAll('.cart-item');
    items.forEach(el => el.remove());

    if (cart.length === 0) {
      if (cartEmptyMsg) cartEmptyMsg.style.display = 'block';
      if (cartSubtotal) cartSubtotal.textContent = '€0.00';
    } else {
      if (cartEmptyMsg) cartEmptyMsg.style.display = 'none';

      let subtotal = 0;

      cart.forEach(item => {
        const itemCost = item.price * item.qty;
        subtotal += itemCost;

        const title = translations[currentLang][item.titleKey] || item.titleKey;
        const color = translations[currentLang][item.colorKey] || item.colorKey;
        const removeText = currentLang === 'th' ? 'ลบสินค้า' : 'Remove';

        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'cart-item';
        cartItemEl.innerHTML = `
          <div class="cart-item-img">
            <img src="${item.img}" alt="${title}">
          </div>
          <div class="cart-item-details">
            <div>
              <h4 class="cart-item-title">${title}</h4>
              <span class="cart-item-meta">${currentLang === 'th' ? 'สี' : 'Color'}: ${color}</span>
              <div class="cart-item-price">€${(item.price).toFixed(2)}</div>
            </div>
            <div class="cart-item-controls">
              <div class="qty-selector">
                <button class="qty-btn dec-qty" data-id="${item.id}" data-color-key="${item.colorKey}">-</button>
                <span class="qty-val">${item.qty}</span>
                <button class="qty-btn inc-qty" data-id="${item.id}" data-color-key="${item.colorKey}">+</button>
              </div>
              <button class="remove-item-btn" data-id="${item.id}" data-color-key="${item.colorKey}">${removeText}</button>
            </div>
          </div>
        `;
        cartItemsList.appendChild(cartItemEl);
      });

      if (cartSubtotal) cartSubtotal.textContent = `€${subtotal.toFixed(2)}`;
    }
  }

  // Handle click events in Cart Drawer
  if (cartItemsList) {
    cartItemsList.addEventListener('click', (e) => {
      const target = e.target;
      const id = target.getAttribute('data-id');
      const colorKey = target.getAttribute('data-color-key');

      if (!id) return;

      const itemIndex = cart.findIndex(item => item.id === id && item.colorKey === colorKey);
      if (itemIndex === -1) return;

      if (target.classList.contains('inc-qty')) {
        cart[itemIndex].qty += 1;
      } else if (target.classList.contains('dec-qty')) {
        if (cart[itemIndex].qty > 1) {
          cart[itemIndex].qty -= 1;
        } else {
          cart.splice(itemIndex, 1);
        }
      } else if (target.classList.contains('remove-item-btn')) {
        cart.splice(itemIndex, 1);
      }

      localStorage.setItem('luxepaws_cart', JSON.stringify(cart));
      updateCartUI();
    });
  }

  // Attach quick-add buttons logic (using event delegation for dynamically loaded items)
  document.body.addEventListener('click', (e) => {
    if (e.target.classList.contains('quick-add-btn')) {
      const btn = e.target;
      const id = btn.getAttribute('data-id');
      const price = btn.getAttribute('data-price');
      const img = btn.getAttribute('data-img');
      
      let titleKey = 'p1_title';
      if (id === '2') titleKey = 'p2_title';
      if (id === '3') titleKey = 'p3_title';

      const parentCard = btn.closest('.product-card');
      let activeColorKey = 'Standard';
      if (parentCard) {
        const activeSwatch = parentCard.querySelector('.swatch.active');
        if (activeSwatch) {
          activeColorKey = activeSwatch.getAttribute('data-color') || 'Standard';
        }
      }
      
      addToCart(id, titleKey, price, img, activeColorKey);
    }
  });

  // Checkouts message translation
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const msg = currentLang === 'th' ? 'กำลังดำเนินการไปยังหน้าชำระเงิน (ตัวอย่างระบบจำลอง)' : 'Proceeding to checkout (mockup demo)';
      alert(msg);
    });
  }

  // --- Filtering Logic (Working on Dynamic DOM Nodes) ---
  const filterBtns = document.querySelectorAll('.filter-btn');

  function filterProducts(category) {
    // Dynamic cards must be selected when filtering occurs
    const dynamicCards = document.querySelectorAll('.product-grid .product-card');
    dynamicCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      
      if (category === 'all' || cardCategory === category) {
        card.style.display = 'flex';
        card.style.opacity = '0';
        setTimeout(() => {
          card.style.opacity = '1';
        }, 50);
      } else {
        card.style.display = 'none';
      }
    });
  }

  // Grid filter buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filterValue = btn.getAttribute('data-filter');
      filterProducts(filterValue);
    });
  });

  // Navbar and Collection links filter
  const filterLinks = document.querySelectorAll('.filter-link');
  filterLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetCategory = link.getAttribute('data-target');
      
      const shopSection = document.getElementById('shop');
      if (shopSection) {
        shopSection.scrollIntoView({ behavior: 'smooth' });
      }

      filterBtns.forEach(btn => {
        if (btn.getAttribute('data-filter') === targetCategory) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      filterProducts(targetCategory);
    });
  });

  // --- Sorting Logic (Working on Dynamic DOM Nodes) ---
  const sortSelect = document.getElementById('sortSelect');

  if (sortSelect && productGrid) {
    sortSelect.addEventListener('change', () => {
      const val = sortSelect.value;
      const cards = Array.from(productGrid.children);

      cards.sort((a, b) => {
        const priceA = parseFloat(a.getAttribute('data-price'));
        const priceB = parseFloat(b.getAttribute('data-price'));

        if (val === 'price-low') {
          return priceA - priceB;
        } else if (val === 'price-high') {
          return priceB - priceA;
        } else {
          return 0; // Fallback to database order
        }
      });

      productGrid.innerHTML = '';
      cards.forEach(card => productGrid.appendChild(card));
    });
  }

  // Initialize: Load products from Supabase or Fallback
  loadProducts();
  
  // Set language configuration (will trigger grid render and cart updates)
  setLanguage(currentLang);
});
