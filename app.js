// LuxePaws Premium E-commerce Logic with Supabase Backend & Multilingual Support (EN & TH)

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: "AIzaSyCU0NcUIX951m0nMp398xu2utNZPj1Wup4",
  authDomain: "luxepaws-cab68.firebaseapp.com",
  projectId: "luxepaws-cab68",
  storageBucket: "luxepaws-cab68.firebasestorage.app",
  messagingSenderId: "1053657082729",
  appId: "1:1053657082729:web:cffb22f8fa94f6684e6bf8",
  measurementId: "G-2ZGWS1X47Y"
};

// Initialize Firebase
let firebaseApp = null;
let db = null;
let auth = null;

try {
  firebaseApp = firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
  auth = firebase.auth();
  console.log("Firebase initialized successfully.");
} catch (e) {
  console.error("Failed to initialize Firebase client:", e);
}

// --- Local Mock Data Fallback ---
const localProducts = [
  {
    id: 1,
    title_en: "Nido Felt Dog Bed",
    title_th: "ที่นอนสุนัขใยสักหลาด Nido",
    price: 6900.00,
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
    price: 3500.00,
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
    price: 8900.00,
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
    nav_home: "Home",
    nav_products: "Products",
    nav_collections: "Collections",
    nav_gallery: "Gallery",
    nav_custom: "Custom Design",
    nav_blog: "Blog",
    nav_reviews: "Reviews",
    nav_faq: "FAQ",
    nav_contact: "Contact",
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
    footer_admin: "Staff Login",
    footer_copy: "© 2026 LuxePaws GmbH. All rights reserved.",
    footer_loc: "Designed with passion in Munich, Germany.",
    cart_header: "Your Shopping Bag",
    cart_empty: "Your bag is empty.",
    cart_subtotal_label: "Subtotal",
    cart_checkout: "Checkout",
    
    // Checkout Translations
    checkout_header: "Complete Your Order",
    checkout_name_label: "Full Name",
    checkout_name_ph: "e.g. John Doe",
    checkout_email_label: "Email Address",
    checkout_email_ph: "e.g. john@example.com",
    checkout_address_label: "Shipping Address",
    checkout_address_ph: "e.g. 123 Luxury Way, Bangkok, Thailand",
    checkout_payment_header: "Payment Method",
    checkout_mock_card: "Mock Demo Payment (No real card required)",
    checkout_submit: "Place Order",
    success_title: "Order Placed Successfully!",
    success_desc: "Thank you for your purchase. Your order has been registered in our database system.",
    success_order_id_label: "Order ID:",
    success_close: "Continue Shopping",

    // Gallery Section
    gallery_subtitle: "LuxePaws Homes",
    gallery_title: "Inspired Installations",
    gallery_cap1: "Urban Loft, Munich",
    gallery_cap2: "Minimalist Condo, Berlin",
    gallery_cap3: "Cozy Chalet, Zurich",
    gallery_cap4: "Penthouse Kitchen, Vienna",
    
    // Custom Section
    custom_subtitle: "Tailored Luxury",
    custom_title: "Bespoke Furniture",
    custom_desc: "Need specific dimensions or a unique wood finish to match your home interior? Speak directly with our master craftsmen. We offer customized sizing, premium wood selections (Walnut, Ash, Oak), and designer fabric wraps tailored to your styling preferences.",
    custom_badge_h: "Handcrafted in Bavaria",
    custom_badge_p: "100% Sustainable Solid Wood",
    custom_form_name: "Your Name",
    custom_form_email: "Email Address",
    custom_form_pet: "Pet Type & Size",
    custom_opt_ds: "Small Dog (e.g. Pug, Frenchie)",
    custom_opt_dl: "Medium/Large Dog (e.g. Retriever)",
    custom_opt_c: "Cat (e.g. Maine Coon, British Shorthair)",
    custom_form_wood: "Wood Choice",
    custom_opt_oak: "Premium Oak",
    custom_opt_ash: "Ash Wood",
    custom_opt_walnut: "Classic Walnut",
    custom_form_notes: "Inquiry Details / Dimensions",
    custom_notes_ph: "Describe your preferred sizes, color tones, or special requests...",
    custom_submit: "Send Inquiry",
    custom_success: "Thank you! Your custom inquiry has been successfully sent to our database.",
    
    // Blog Section
    blog_subtitle: "LuxePaws Journal",
    blog_title: "Living with Design",
    blog_tag1: "Interior",
    blog_post1_title: "Integrating Pet Beds Into Modern Living Rooms",
    blog_post1_excerpt: "Discover how to position your pet's nesting space to complement Scandinavian minimalism and maintain design cohesion.",
    blog_tag2: "Architecture",
    blog_post2_title: "The Rise of 'Catification': Wall Climbing Guides",
    blog_post2_excerpt: "Unlock your cat's climbing instincts without sacrificing wall space. The ultimate architectural climbing layout guide.",
    blog_tag3: "Health",
    blog_post3_title: "The Ergonomics of Elevated Pet Feeder Bowls",
    blog_post3_excerpt: "Why vet science recommends elevated oak wood stands to improve digestion and posture for aging cats and dogs.",
    blog_read_more: "Read Article",
    
    // Reviews Section
    reviews_subtitle: "Happy Families",
    reviews_title: "Client Testimonials",
    review1_text: "\"The Nido dog bed has changed our living room! It looks like a designer sculpture rather than a pet bed. Our Frenchie loves it!\"",
    reviewer1_title: "Owner of French Bulldog (Munich)",
    review2_text: "\"Outstanding craftsmanship. The wood finish matches our oak cabinets perfectly, and the bowls are very easy to clean. Best purchase!\"",
    reviewer2_title: "Owner of Golden Retriever (Hamburg)",
    review3_text: "\"The Torre cat tower is sturdy and elegant. Our Maine Coon sits on the top cocoon every single day. Worth every baht.\"",
    reviewer3_title: "Owner of Maine Coon (Vienna)",
    
    // FAQ Section
    faq_subtitle: "Common Questions",
    faq_title: "Frequently Asked Questions",
    faq_q1: "What materials are used in LuxePaws furniture?",
    faq_a1: "We use certified premium materials: 100% sustainable European solid wood (Oak, Ash, Walnut), hypoallergenic natural wool felts, and highly durable designer upholstery fabrics built to resist scratch wear.",
    faq_q2: "Can I wash the cushions and fabric elements?",
    faq_a2: "Yes, all our pet bed covers and cushion cases feature premium hidden zippers and are fully machine washable on a gentle cycle (30°C / cold wash).",
    faq_q3: "Do you ship internationally? What are the delivery times?",
    faq_a3: "Yes, we deliver worldwide. In-stock products ship within 48 hours. Custom craft works take approximately 2-4 weeks to manufacture in Bavaria before express dispatch.",
    faq_q4: "How do I clean and maintain the wood stands?",
    faq_a4: "All wooden stands are sealed with water-resistant pet-safe oils. Simply wipe down spills with a damp cloth. Avoid harsh chemical cleaners to protect the natural timber glaze.",

    // Colors
    "Grey": "Grey",
    "Cream": "Cream",
    "Charcoal": "Charcoal",
    "Oak": "Oak",
    "Ash Black": "Ash Black",
    "Natural Cream": "Natural Cream",
    "Urban Grey": "Urban Grey",
    "Standard": "Standard",
    
    // Product Detail Modal EN
    detail_color_label: "Select Color",
    detail_qty_label: "Quantity",
    p1_desc_detail: "Indulge your pet with Nido, a sanctuary of absolute comfort and high-end design. Molded from organic felt wool with a soft, reversible inner cushion, Nido offers security and support while blending beautifully with your modern living space.",
    p2_desc_detail: "Elevate feeding time to a luxury ritual. The Desco bowl stand combines a sturdy, varnished oak wood stand with dishwasher-safe matte ceramic bowls. Ergonomically designed to reduce neck strain for your dogs and cats while keeping your dining area clean and stylish.",
    p3_desc_detail: "Torre is an architectural masterpiece designed for active cats. Crafted from solid ash wood and wrapped in natural heavy-duty sisal rope, this scratching tower features a elevated snug platform at the top, offering your cat the perfect playground to climb, scratch, and sleep in ultimate style.",
    
    // Search Modal EN
    search_placeholder: "Search LuxePaws products...",
    search_featured_products: "Featured Suggestions",
    search_no_results: "No matching products found.",
    search_results_title: "Search Results"
  },
  th: {
    nav_home: "หน้าแรก",
    nav_products: "สินค้า",
    nav_collections: "คอลเลกชัน",
    nav_gallery: "ผลงานติดตั้ง",
    nav_custom: "ออกแบบเอง",
    nav_blog: "บทความ",
    nav_reviews: "รีวิวลูกค้า",
    nav_faq: "คำถามที่พบบ่อย",
    nav_contact: "ติดต่อเรา",
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
    footer_admin: "เข้าสู่ระบบเจ้าหน้าที่",
    footer_copy: "© 2026 LuxePaws GmbH. สงวนลิขสิทธิ์ทั้งหมด",
    footer_loc: "ออกแบบด้วยใจรักในเมืองมิวนิก ประเทศเยอรมนี",
    cart_header: "ตะกร้าสินค้าของคุณ",
    cart_empty: "ไม่มีสินค้าอยู่ในตะกร้าของคุณ",
    cart_subtotal_label: "ยอดรวมย่อย",
    cart_checkout: "ชำระเงิน",
    
    // Checkout Translations
    checkout_header: "กรอกข้อมูลเพื่อสั่งซื้อสินค้า",
    checkout_name_label: "ชื่อ-นามสกุล",
    checkout_name_ph: "เช่น สมชาย รักเรียน",
    checkout_email_label: "ที่อยู่อีเมล",
    checkout_email_ph: "เช่น somchais@example.com",
    checkout_address_label: "ที่อยู่สำหรับการจัดส่ง",
    checkout_address_ph: "เช่น 123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ",
    checkout_payment_header: "วิธีการชำระเงิน",
    checkout_mock_card: "การจำลองจ่ายเงิน (ไม่มีการตัดบัตรจริง)",
    checkout_submit: "ยืนยันการสั่งซื้อ",
    success_title: "สั่งซื้อสินค้าสำเร็จแล้ว!",
    success_desc: "ขอบคุณสำหรับการสั่งซื้อ ข้อมูลการสั่งซื้อของคุณได้รับการบันทึกในฐานข้อมูลระบบเรียบร้อยแล้ว",
    success_order_id_label: "รหัสคำสั่งซื้อ:",
    success_close: "เลือกช้อปสินค้าต่อ",

    // Gallery Section
    gallery_subtitle: "บ้านของ LuxePaws",
    gallery_title: "แรงบันดาลใจการติดตั้ง",
    gallery_cap1: "เออร์บันลอฟท์, มิวนิก",
    gallery_cap2: "คอนโดมินิมอล, เบอร์ลิน",
    gallery_cap3: "ชาเลต์แสนอบอุ่น, ซูริก",
    gallery_cap4: "ครัวเพนท์เฮาส์, เวียนนา",
    
    // Custom Section
    custom_subtitle: "ความหรูหราที่สั่งตัดได้",
    custom_title: "เฟอร์นิเจอร์สั่งทำพิเศษ",
    custom_desc: "หากคุณต้องการขนาดที่เฉพาะเจาะจงหรือสีเนื้อไม้ที่เข้ากับสไตล์บ้านของคุณ สามารถพูดคุยกับช่างฝีมือของเราได้โดยตรง เรามีบริการปรับขนาด เลือกเกรดเนื้อไม้ระดับพรีเมียม (วอลนัท, แอช, โอ๊ก) และหุ้มผ้าบุดีไซเนอร์ที่ตรงตามสไตล์ของคุณ",
    custom_badge_h: "งานฝีมือในแคว้นบาวาเรีย",
    custom_badge_p: "ไม้แท้จากแหล่งธรรมชาติ 100%",
    custom_form_name: "ชื่อของคุณ",
    custom_form_email: "ที่อยู่อีเมล",
    custom_form_pet: "ประเภทและขนาดของสัตว์เลี้ยง",
    custom_opt_ds: "สุนัขขนาดเล็ก (เช่น ปั๊ก, เฟรนช์บลูด็อก)",
    custom_opt_dl: "สุนัขขนาดกลาง/ใหญ่ (เช่น โกลเดนรีทรีฟเวอร์)",
    custom_opt_c: "แมว (เช่น เมนคูน, บริติชชอร์ตแฮร์)",
    custom_form_wood: "เนื้อไม้ที่เลือก",
    custom_opt_oak: "ไม้โอ๊คพรีเมียม",
    custom_opt_ash: "ไม้แอชธรรมชาติ",
    custom_opt_walnut: "ไม้คลาสสิกวอลนัท",
    custom_form_notes: "รายละเอียดการสั่งทำ / ขนาด",
    custom_notes_ph: "อธิบายขนาดที่คุณต้องการ โทนสี หรือความต้องการพิเศษ...",
    custom_submit: "ส่งคำขอเสนอราคา",
    custom_success: "ขอบคุณค่ะ! ข้อมูลคำขอออกแบบเองของคุณได้รับการส่งไปยังระบบเรียบร้อยแล้ว",
    
    // Blog Section
    blog_subtitle: "บันทึกเรื่องราว LuxePaws",
    blog_title: "การใช้ชีวิตอย่างมีดีไซน์",
    blog_tag1: "อินทีเรีย",
    blog_post1_title: "การจัดวางที่นอนสัตว์เลี้ยงในห้องนั่งเล่นโมเดิร์น",
    blog_post1_excerpt: "ค้นพบวิธีการจัดวางพื้นที่นอนของสัตว์เลี้ยงให้กลมกลืนกับสไตล์มินิมอลแบบสแกนดิเนเวียโดยไม่ทำลายความสวยงามของห้อง",
    blog_tag2: "สถาปัตยกรรม",
    blog_post2_title: "การเติบโตของ 'Catification': คู่มือคอนโดแมวติดผนัง",
    blog_post2_excerpt: "ตอบสนองสัญชาตญาณการปีนป่ายของแมวโดยไม่เสียพื้นที่ใช้สอยในแนวราบ คู่มือการออกแบบคอนโดแมวฉบับสมบูรณ์",
    blog_tag3: "สุขภาพสัตว์เลี้ยง",
    blog_post3_title: "สรีรศาสตร์ของชามอาหารสัตว์เลี้ยงแบบยกสูง",
    blog_post3_excerpt: "ทำไมสัตวแพทย์จึงแนะนำชั้นวางชามข้าวไม้โอ๊คแบบยกสูง เพื่อช่วยในการย่อยอาหารและการวางท่าทางที่ดีสำหรับสุนัขและแมว",
    blog_read_more: "อ่านบทความ",
    
    // Reviews Section
    reviews_subtitle: "ครอบครัวที่มีความสุข",
    reviews_title: "ความคิดเห็นจากลูกค้า",
    review1_text: "\"ที่นอนสุนัข Nido เปลี่ยนห้องนั่งเล่นของเราไปเลย! มันดูเหมือนประติมากรรมตกแต่งบ้านมากกว่าที่นอนหมาทั่วไป เจ้าเฟรนช์ของเราชอบมากค่ะ!\"",
    reviewer1_title: "เจ้าของเฟรนช์บลูด็อก (มิวนิก)",
    review2_text: "\"งานฝีมือที่ยอดเยี่ยมมาก สีเนื้อไม้โอ๊คเข้ากับตู้กับข้าวของเราได้อย่างลงตัวสุด ๆ ชามทำความสะอาดง่ายมาก แนะนำเลยครับ!\"",
    reviewer2_title: "เจ้าของโกลเดนรีทรีฟเวอร์ (ฮัมบูร์ก)",
    review3_text: "\"คอนโดแมว Torre แข็งแรงและสวยงามหรูหรามาก เจ้าเมนคูนของเราขึ้นไปนอนบนโดมบนสุดทุกวันเลยค่ะ คุ้มค่าเงินทุกบาทจริงๆ\"",
    reviewer3_title: "เจ้าของเมนคูน (เวียนนา)",
    
    // FAQ Section
    faq_subtitle: "คำถามที่พบบ่อย",
    faq_title: "คำถามทั่วไปเกี่ยวกับการสั่งทำ",
    faq_q1: "วัสดุที่ใช้ในเฟอร์นิเจอร์ LuxePaws คืออะไร?",
    faq_a1: "เราใช้วัสดุระดับพรีเมียมที่ผ่านการรับรอง: ไม้แท้ยุโรป 100% จากป่าหมุนเวียน (ไม้โอ๊ค, ไม้แอช, ไม้วอลนัท), ใยสักหลาดขนแกะธรรมชาติที่ไม่ก่อให้เกิดอาการแพ้ และผ้าบุดีไซเนอร์ที่หนาเป็นพิเศษสำหรับต้านทานรอยขีดข่วนของกรงเล็บสัตว์เลี้ยง",
    faq_q2: "สามารถถอดซักเบาะและชิ้นส่วนผ้าได้หรือไม่?",
    faq_a2: "ได้ค่ะ ปลอกที่นอนสัตว์เลี้ยงและปลอกเบาะรองนั่งทั้งหมดของเราใช้ซิปซ่อนคุณภาพสูง และสามารถถอดซักด้วยเครื่องซักผ้าโหมดถนอมผ้าได้ตามปกติ (อุณหภูมิ 30°C / ซักเย็น)",
    faq_q3: "คุณมีบริการจัดส่งไปต่างประเทศหรือไม่? และใช้เวลาจัดส่งนานเท่าใด?",
    faq_a3: "เราจัดส่งสินค้าทั่วโลกค่ะ สำหรับสินค้าพร้อมส่งจะดำเนินการแพ็คและส่งออกภายใน 48 ชั่วโมง ส่วนงานสั่งทำพิเศษจะใช้เวลาผลิตในแคว้นบาวาเรียประมาณ 2-4 สัปดาห์ก่อนจัดส่งแบบด่วนพิเศษ",
    faq_q4: "วิธีการดูแลรักษาและทำความสะอาดที่วางชามข้าวไม้อย่างไร?",
    faq_a4: "ชั้นวางไม้ทั้งหมดเคลือบสารป้องกันน้ำซึมด้วยน้ำมันธรรมชาติที่ปลอดภัยต่อสัตว์เลี้ยง เพียงเช็ดสิ่งสกปรกออกด้วยผ้าชุบน้ำหมาด ๆ และควรหลีกเลี่ยงน้ำยาทำความสะอาดที่มีฤทธิ์กัดกร่อนเพื่อถนอมเนื้อไม้ให้เงางามยืนยาว",

    // Colors
    "Grey": "สีเทา",
    "Cream": "สีครีม",
    "Charcoal": "สีชาร์โคล",
    "Oak": "สีไม้โอ๊ค",
    "Ash Black": "สีดำแอช",
    "Natural Cream": "สีครีมธรรมชาติ",
    "Urban Grey": "สีเทาเออร์บัน",
    "Standard": "มาตรฐาน",
    
    // Product Detail Modal TH
    detail_color_label: "เลือกสี",
    detail_qty_label: "จำนวน",
    p1_desc_detail: "ปรนเปรอสัตว์เลี้ยงของคุณด้วย Nido พื้นที่แห่งความอบอุ่นและสไตล์ระดับไฮเอนด์ ขึ้นรูปด้วยใยสักหลาดขนแกะธรรมชาติ 100% พร้อมเบาะรองนอนหนานุ่มที่สลับด้านซักได้ Nido มอบความรู้สึกปลอดภัยและผ่อนคลาย พร้อมเข้ากับพื้นที่ห้องนั่งเล่นยุคใหม่ของคุณอย่างลงตัว",
    p2_desc_detail: "ยกระดับเวลารับประทานอาหารให้เป็นช่วงเวลาสุดหรู ที่วางชาม Desco ผลิตจากไม้โอ๊คแท้เคลือบกันน้ำ ผสานชามเซรามิกผิวแมตต์ที่ทำความสะอาดง่ายและเข้าเครื่องล้างจานได้ ได้รับการออกแบบตามหลักสรีรศาสตร์ช่วยลดอาการปวดตึงคอสำหรับสุนัขและแมว และรักษาความสะอาดในห้องครัวของคุณ",
    p3_desc_detail: "Torre คือผลงานศิลปะทางสถาปัตยกรรมที่ออกแบบมาเพื่อแมวที่กระฉับกระเฉง สร้างสรรค์ด้วยไม้แอชแท้ทั้งหลังและพันด้วยเชือกป่านศรนารายณ์หนาพิเศษ คอนโดปีนป่ายนี้มาพร้อมแท่นรังนอนทรงโคคูนด้านบนสุด ช่วยให้เจ้าเหมียวปีนป่าย ฝนเล็บ และนอนพักผ่อนอย่างมีระดับ",
    
    // Search Modal TH
    search_placeholder: "ค้นหาสินค้า LuxePaws...",
    search_featured_products: "สินค้าแนะนำสำหรับคุณ",
    search_no_results: "ไม่พบสินค้าที่ตรงกับการค้นหา",
    search_results_title: "ผลลัพธ์การค้นหา"
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
  let currentLang = safeStorage.getItem('luxepaws_lang') || 'th';
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

    // Re-render blog grid in the selected language
    if (typeof renderBlogGrid === 'function') renderBlogGrid();

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
    if (db) {
      try {
        console.log("Fetching products from Firebase Firestore...");
        
        // Race the Firestore query against a 3-second timeout
        const fetchPromise = db.collection('products').orderBy('id', 'asc').get().then(snapshot => {
          const products = [];
          snapshot.forEach(doc => {
            const docData = doc.data();
            products.push({ id: docData.id || doc.id, ...docData });
          });
          return products;
        });
        
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Database connection timed out (3s)")), 3000)
        );

        const data = await Promise.race([fetchPromise, timeoutPromise]);
        
        if (!data || data.length === 0) {
          throw new Error("No data returned or empty collection");
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
            <span class="product-price">฿${priceVal.toFixed(2)}</span>
          </div>
          <span class="product-category">${categoryLabel}</span>
          ${swatchesHtml}
        </div>
      `;
      
      productCard.addEventListener('click', (e) => {
        if (e.target.closest('.quick-add-btn') || e.target.closest('.swatch')) {
          return; // Avoid triggering modal for quick cart add or color swatches clicks
        }
        openProductDetailsModal(product);
      });
      
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
    if (slides[currentSlide]) slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    if (slides[currentSlide]) slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
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

  // --- Mobile Navigation Toggle (Apple-style Full Screen Menu) ---
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.classList.contains('open');
      if (isOpen) {
        navLinks.style.display = 'none';
        navLinks.removeAttribute('style');
        const innerLinks = navLinks.querySelectorAll('a');
        innerLinks.forEach(link => link.removeAttribute('style'));
        menuToggle.classList.remove('open');
        document.body.style.overflow = '';
      } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'fixed';
        navLinks.style.top = '48px';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.height = 'calc(100vh - 48px)';
        navLinks.style.backgroundColor = 'var(--color-light)';
        navLinks.style.padding = '3rem 2.5rem';
        navLinks.style.boxShadow = 'none';
        navLinks.style.zIndex = '999';
        navLinks.style.gap = '1.8rem';
        
        // Style inner links to look like Apple's big links
        const innerLinks = navLinks.querySelectorAll('a');
        innerLinks.forEach(link => {
          link.style.fontFamily = 'var(--font-menu)';
          link.style.fontSize = '1.25rem';
          link.style.fontWeight = '400';
          link.style.width = '100%';
          link.style.borderBottom = '1px solid rgba(28, 27, 25, 0.06)';
          link.style.paddingBottom = '0.8rem';
          link.style.color = 'var(--color-dark)';
          link.style.opacity = '0.9';
        });

        menuToggle.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });

    // Close menu when a link inside is clicked (only in mobile view)
    navLinks.addEventListener('click', (e) => {
      if (e.target.closest('a') && menuToggle.classList.contains('open')) {
        navLinks.style.display = 'none';
        navLinks.removeAttribute('style');
        const innerLinks = navLinks.querySelectorAll('a');
        innerLinks.forEach(link => link.removeAttribute('style'));
        menuToggle.classList.remove('open');
        document.body.style.overflow = '';
      }
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
      if (cartSubtotal) cartSubtotal.textContent = '฿0.00';
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
              <div class="cart-item-price">฿${(item.price).toFixed(2)}</div>
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

      if (cartSubtotal) cartSubtotal.textContent = `฿${subtotal.toFixed(2)}`;
    }
  }

  // Handle click events in Cart Drawer
  if (cartItemsList) {
    cartItemsList.addEventListener('click', (e) => {
      const target = e.target;
      const id = target.getAttribute('data-id');
      const colorKey = target.getAttribute('data-color-key');

      if (!id) return;

      const stringId = String(id);
      const itemIndex = cart.findIndex(item => String(item.id) === stringId && item.colorKey === colorKey);
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

      try {
        localStorage.setItem('luxepaws_cart', JSON.stringify(cart));
      } catch (e) {
        console.warn("localStorage.setItem for cart blocked:", e);
      }
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

  // --- Checkout Modal & Database Order Insertion Logic ---
  const checkoutModal = document.getElementById('checkoutModal');
  const checkoutBackdrop = document.getElementById('checkoutBackdrop');
  const checkoutCloseBtn = document.getElementById('checkoutCloseBtn');
  const checkoutForm = document.getElementById('checkoutForm');
  const checkoutSummaryTotal = document.getElementById('checkoutSummaryTotal');

  const successModal = document.getElementById('successModal');
  const successBackdrop = document.getElementById('successBackdrop');
  const successOrderId = document.getElementById('successOrderId');
  const closeSuccessBtn = document.getElementById('closeSuccessBtn');

  function openCheckout() {
    if (cart.length === 0) {
      alert(currentLang === 'th' ? 'ไม่มีสินค้าอยู่ในตะกร้า!' : 'Your bag is empty!');
      return;
    }
    const subtotal = cart.reduce((total, item) => total + (item.price * item.qty), 0);
    if (checkoutSummaryTotal) checkoutSummaryTotal.textContent = `฿${subtotal.toFixed(2)}`;
    
    closeCart();
    checkoutModal.classList.add('open');
    checkoutBackdrop.classList.add('open');
  }

  function closeCheckout() {
    checkoutModal.classList.remove('open');
    checkoutBackdrop.classList.remove('open');
  }

  if (checkoutBtn) checkoutBtn.addEventListener('click', openCheckout);
  if (checkoutCloseBtn) checkoutCloseBtn.addEventListener('click', closeCheckout);
  if (checkoutBackdrop) checkoutBackdrop.addEventListener('click', closeCheckout);

  // --- Product Details Modal Controller & Interactive Gallery ---
  const productDetailsModal = document.getElementById('productDetailsModal');
  const productModalBackdrop = document.getElementById('productModalBackdrop');
  const productModalCloseBtn = document.getElementById('productModalCloseBtn');
  
  const modalMainImage = document.getElementById('modalMainImage');
  const modalThumbnails = document.getElementById('modalThumbnails');
  const modalProductBadge = document.getElementById('modalProductBadge');
  const modalProductTitle = document.getElementById('modalProductTitle');
  const modalProductCategory = document.getElementById('modalProductCategory');
  const modalProductPrice = document.getElementById('modalProductPrice');
  const modalProductDesc = document.getElementById('modalProductDesc');
  const modalProductSwatches = document.getElementById('modalProductSwatches');
  const modalQtyVal = document.getElementById('modalQtyVal');
  const modalDecQtyBtn = document.getElementById('modalDecQtyBtn');
  const modalIncQtyBtn = document.getElementById('modalIncQtyBtn');
  const modalAddBtn = document.getElementById('modalAddBtn');

  let activeModalProduct = null;
  let selectedModalColor = null;
  let modalQty = 1;
  let activeModalImages = [];
  let activeModalImageIndex = 0;

  window.openProductDetailsModal = function(product) {
    activeModalProduct = product;
    modalQty = 1;
    if (modalQtyVal) modalQtyVal.textContent = modalQty;

    // Localized values
    const title = currentLang === 'th' ? (product.title_th || product.title_en || '') : (product.title_en || product.title_th || '');
    const categoryLabel = currentLang === 'th' ? (product.category_th || product.category_en || '') : (product.category_en || product.category_th || '');
    const badge = currentLang === 'th' ? product.badge_th : product.badge_en;
    const priceVal = product.price ? parseFloat(product.price) : 0.00;
    
    // Detailed Description key mapping
    const descKey = `p${product.id}_desc_detail`;
    const description = translations[currentLang][descKey] || (currentLang === 'th' ? 'ไม่มีรายละเอียดภาษาไทย' : 'No description available');

    // Populate Details
    if (modalProductTitle) modalProductTitle.textContent = title;
    if (modalProductCategory) modalProductCategory.textContent = categoryLabel;
    if (modalProductPrice) modalProductPrice.textContent = `฿${priceVal.toFixed(2)}`;
    if (modalProductDesc) modalProductDesc.textContent = description;

    // Badge
    if (modalProductBadge) {
      if (badge) {
        modalProductBadge.textContent = badge;
        modalProductBadge.style.display = 'inline-block';
      } else {
        modalProductBadge.style.display = 'none';
      }
    }

    // Swatches / Colors
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

    if (modalProductSwatches) {
      modalProductSwatches.innerHTML = '';
      if (swatchesArray.length > 0) {
        selectedModalColor = swatchesArray[0];
        swatchesArray.forEach((swatch, idx) => {
          if (!swatch) return;
          const activeClass = idx === 0 ? 'active' : '';
          const colorClass = getSwatchColorClass(swatch);
          const swatchEl = document.createElement('div');
          swatchEl.className = `swatch ${colorClass} ${activeClass}`;
          swatchEl.setAttribute('data-color', swatch);
          swatchEl.addEventListener('click', () => {
            modalProductSwatches.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
            swatchEl.classList.add('active');
            selectedModalColor = swatch;
          });
          modalProductSwatches.appendChild(swatchEl);
        });
        modalProductSwatches.parentElement.style.display = 'flex';
      } else {
        selectedModalColor = 'Standard';
        modalProductSwatches.parentElement.style.display = 'none';
      }
    }

    // Image views (หลายวิว)
    // Map product IDs to their custom image arrays (incorporating main + lifestyle from other slides)
    let images = [product.image_url || 'assets/dog_bed.png'];
    if (product.id === 1) {
      images = [
        "assets/dog_bed.png",
        "assets/hero_banner.png",
        "assets/hero_slide3.png"
      ];
    } else if (product.id === 2) {
      images = [
        "assets/pet_bowl.png",
        "assets/hero_slide4.png",
        "assets/hero_slide5.png"
      ];
    } else if (product.id === 3) {
      images = [
        "assets/cat_scratch.png",
        "assets/hero_slide2.png",
        "assets/hero_slide4.png"
      ];
    } else if (product.images && Array.isArray(product.images)) {
      images = product.images;
    }

    activeModalImages = images;
    activeModalImageIndex = 0;
    if (modalMainImage) modalMainImage.src = images[0];

    // Populate thumbnails
    if (modalThumbnails) {
      modalThumbnails.innerHTML = '';
      images.forEach((imgSrc, idx) => {
        const activeClass = idx === 0 ? 'active' : '';
        const thumb = document.createElement('div');
        thumb.className = `modal-thumb ${activeClass}`;
        thumb.innerHTML = `<img src="${imgSrc}" alt="Thumbnail View ${idx + 1}">`;
        thumb.addEventListener('click', () => {
          setModalImage(idx);
        });
        modalThumbnails.appendChild(thumb);
      });
    }

    if (productDetailsModal && productModalBackdrop) {
      productDetailsModal.classList.add('open');
      productModalBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeProductDetailsModal = function() {
    if (productDetailsModal && productModalBackdrop) {
      productDetailsModal.classList.remove('open');
      productModalBackdrop.classList.remove('open');
      document.body.style.overflow = '';
      activeModalProduct = null;
    }
  };

  if (productModalCloseBtn) productModalCloseBtn.addEventListener('click', closeProductDetailsModal);
  if (productModalBackdrop) productModalBackdrop.addEventListener('click', closeProductDetailsModal);

  // Modal Quantity Handlers
  if (modalDecQtyBtn) {
    modalDecQtyBtn.addEventListener('click', () => {
      if (modalQty > 1) {
        modalQty--;
        if (modalQtyVal) modalQtyVal.textContent = modalQty;
      }
    });
  }
  if (modalIncQtyBtn) {
    modalIncQtyBtn.addEventListener('click', () => {
      modalQty++;
      if (modalQtyVal) modalQtyVal.textContent = modalQty;
    });
  }

  // Modal Add to Bag Action
  if (modalAddBtn) {
    modalAddBtn.addEventListener('click', () => {
      if (!activeModalProduct) return;
      
      const p = activeModalProduct;
      const titleKey = p.title_en || 'Product';
      const colorKey = selectedModalColor || 'Standard';
      
      // Check if item already exists in cart with same color
      const cartIndex = cart.findIndex(item => item.id === p.id && item.colorKey === colorKey);
      
      if (cartIndex !== -1) {
        cart[cartIndex].qty += modalQty;
      } else {
        cart.push({
          id: p.id,
          titleKey: titleKey,
          colorKey: colorKey,
          price: parseFloat(p.price || 0),
          img: p.image_url || 'assets/dog_bed.png',
          qty: modalQty
        });
      }
      
      saveCart();
      updateCartUI();
      closeProductDetailsModal();
      openCart(); // Slide open the cart to show it was added!
    });
  }

  // Helper to transition main image and sync thumbnails/lightbox
  function setModalImage(idx) {
    if (activeModalImages.length === 0) return;
    activeModalImageIndex = (idx + activeModalImages.length) % activeModalImages.length;
    const imgSrc = activeModalImages[activeModalImageIndex];
    if (modalMainImage) {
      modalMainImage.style.transform = 'scale(0.95)';
      modalMainImage.style.opacity = '0.5';
      setTimeout(() => {
        modalMainImage.src = imgSrc;
        modalMainImage.style.transform = 'scale(1)';
        modalMainImage.style.opacity = '1';
      }, 150);
    }
    
    // Sync active class on thumbnails
    if (modalThumbnails) {
      const thumbs = modalThumbnails.querySelectorAll('.modal-thumb');
      thumbs.forEach((t, i) => {
        if (i === activeModalImageIndex) {
          t.classList.add('active');
        } else {
          t.classList.remove('active');
        }
      });
    }

    // Sync Lightbox image if open
    const lightboxImage = document.getElementById('lightboxImage');
    if (lightboxImage && lightboxModal.classList.contains('open')) {
      lightboxImage.src = imgSrc;
    }
  }

  // Bind Details Modal Gallery Arrow Clicks
  const modalGalleryPrev = document.getElementById('modalGalleryPrev');
  const modalGalleryNext = document.getElementById('modalGalleryNext');

  if (modalGalleryPrev) {
    modalGalleryPrev.addEventListener('click', (e) => {
      e.stopPropagation(); // Avoid triggering lightbox on arrow click
      setModalImage(activeModalImageIndex - 1);
    });
  }
  if (modalGalleryNext) {
    modalGalleryNext.addEventListener('click', (e) => {
      e.stopPropagation(); // Avoid triggering lightbox on arrow click
      setModalImage(activeModalImageIndex + 1);
    });
  }

  // --- Fullscreen Lightbox Controller ---
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');

  // Click main image to open fullscreen Lightbox
  if (modalMainImage) {
    modalMainImage.addEventListener('click', () => {
      if (lightboxModal && lightboxImage && activeModalImages.length > 0) {
        lightboxImage.src = activeModalImages[activeModalImageIndex];
        lightboxModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('open');
      // If parent details modal is also closed, reset body overflow; otherwise keep locked
      if (!productDetailsModal.classList.contains('open')) {
        document.body.style.overflow = '';
      }
    }
  }

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  
  // Close Lightbox on clicking outside image container
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal || (!e.target.closest('.lightbox-content') && !e.target.closest('.lightbox-arrow') && !e.target.closest('.lightbox-close'))) {
        closeLightbox();
      }
    });
  }

  // Bind Lightbox Navigation Arrows
  if (lightboxPrevBtn) {
    lightboxPrevBtn.addEventListener('click', () => {
      setModalImage(activeModalImageIndex - 1);
    });
  }
  if (lightboxNextBtn) {
    lightboxNextBtn.addEventListener('click', () => {
      setModalImage(activeModalImageIndex + 1);
    });
  }

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = document.getElementById('submitOrderBtn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = currentLang === 'th' ? 'กำลังส่งข้อมูลออเดอร์...' : 'Placing Order...';
      }

      const name = document.getElementById('checkoutName').value;
      const email = document.getElementById('checkoutEmail').value;
      const address = document.getElementById('checkoutAddress').value;
      const subtotal = cart.reduce((total, item) => total + (item.price * item.qty), 0);

      // Map cart items into DB schema structure
      const itemsList = cart.map(item => {
        const titleText = translations[currentLang][item.titleKey] || item.titleKey;
        const colorText = translations[currentLang][item.colorKey] || item.colorKey;
        return {
          id: item.id,
          title: titleText,
          price: item.price,
          qty: item.qty,
          color: colorText
        };
      });

      let orderId = 'LP-' + Math.floor(100000 + Math.random() * 900000);

      if (db) {
        try {
          // Write the checkout order row to Firebase Firestore 'orders' collection
          const orderRef = await db.collection('orders').add({
            customer_name: name,
            customer_email: email,
            shipping_address: address,
            items: itemsList,
            total_price: subtotal,
            status: 'pending',
            created_at: firebase.firestore.FieldValue.serverTimestamp()
          });

          // Generate an order ID using the Firestore doc ID
          orderId = 'LP-' + orderRef.id.slice(0, 8).toUpperCase();
          console.log("Order saved on Firebase Firestore successfully:", orderRef.id);
        } catch (err) {
          console.error("Database order insertion failed:", err);
          // Fallback to random order ID if connection is lost so customer is not stuck
        }
      } else {
        console.log("Firebase not connected. Local checkout simulation succeeded.");
      }

      // Display success details
      if (successOrderId) successOrderId.textContent = orderId;
      
      closeCheckout();

      // Clear Cart
      cart = [];
      try {
        localStorage.setItem('luxepaws_cart', JSON.stringify(cart));
      } catch (err) {
        console.warn("Storage write error:", err);
      }
      updateCartUI();

      // Open Success modal
      if (successModal && successBackdrop) {
        successModal.classList.add('open');
        successBackdrop.classList.add('open');
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = currentLang === 'th' ? 'ยืนยันการสั่งซื้อ' : 'Place Order';
      }

      checkoutForm.reset();
    });
  }

  function closeSuccess() {
    if (successModal && successBackdrop) {
      successModal.classList.remove('open');
      successBackdrop.classList.remove('open');
    }
  }

  if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeSuccess);
  if (successBackdrop) successBackdrop.addEventListener('click', closeSuccess);

  // --- Filtering Logic (Working on Dynamic DOM Nodes) ---
  const filterBtns = document.querySelectorAll('.filter-btn');

  function filterProducts(category) {
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

  // --- FAQ Accordion Logic ---
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const faqItem = btn.parentElement;
      const isActive = faqItem.classList.contains('active');
      
      // Close other items
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        const answer = item.querySelector('.faq-answer');
        if (answer) answer.style.maxHeight = null;
      });
      
      if (!isActive) {
        faqItem.classList.add('active');
        const answer = faqItem.querySelector('.faq-answer');
        if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // --- Custom Inquiry Form Submission ---
  const customInquiryForm = document.getElementById('customInquiryForm');
  if (customInquiryForm) {
    customInquiryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = document.getElementById('customSubmitBtn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = currentLang === 'th' ? 'กำลังส่งข้อมูล...' : 'Sending...';
      }

      const name = document.getElementById('customName').value;
      const email = document.getElementById('customEmail').value;
      const petType = document.getElementById('customPetType').value;
      const wood = document.getElementById('customWood').value;
      const notes = document.getElementById('customNotes').value;

      if (db) {
        try {
          await db.collection('custom_inquiries').add({
            name,
            email,
            pet_type: petType,
            wood_choice: wood,
            notes,
            created_at: firebase.firestore.FieldValue.serverTimestamp()
          });
          
          alert(translations[currentLang].custom_success || "Inquiry sent successfully!");
          customInquiryForm.reset();
        } catch (err) {
          console.error("Custom inquiry save failed:", err);
          alert(currentLang === 'th' ? "เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง" : "Failed to save inquiry. Please try again.");
        }
      } else {
        // Mock success fallback
        console.log("Mock custom design inquiry submitted:", { name, email, petType, wood, notes });
        alert(translations[currentLang].custom_success || "Inquiry sent successfully!");
        customInquiryForm.reset();
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = translations[currentLang].custom_submit || 'Send Inquiry';
      }
    });
  }

  // --- High-Performance Scrollspy Navigation Highlight ---
  const spySections = document.querySelectorAll('section[id], footer[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        navItems.forEach(item => {
          const href = item.getAttribute('href');
          if (href === `#${id}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  spySections.forEach(section => observer.observe(section));

  async function applyCmsSettings() {
    if (db) {
      try {
        console.log("Fetching custom CMS storefront settings from Firebase Firestore...");
        const doc = await db.collection('storefront_settings').doc('main').get();
        if (doc.exists) {
          const data = doc.data();
          
          // 1. Override Translations keys for brand story (Philosophy)
          if (data.story) {
            translations.en.story_title = data.story.title_en || translations.en.story_title;
            translations.th.story_title = data.story.title_th || translations.th.story_title;
            translations.en.story_p1 = data.story.p1_en || translations.en.story_p1;
            translations.th.story_p1 = data.story.p1_th || translations.th.story_p1;
            translations.en.story_p2 = data.story.p2_en || translations.en.story_p2;
            translations.th.story_p2 = data.story.p2_th || translations.th.story_p2;
            translations.en.story_btn = data.story.btn_en || translations.en.story_btn;
            translations.th.story_btn = data.story.btn_th || translations.th.story_btn;
            
            // Render custom story image directly
            const storyImg = document.querySelector('.story-img-wrap img');
            if (storyImg && data.story.img) storyImg.src = data.story.img;
          }
          
          // 2. Override Hero Slides text & images
          if (Array.isArray(data.hero_slides)) {
            const slides = document.querySelectorAll('.slide');
            data.hero_slides.forEach((slide, idx) => {
              if (slides[idx]) {
                const img = slides[idx].querySelector('img');
                const title = slides[idx].querySelector('.hero-title');
                
                if (img && slide.img) img.src = slide.img;
                
                const key = `hero_slide_title_${idx + 1}`;
                translations.en[key] = slide.title_en;
                translations.th[key] = slide.title_th;
                
                if (title) {
                  title.setAttribute('data-i18n', key);
                }
              }
            });
          }
          
          // 3. Override Gallery images and captions
          if (Array.isArray(data.gallery)) {
            const galleryItems = document.querySelectorAll('.gallery-grid .gallery-item');
            data.gallery.forEach((item, idx) => {
              if (galleryItems[idx]) {
                const img = galleryItems[idx].querySelector('img');
                const cap = galleryItems[idx].querySelector('.gallery-caption');
                
                if (img && item.img) img.src = item.img;
                
                const key = `gallery_cap_${idx + 1}`;
                translations.en[key] = item.cap_en;
                translations.th[key] = item.cap_th;
                if (cap) cap.setAttribute('data-i18n', key);
              }
            });
          }
          
          // 4. Override Blog cards
          if (Array.isArray(data.blog)) {
            const blogCards = document.querySelectorAll('.blog-grid .blog-card');
            data.blog.forEach((post, idx) => {
              if (blogCards[idx]) {
                const img = blogCards[idx].querySelector('.blog-img-wrap img');
                const tag = blogCards[idx].querySelector('.blog-content .blog-tag');
                const title = blogCards[idx].querySelector('.blog-content h3');
                const excerpt = blogCards[idx].querySelector('.blog-content p');
                
                if (img && post.img) img.src = post.img;
                
                const keyTag = `blog_tag_${idx + 1}`;
                const keyTitle = `blog_title_${idx + 1}`;
                const keyExcerpt = `blog_excerpt_${idx + 1}`;
                
                translations.en[keyTag] = post.tag_en;
                translations.th[keyTag] = post.tag_th;
                translations.en[keyTitle] = post.title_en;
                translations.th[keyTitle] = post.title_th;
                translations.en[keyExcerpt] = post.excerpt_en;
                translations.th[keyExcerpt] = post.excerpt_th;
                
                if (tag) tag.setAttribute('data-i18n', keyTag);
                if (title) title.setAttribute('data-i18n', keyTitle);
                if (excerpt) excerpt.setAttribute('data-i18n', keyExcerpt);
              }
            });
          }
          
          // 5. Override Customer Reviews
          if (Array.isArray(data.reviews)) {
            const reviewCards = document.querySelectorAll('.reviews-grid .review-card');
            data.reviews.forEach((review, idx) => {
              if (reviewCards[idx]) {
                const text = reviewCards[idx].querySelector('.review-text');
                const name = reviewCards[idx].querySelector('.reviewer-name');
                const title = reviewCards[idx].querySelector('.reviewer-title');
                
                if (name && review.name) name.textContent = review.name;
                
                const keyText = `review_text_${idx + 1}`;
                const keyTitle = `reviewer_title_${idx + 1}`;
                
                translations.en[keyText] = review.text_en;
                translations.th[keyText] = review.text_th;
                translations.en[keyTitle] = review.title_en;
                translations.th[keyTitle] = review.title_th;
                
                if (text) text.setAttribute('data-i18n', keyText);
                if (title) title.setAttribute('data-i18n', keyTitle);
              }
            });
          }
          
          // 6. Override FAQ accordion
          if (Array.isArray(data.faq)) {
            const faqItems = document.querySelectorAll('.faq-list .faq-item');
            data.faq.forEach((item, idx) => {
              if (faqItems[idx]) {
                const qSpan = faqItems[idx].querySelector('.faq-question span');
                const aPara = faqItems[idx].querySelector('.faq-answer p');
                
                const keyQ = `faq_q_${idx + 1}`;
                const keyA = `faq_a_${idx + 1}`;
                
                translations.en[keyQ] = item.q_en;
                translations.th[keyQ] = item.q_th;
                translations.en[keyA] = item.a_en;
                translations.th[keyA] = item.a_th;
                
                if (qSpan) qSpan.setAttribute('data-i18n', keyQ);
                if (aPara) aPara.setAttribute('data-i18n', keyA);
              }
            });
          }
          
          // Re-translate all elements with the overridden translations!
          setLanguage(currentLang);
        }
      } catch (err) {
        console.warn("Failed to load storefront custom CMS configurations:", err);
      }
    }
  }

  // Initialize: Load products from Supabase or Fallback
  loadProducts();
  
  // --- Blog Posts Specifications & Dynamic Render Engine ---
  const blogPosts = [
    {
      id: 1,
      tag_en: "Interior",
      tag_th: "การตกแต่งภายใน",
      title_en: "Integrating Pet Beds Into Modern Living Rooms",
      title_th: "การจัดระเบียบที่นอนสัตว์เลี้ยงเข้ากับห้องนั่งเล่นยุคใหม่",
      excerpt_en: "Discover how to position your pet's nesting space to complement Scandinavian minimalism and maintain design cohesion.",
      excerpt_th: "ค้นพบวิธีการจัดวางและเลือกซื้อที่นอนสัตว์เลี้ยงให้เข้ากับสไตล์มินิมอลแบบสแกนดิเนเวียได้อย่างกลมกลืน",
      img: "assets/blog_post1.png",
      date: "July 8, 2026",
      body_en: `
        <p>A beautiful home should be a sanctuary for everyone who lives in it—including your four-legged companions. For too long, pet owners have felt forced to choose between design integrity and their pet’s comfort. Standard pet beds are often bulky, brightly colored eyesores that disrupt the visual flow of a curated space.</p>
        <p>At LuxePaws, we believe in a different philosophy: pet furniture should elevate, not compromise, your home's aesthetics. Here is our guide on seamlessly integrating a pet bed into a modern Scandinavian living room.</p>
        <h3>1. Color Harmony and Neutral Tones</h3>
        <p>Choose pet furniture crafted from neutral, natural colors that blend with your room’s palette. Hues of warm oatmeal, slate grey, charcoal, and soft creams allow the bed to sit quietly in the space rather than clamoring for attention.</p>
        <h3>2. Material Honesty</h3>
        <p>Use beds constructed with genuine, high-quality organic materials. Wool felt, organic cotton canvas, and genuine leather details carry natural texture that complements other soft furnishings like rugs, throw blankets, and curtains.</p>
        <h3>3. Placement as a Design Choice</h3>
        <p>Rather than hiding the pet bed in a dark corner or a busy hallway, treat it as a deliberate design element. Place it adjacent to a statement lounge chair, or nestled beneath a floating side table. This preserves room flow while keeping your pet close to the family action.</p>
      `,
      body_th: `
        <p>บ้านที่สวยงามควรเป็นสถานที่พักผ่อนที่ปลอดภัยสำหรับทุกคนที่อาศัยอยู่—รวมถึงเพื่อนรักสี่ขาของคุณด้วย เป็นเวลานานแล้วที่เจ้าของสัตว์เลี้ยงรู้สึกว่าต้องเลือกระหว่างความสวยงามของบ้านและความสะดวกสบายของสัตว์เลี้ยง เนื่องจากเบาะนอนสัตว์เลี้ยงทั่วไปมักจะมีสีสันฉูดฉาดและรูปทรงเทอะทะที่ทำลายบรรยากาศโดยรวมของห้อง</p>
        <p>ที่ LuxePaws เราเชื่อในปรัชญาที่ต่างออกไป: เฟอร์นิเจอร์สัตว์เลี้ยงควรยกระดับสุนทรียภาพของบ้านคุณให้ดียิ่งขึ้น นี่คือคำแนะนำของเราในการจัดวางที่นอนสัตว์เลี้ยงให้เข้ากับห้องนั่งเล่นสไตล์สแกนดิเนเวียยุคใหม่ได้อย่างลงตัว</p>
        <h3>1. ความสอดคล้องของสีและโทนสีธรรมชาติ</h3>
        <p>เลือกเฟอร์นิเจอร์สัตว์เลี้ยงที่ทำจากสีที่เป็นกลางและเป็นธรรมชาติซึ่งเข้ากับจานสีของห้องคุณ โทนสีครีมอุ่น เทาชาร์โคล และน้ำตาลอ่อน ช่วยให้เบาะนอนอยู่ร่วมในพื้นที่ได้อย่างเงียบสงบและอบอุ่น</p>
        <h3>2. ความซื่อสัตย์ในวัสดุแท้</h3>
        <p>เลือกที่นอนที่สร้างขึ้นจากวัสดุธรรมชาติคุณภาพสูง เช่น ใยขนแกะธรรมชาติ 100% (Wool felt) หรือผ้าฝ้ายออร์แกนิก เพื่อนำผิวสัมผัสที่เป็นธรรมชาติมาเสริมความเข้ากันกับพรม ผ้าม่าน และเฟอร์นิเจอร์หลักตัวอื่น ๆ ในห้อง</p>
        <h3>3. การจัดวางเสมือนชิ้นส่วนงานออกแบบ</h3>
        <p>แทนที่จะซ่อนที่นอนของสัตว์เลี้ยงไว้ในมุมอับหรือทางเดินที่วุ่นวาย ให้จัดวางมันอย่างตั้งใจเคียงข้างกับเก้าอี้พักผ่อนตัวโปรด หรือจัดเข้ามุมใต้โต๊ะข้างลอยตัว วิธีนี้ช่วยรักษาทิศทางการเดินในห้องและช่วยให้สัตว์เลี้ยงรู้สึกปลอดภัยใกล้ชิดกับทุกคนในครอบครัว</p>
      `
    },
    {
      id: 2,
      tag_en: "Architecture",
      tag_th: "สถาปัตยกรรมแมว",
      title_en: "The Rise of 'Catification': Wall Climbing Guides",
      title_th: "ศิลปะการแต่งบ้านเพื่อเจ้าเหมียว: คู่มือติดตั้งคอนโดปีนป่ายติดผนัง",
      excerpt_en: "Unlock your cat's climbing instincts without sacrificing wall space. The ultimate architectural climbing layout guide.",
      excerpt_th: "ไขความลับสัญชาตญาณการปีนป่ายของแมวโดยไม่เสียพื้นที่ทางเดิน ด้วยไอเดียการจัดสัดส่วนแนวผนัง",
      img: "assets/blog_post2.png",
      date: "July 9, 2026",
      body_en: `
        <p>Cats are natural climbers. In the wild, high vantage points offer safety, a clear view of their territory, and optimal hunting positions. In our homes, vertical space is often overlooked, leaving active felines with restricted territory and leading to stress-related behaviors.</p>
        <p>The solution is 'Catification'—the art of designing your home's vertical space to accommodate feline needs while keeping it visually stunning.</p>
        <h3>1. The Vertical Highway Concept</h3>
        <p>Create a logical, continuous path for your cat to traverse the room without touching the floor. A good wall layout starts from an easy jumping point (like a sofa arm or a side table), leads to staggered ash wood steps, and culminates in a high-elevation resting platform or cocoon pod.</p>
        <h3>2. Choosing the Right Anchors</h3>
        <p>Safety is paramount when installing wall-mounted pet furniture. Ensure all heavy-duty shelves and climbing steps are anchored securely into wall studs or using specialized plasterboard toggle bolts. A shaking shelf will deter your cat from using it.</p>
        <h3>3. Material Integration</h3>
        <p>Modern catification avoids carpet-covered posts. Instead, opt for solid timber pieces wrapped in premium sisal rope. This provides superior grip and durability while matching wood flooring, timber panels, and high-end cabinetry.</p>
      `,
      body_th: `
        <p>แมวเป็นนักปีนป่ายโดยสัญชาตญาณ ในป่าธรรมชาติ พื้นที่สูงมอบความรู้สึกปลอดภัย ช่วยให้พวกเขามองเห็นอาณาเขตได้กว้างไกลและล่าเหยื่อได้ดีขึ้น แต่ในบ้านของเรา พื้นที่แนวตั้งมักถูกมองข้าม ทำให้เจ้าเหมียวมีอาณาเขตจำกัดและเกิดพฤติกรรมความเครียดได้ง่าย</p>
        <p>ทางออกคือ 'Catification'—ศิลปะการออกแบบพื้นที่แนวตั้งในบ้านคุณเพื่อตอบสนองความต้องการของแมว พร้อมทั้งรักษาสัดส่วนการตกแต่งภายในให้สวยงามตระการตา</p>
        <h3>1. แนวคิด 'ทางหลวงแนวตั้ง' (Vertical Highway)</h3>
        <p>สร้างเส้นทางปีนป่ายแนวผนังที่ต่อเนื่องและสมเหตุสมผล เพื่อให้แมวสามารถเดินสำรวจห้องได้โดยไม่ต้องลงสัมผัสพื้น เริ่มจากจุดกระโดดเริ่มต้นที่เหมาะสม (เช่น แขนโซฟาหรือโต๊ะข้าง) ขึ้นไปตามชั้นบันไดไม้แอชแบบสลับฟันปลา และสิ้นสุดที่รังนอนทรงสูง</p>
        <h3>2. การยึดเกาะโครงสร้างที่มั่นคง</h3>
        <p>ความปลอดภัยคือสิ่งสำคัญที่สุดในการติดตั้งชั้นลอยสำหรับสัตว์เลี้ยง ตรวจสอบให้แน่ใจว่าอุปกรณ์ยึดผนังทั้งหมดเจาะยึดเข้ากับโครงสร้างเสาหรือพุกผนังปูนที่แข็งแรง ชั้นลอยที่มีความโอนเอนจะทำให้แมวไม่กล้าก้าวขึ้นไปใช้งาน</p>
        <h3>3. การผสานสไตล์วัสดุ</h3>
        <p>หลีกเลี่ยงคอนโดแมวที่หุ้มด้วยพรมขนสัตว์เทียมสีสะท้อนแสง ให้หันมาเลือกใช้อุปกรณ์ไม้แท้ที่มีการพันเชือกป่านศรนารายณ์คุณภาพสูงสีนวลธรรมชาติ ซึ่งมอบการยึดเกาะที่ดีเยี่ยม ทนทานกว่า และเข้ากับสีพื้นไม้หรือตู้บิลต์อินสไตล์โมเดิร์นได้อย่างไร้รอยต่อ</p>
      `
    },
    {
      id: 3,
      tag_en: "Health",
      tag_th: "สุขภาพสัตว์เลี้ยง",
      title_en: "The Ergonomics of Elevated Pet Feeder Bowls",
      title_th: "สรีรศาสตร์ของการเลือกชามอาหารสัตว์เลี้ยงแบบยกสูง",
      excerpt_en: "Why vet science recommends elevated oak wood stands to improve digestion and posture for aging cats and dogs.",
      excerpt_th: "ทำไมสัตวแพทย์จึงแนะนำชั้นวางชามอาหารไม้โอ๊คแบบยกสูง เพื่อช่วยเรื่องระบบย่อยอาหารและข้อต่อ",
      img: "assets/blog_post3.png",
      date: "July 10, 2026",
      body_en: `
        <p>Have you noticed how felines and canines feed? Traditional pet bowls placed directly on the kitchen floor force your pet to bend low, straining their neck muscles and compressing their esophagus. This posture is not only uncomfortable but can actively harm their long-term health.</p>
        <p>Veterinarians and animal behaviorists widely recommend switching to elevated feeding platforms. Here's why ergonomic dining makes a massive difference.</p>
        <h3>1. Improved Digestive Alignment</h3>
        <p>When a pet eats from a floor-level bowl, gravity works against their digestive tract, requiring additional muscular effort to push food down the esophagus. An elevated stand allows the food to travel in a straight, natural path, significantly reducing instances of acid reflux, vomiting, and bloating.</p>
        <h3>2. Joints Protection for Aging Pets</h3>
        <p>For mature or senior pets suffering from arthritis, dysplasia, or spinal conditions, bending down to eat is painful. Elevating the bowls brings the food and water directly to their comfortable standing height, relieving pressure on the neck, shoulders, and forelimbs.</p>
        <h3>3. Cleanliness and Stability</h3>
        <p>Floor bowls are easily tipped over or pushed across the room. An ergonomic wooden feeder, like our Desco stand, provides a heavy, slip-resistant base that locks ceramic bowls in place. This prevents mealtime mess and keeps food and water cleaner.</p>
      `,
      body_th: `
        <p>คุณเคยสังเกตท่าทางเวลาสัตว์เลี้ยงรับประทานอาหารหรือไม่? การวางชามอาหารไว้กับพื้นโดยตรง บังคับให้สุนัขและแมวต้องก้มตัวลงต่ำมาก ซึ่งทำให้กล้ามเนื้อคอตึงและหลอดอาหารเกิดการบีบตัว ท่าทางนี้ไม่เพียงแค่สร้างความอึดอัด แต่ยังส่งผลเสียระยะยาวต่อระบบทางเดินอาหาร</p>
        <p>สัตวแพทย์และผู้เชี่ยวชาญพฤติกรรมสัตว์ต่างแนะนำให้เปลี่ยนมาใช้ชั้นวางชามอาหารระดับยกสูง นี่คือเหตุผลว่าทำไมสรีรศาสตร์การกินจึงมีความสำคัญอย่างมาก</p>
        <h3>1. ทิศทางการย่อยอาหารที่เป็นธรรมชาติ</h3>
        <p>การก้มกินจากพื้นจะทำให้หลอดอาหารโค้งงอและบดบังทิศทางของอาหาร ส่งผลให้ทางเดินอาหารทำงานหนักขึ้น การเปลี่ยนมาใช้อุปกรณ์ยกสูงช่วยให้อาหารเดินทางเป็นแนวตรงและราบรื่นตามธรรมชาติ ลดอาการกรดไหลย้อน ท้องอืด และอาเจียนหลังกินอาหาร</p>
        <h3>2. ถนอมข้อต่อสำหรับสัตว์เลี้ยงที่มีอายุมาก</h3>
        <p>สำหรับสุนัขและแมวอายุมากที่มีปัญหาข้อต่ออักเสบ โรคกระดูกสันหลัง หรือโรคข้อสะโพกเสื่อม การก้มลงต่ำมากจะสร้างความเจ็บปวด ชั้นวางที่ยกขึ้นจะช่วยนำอาหารและน้ำมาอยู่ในระดับความสูงที่พอเหมาะ ทำให้พวกเขาสามารถยืนทานได้โดยไม่ต้องรับแรงกดทับที่ไหล่และขาหน้า</p>
        <h3>3. ความสะอาดและความมั่นคงของชาม</h3>
        <p>ชามอาหารที่วางราบกับพื้นมักจะลื่นไถลหรือถูกคว่ำได้ง่าย ที่ป้อนอาหารไม้โอ๊ค Desco ของเรามีน้ำหนักที่พอดีและมียางรองกันลื่นใต้ฐาน ช่วยล็อกชามเซรามิกให้อยู่กับที่ ป้องกันเศษอาหารหกเลอะเทอะพื้นครัวของคุณ</p>
      `
    },
    {
      id: 4,
      tag_en: "Materials",
      tag_th: "วัสดุระดับพรีเมียม",
      title_en: "Felt & Solid Timber: Choosing Sustainable Materials",
      title_th: "ผ้าสักหลาดขนสัตว์และไม้จริง: การเลือกวัสดุเฟอร์นิเจอร์สัตว์เลี้ยงที่ยั่งยืน",
      excerpt_en: "Why luxury pet furniture relies on natural wool felt and certified European timber for longevity and pet wellness.",
      excerpt_th: "เจาะลึกทำไมเฟอร์นิเจอร์สัตว์เลี้ยงระดับไฮเอนด์จึงเลือกใช้ใยขนแกะธรรมชาติและไม้ป่าหมุนเวียนเพื่อสุขภาพสัตว์เลี้ยง",
      img: "assets/blog_post4.png",
      date: "July 10, 2026",
      body_en: `
        <p>In an era dominated by cheap plastics and engineered particle boards, choosing high-end furniture for your pet is a vote for sustainability, indoor air quality, and product longevity. Pet furniture experiences high physical wear: scratching, clawing, chewing, and frequent cleaning.</p>
        <p>Here is why LuxePaws focuses strictly on natural wool felt and certified solid timber materials.</p>
        <h3>1. The Purity of 100% Wool Felt</h3>
        <p>Synthetic fibers like polyester felt static-charge quickly and trap odors and pet dander. 100% organic wool felt is naturally hypoallergenic, anti-static, and dirt-repellent. The fibers contain natural lanolin oils which repel moisture, making it incredibly easy to clean with a simple brush or vacuum.</p>
        <h3>2. Solid European Hardwoods</h3>
        <p>Cheap particle board (MDF) furniture contains toxic formaldehyde adhesives that off-gas into your home. Solid European ash and oak timbers are renewable, structurally robust, and carry a unique timber glaze that improves with age. We seal our timbers only with water-based, pet-safe plant oils.</p>
        <h3>3. Lifetime Value vs. Disposable Culture</h3>
        <p>Investing in furniture crafted with natural hardwood and heavy felt means purchasing an heirloom piece. These materials are built to withstand natural pet behaviors and can be renewed or repaired over a lifetime, reducing environmental waste and saving you money in the long run.</p>
      `,
      body_th: `
        <p>ในยุคที่ตลาดเต็มไปด้วยพลาสติกราคาถูกและแผ่นไม้ปาร์ติเกิลอัดกาว การเลือกเฟอร์นิเจอร์คุณภาพสูงให้สัตว์เลี้ยงคือการดูแลสุขอนามัยภายในบ้าน สุขภาพของสัตว์เลี้ยง และการันตีความคุค่าระยะยาว เนื่องจากเฟอร์นิเจอร์สัตว์เลี้ยงต้องเผชิญกับแรงขีดข่วน กัด แทะ และทำความสะอาดบ่อยครั้ง</p>
        <p>นี่คือเหตุผลที่ LuxePaws เจาะจงเลือกใช้เพียงสองวัสดุหลัก: ใยสักหลาดขนแกะธรรมชาติ 100% และไม้แท้จากป่าหมุนเวียนยุโรป</p>
        <h3>1. ความบริสุทธิ์ของใยขนแกะธรรมชาติ (100% Organic Wool Felt)</h3>
        <p>ใยสังเคราะห์จำพวกโพลีเอสเตอร์มักจะสะสมไฟฟ้าสถิต ดักจับฝุ่นและกลิ่นตัวของสัตว์เลี้ยงได้ง่าย ต่างจากใยสักหลาดขนแกะธรรมชาติ 100% ที่ไม่ก่อให้เกิดอาการแพ้ มีแรงสะท้อนฝุ่นธรรมชาติ และเคลือบด้วยน้ำมันลาโนลินอ่อน ๆ ตามธรรมชาติ ช่วยต้านน้ำซึมและทำความสะอาดง่ายด้วยการดูดฝุ่นเบา ๆ</p>
        <h3>2. ไม้เนื้อแข็งแท้ยุโรป (Solid Timber)</h3>
        <p>เฟอร์นิเจอร์ไม้บดอัดราคาถูกมักใช้สารเคมีจำพวกฟอร์มาลดีไฮด์ในการอัดกาว ซึ่งปล่อยก๊าซพิษจาง ๆ ออกมาทำลายสุขภาพการหายใจของสุนัขและแมวตลอดเวลา ไม้แอชและไม้โอ๊คแท้ 100% ปลอดภัย ไร้สารเคมี มีความทนทานสูง ปรับแต่งและขัดสีใหม่ได้ และเราเลือกเคลือบกันน้ำด้วยน้ำมันพืชธรรมชาติที่ปลอดภัยต่อการเลียแทะของสัตว์เลี้ยง</p>
        <h3>3. มูลค่าชั่วอายุขัยและการลดขยะสิ่งแวดล้อม</h3>
        <p>การลงทุนในงานฝีมือไม้จริงและสักหลาดธรรมชาติหมายถึงการครอบครองเฟอร์นิเจอร์ที่จะอยู่คู่กับคุณและสัตว์เลี้ยงไปชั่วชีวิต ไม่ต้องเปลี่ยนชิ้นใหม่บ่อยครั้ง ลดขยะอุตสาหกรรม และช่วยประหยัดเงินในกระเป๋าของคุณในระยะยาวได้อย่างแท้จริง</p>
      `
    }
  ];

  const blogGrid = document.getElementById('blogGrid');
  const blogDetailModal = document.getElementById('blogDetailModal');
  const blogModalBackdrop = document.getElementById('blogModalBackdrop');
  const blogModalCloseBtn = document.getElementById('blogModalCloseBtn');

  window.renderBlogGrid = function() {
    if (!blogGrid) return;
    blogGrid.innerHTML = '';

    blogPosts.forEach(post => {
      const title = currentLang === 'th' ? post.title_th : post.title_en;
      const tag = currentLang === 'th' ? post.tag_th : post.tag_en;
      const excerpt = currentLang === 'th' ? post.excerpt_th : post.excerpt_en;
      const readMoreText = currentLang === 'th' ? 'อ่านบทความเพิ่มเติม' : 'Read Article';

      const card = document.createElement('article');
      card.className = 'blog-card';
      card.innerHTML = `
        <div class="blog-img-wrap">
          <img src="${post.img}" alt="${title}">
        </div>
        <div class="blog-content">
          <span class="blog-tag">${tag}</span>
          <h3>${title}</h3>
          <p>${excerpt}</p>
          <a href="#" class="read-more" onclick="event.preventDefault(); openBlogDetail(${post.id});">${readMoreText} <i class="fa-solid fa-arrow-right-long"></i></a>
        </div>
      `;
      
      card.addEventListener('click', (e) => {
        if (e.target.closest('.read-more')) return;
        openBlogDetail(post.id);
      });

      blogGrid.appendChild(card);
    });
  };

  window.openBlogDetail = function(postId) {
    const post = blogPosts.find(p => p.id === postId);
    if (!post) return;

    const title = currentLang === 'th' ? post.title_th : post.title_en;
    const tag = currentLang === 'th' ? post.tag_th : post.tag_en;
    const body = currentLang === 'th' ? post.body_th : post.body_en;

    const blogModalTitle = document.getElementById('blogModalTitle');
    const blogModalTag = document.getElementById('blogModalTag');
    const blogModalImage = document.getElementById('blogModalImage');
    const blogModalBody = document.getElementById('blogModalBody');
    const blogModalDate = document.getElementById('blogModalDate');
    const blogModalAuthor = document.getElementById('blogModalAuthor');

    if (blogModalTitle) blogModalTitle.textContent = title;
    if (blogModalTag) blogModalTag.textContent = tag;
    if (blogModalImage) blogModalImage.src = post.img;
    if (blogModalBody) blogModalBody.innerHTML = body;
    if (blogModalDate) blogModalDate.textContent = post.date;
    if (blogModalAuthor) blogModalAuthor.textContent = currentLang === 'th' ? 'บรรณาธิการ LuxePaws' : 'By LuxePaws Editor';

    if (blogDetailModal && blogModalBackdrop) {
      blogDetailModal.classList.add('open');
      blogModalBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeBlogDetail = function() {
    if (blogDetailModal && blogModalBackdrop) {
      blogDetailModal.classList.remove('open');
      blogModalBackdrop.classList.remove('open');
      const detailsModal = document.getElementById('productDetailsModal');
      const searchOverlay = document.getElementById('searchOverlay');
      const checkoutModal = document.getElementById('checkoutModal');
      if (
        (!detailsModal || !detailsModal.classList.contains('open')) &&
        (!searchOverlay || !searchOverlay.classList.contains('open')) &&
        (!checkoutModal || !checkoutModal.classList.contains('open'))
      ) {
        document.body.style.overflow = '';
      }
    }
  };

  if (blogModalCloseBtn) blogModalCloseBtn.addEventListener('click', closeBlogDetail);
  if (blogModalBackdrop) blogModalBackdrop.addEventListener('click', closeBlogDetail);

  // --- Toast Notification Helper ---
  function showToast(message) {
    let toast = document.getElementById('customToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'customToast';
      toast.className = 'toast-container';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  // --- Newsletter Form Submission Handler ---
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const submitBtn = newsletterForm.querySelector('button[type="submit"]');
      if (!emailInput || !emailInput.value.trim()) return;

      const email = emailInput.value.trim();
      const originalText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = currentLang === 'th' ? 'กำลังบันทึก...' : 'Subscribing...';
      }

      try {
        // Save to Firebase Firestore subscribers collection
        if (typeof db !== 'undefined') {
          await db.collection('subscribers').add({
            email: email,
            subscribed_at: firebase.firestore.FieldValue.serverTimestamp()
          });
        }
        
        // Show success toast
        const successMsg = currentLang === 'th' ? 'สมัครสมาชิกสำเร็จ! ขอบคุณค่ะ' : 'Subscribed successfully! Thank you.';
        showToast(successMsg);
        emailInput.value = '';
      } catch (err) {
        console.warn("Firestore newsletter subscription failed, fallback simulation:", err);
        // Fallback simulation (graceful degradation)
        const successMsg = currentLang === 'th' ? 'สมัครสมาชิกสำเร็จ! ขอบคุณค่ะ' : 'Subscribed successfully! Thank you.';
        showToast(successMsg);
        emailInput.value = '';
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      }
    });
  }

  // --- Apple-style Search Overlay Controller ---
  const searchBtn = document.getElementById('searchBtn');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchCloseBtn = document.getElementById('searchCloseBtn');
  const searchInput = document.getElementById('searchInput');
  const searchResultsGrid = document.getElementById('searchResultsGrid');
  const searchResultsTitle = document.getElementById('searchResultsTitle');

  function openSearch() {
    if (searchOverlay) {
      searchOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (searchInput) {
        searchInput.value = '';
        setTimeout(() => searchInput.focus(), 150);
      }
      renderSearchResults(''); // Show suggestions initially
    }
  }

  function closeSearch() {
    if (searchOverlay) {
      searchOverlay.classList.remove('open');
      // Only unlock body overflow if product details modal is not open
      const detailsModal = document.getElementById('productDetailsModal');
      if (detailsModal && !detailsModal.classList.contains('open')) {
        document.body.style.overflow = '';
      }
    }
  }

  if (searchBtn) searchBtn.addEventListener('click', openSearch);
  if (searchCloseBtn) searchCloseBtn.addEventListener('click', closeSearch);

  // Close search overlay on pressing ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSearch();
    }
  });

  // Render matching products inside the search grid
  function renderSearchResults(query) {
    if (!searchResultsGrid) return;
    searchResultsGrid.innerHTML = '';
    
    const cleanQuery = query.toLowerCase().trim();
    
    // Filter from products array
    let matches = [];
    if (cleanQuery === '') {
      // Default: Featured suggestions (e.g. up to 3 items)
      matches = products.slice(0, 3);
      if (searchResultsTitle) {
        searchResultsTitle.textContent = translations[currentLang].search_featured_products;
      }
    } else {
      matches = products.filter(p => {
        const titleEn = (p.title_en || '').toLowerCase();
        const titleTh = (p.title_th || '').toLowerCase();
        const cat = (p.category_en || p.category || '').toLowerCase();
        return titleEn.includes(cleanQuery) || titleTh.includes(cleanQuery) || cat.includes(cleanQuery);
      });
      if (searchResultsTitle) {
        searchResultsTitle.textContent = translations[currentLang].search_results_title;
      }
    }

    if (matches.length === 0) {
      searchResultsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--color-muted); font-size: 0.9rem;">
          ${translations[currentLang].search_no_results}
        </div>
      `;
      return;
    }

    matches.forEach(product => {
      const title = currentLang === 'th' ? (product.title_th || product.title_en) : (product.title_en || product.title_th);
      const categoryLabel = currentLang === 'th' ? (product.category_th || product.category_en) : (product.category_en || product.category_th);
      const img = product.image_url || 'assets/dog_bed.png';
      const priceVal = parseFloat(product.price || 0);

      const item = document.createElement('div');
      item.className = 'search-result-item';
      item.innerHTML = `
        <img src="${img}" alt="${title}">
        <div class="search-result-info">
          <h5>${title}</h5>
          <span class="search-result-category">${categoryLabel}</span>
        </div>
        <span class="search-result-price">฿${priceVal.toFixed(2)}</span>
      `;

      item.addEventListener('click', () => {
        closeSearch();
        openProductDetailsModal(product);
      });

      searchResultsGrid.appendChild(item);
    });
  }

  // Bind live search input listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderSearchResults(e.target.value);
    });
  }

  // Set language configuration (will trigger grid render and cart updates)
  setLanguage(currentLang);

  // Load and apply CMS custom settings asynchronously
  applyCmsSettings();
});
