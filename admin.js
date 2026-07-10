// LuxePaws Premium E-commerce Admin Dashboard Logic
// Powered by Supabase Auth, PostgreSQL Database, and CRUD APIs

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

document.addEventListener('DOMContentLoaded', () => {
  // --- UI Element Selectors ---
  const loginWrapper = document.getElementById('loginWrapper');
  const dashboardWrapper = document.getElementById('dashboardWrapper');
  const loginForm = document.getElementById('loginForm');
  const loginIdentifier = document.getElementById('loginIdentifier');
  const loginPassword = document.getElementById('loginPassword');
  const loginError = document.getElementById('loginError');
  const adminUserEmail = document.getElementById('adminUserEmail');
  const logoutBtn = document.getElementById('logoutBtn');

  const revenueMetric = document.getElementById('revenueMetric');
  const ordersMetric = document.getElementById('ordersMetric');
  const productsMetric = document.getElementById('productsMetric');

  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  const ordersTableBody = document.getElementById('ordersTableBody');
  const productsTableBody = document.getElementById('productsTableBody');
  const refreshOrdersBtn = document.getElementById('refreshOrdersBtn');

  // Product Modal elements
  const openAddProductBtn = document.getElementById('openAddProductBtn');
  const productModal = document.getElementById('productModal');
  const productModalBackdrop = document.getElementById('productModalBackdrop');
  const closeProductModalBtn = document.getElementById('closeProductModalBtn');
  const cancelProductBtn = document.getElementById('cancelProductBtn');
  const productForm = document.getElementById('productForm');
  const modalTitle = document.getElementById('modalTitle');

  // Form Fields
  const productIdField = document.getElementById('productId');
  const prodTitleEn = document.getElementById('prodTitleEn');
  const prodTitleTh = document.getElementById('prodTitleTh');
  const prodPrice = document.getElementById('prodPrice');
  const prodCategory = document.getElementById('prodCategory');
  const prodSwatches = document.getElementById('prodSwatches');
  const prodCatEn = document.getElementById('prodCatEn');
  const prodCatTh = document.getElementById('prodCatTh');
  const prodBadgeEn = document.getElementById('prodBadgeEn');
  const prodBadgeTh = document.getElementById('prodBadgeTh');
  const prodImageUrl = document.getElementById('prodImageUrl');

  let dbProducts = [];
  let dbOrders = [];

  // ==========================================
  // 1. SUPABASE AUTHENTICATION CONTROLLER
  // ==========================================

  // Check auth state on load
  if (auth) {
    auth.onAuthStateChanged((user) => {
      console.log("Auth state changed. User:", user);
      if (user) {
        // Authenticated admin state
        loginWrapper.style.display = 'none';
        dashboardWrapper.style.display = 'block';
        
        // Strip out mock phone domain if present
        let displayUser = user.email || 'Admin';
        if (displayUser.endsWith('@phone.luxepaws.com')) {
          displayUser = displayUser.replace('@phone.luxepaws.com', '');
        }
        adminUserEmail.textContent = displayUser;
        loadDashboardData();
      } else {
        // Unauthenticated login state
        loginWrapper.style.display = 'flex';
        dashboardWrapper.style.display = 'none';
      }
    });
  } else {
    // If Firebase fails to initialize, show dummy dashboard for demonstration
    loginWrapper.style.display = 'none';
    dashboardWrapper.style.display = 'block';
    adminUserEmail.textContent = "offline-demo@luxepaws.com";
    loadDashboardMockData();
  }

  // Handle Login submission
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      loginError.style.display = 'none';
      
      const identifier = loginIdentifier.value.trim();
      const password = loginPassword.value.trim();
      const submitBtn = document.getElementById('loginSubmitBtn');

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'กำลังยืนยันตัวตน...';
      }

      if (auth) {
        // If it's a phone number (e.g. starts with + or contains only digits), convert to mock email
        const isEmail = identifier.includes('@');
        const loginEmail = isEmail ? identifier : `${identifier}@phone.luxepaws.com`;

        try {
          await auth.signInWithEmailAndPassword(loginEmail, password);
        } catch (error) {
          loginError.textContent = error.message;
          loginError.style.display = 'block';
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'เข้าสู่ระบบ';
          }
        }
      } else {
        // Offline demo login fallback
        console.log("Offline login bypass.");
        loginWrapper.style.display = 'none';
        dashboardWrapper.style.display = 'block';
      }
    });
  }

  // Handle Logout click
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      if (auth) {
        await auth.signOut();
      } else {
        loginWrapper.style.display = 'flex';
        dashboardWrapper.style.display = 'none';
      }
    });
  }

  // ==========================================
  // 2. DASHBOARD DATA LOADER & METRICS
  // ==========================================

  async function loadDashboardData() {
    if (!db) return;
    
    try {
      console.log("Loading dashboard data...");
      
      // Fetch Products and Orders from Firebase Firestore
      const productsPromise = db.collection('products').orderBy('id', 'asc').get().then(snapshot => {
        const list = [];
        snapshot.forEach(doc => list.push({ docId: doc.id, id: doc.data().id || doc.id, ...doc.data() }));
        return list;
      });

      const ordersPromise = db.collection('orders').get().then(snapshot => {
        const list = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          // Convert server timestamp to Date/ISO string if present
          let createdAtStr = new Date().toISOString();
          if (data.created_at) {
            createdAtStr = data.created_at.toDate ? data.created_at.toDate().toISOString() : new Date(data.created_at).toISOString();
          }
          list.push({ docId: doc.id, id: doc.id, ...data, created_at: createdAtStr });
        });
        // Sort by created_at desc manually
        list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return list;
      });

      const [productsData, ordersData] = await Promise.all([productsPromise, ordersPromise]);

      dbProducts = productsData || [];
      dbOrders = ordersData || [];

      // Update metrics panel
      calculateAndRenderMetrics();

      // Render tab tables
      renderOrdersTable();
      renderProductsTable();
      loadCmsData();
      
      console.log("Dashboard database loading completed successfully.");
    } catch (err) {
      console.error("Dashboard data load error:", err);
      alert("Error reading Firebase data. Please check Firestore security rules settings.");
    }
  }

  function calculateAndRenderMetrics() {
    // 1. Total Revenue (sum of completed/shipped/pending orders)
    const totalRevenue = dbOrders.reduce((sum, order) => {
      // Exclude cancelled if they exist
      if (order.status !== 'cancelled') {
        return sum + parseFloat(order.total_price || 0);
      }
      return sum;
    }, 0);
    revenueMetric.textContent = `฿${totalRevenue.toFixed(2)}`;

    // 2. Total Orders count
    ordersMetric.textContent = dbOrders.length.toString();

    // 3. Active Products in Catalog count
    productsMetric.textContent = dbProducts.length.toString();
  }

  // Offline mock dashboard loader
  function loadDashboardMockData() {
    dbProducts = [
      { id: 1, title_en: "Nido Felt Dog Bed", title_th: "ที่นอน Nido", price: 6900, category: "dog", swatches: ["Grey", "Cream"] },
      { id: 2, title_en: "Desco Oak Bowl Stand", title_th: "ชามข้าว Desco", price: 3500, category: "accessories", swatches: ["Oak"] }
    ];
    dbOrders = [
      { id: 1, created_at: new Date().toISOString(), customer_name: "Mock Customer", customer_email: "test@example.com", shipping_address: "Bangkok", items: [{title: "Nido Felt Dog Bed", qty: 1, price: 6900, color: "Grey"}], total_price: 6900, status: "pending" }
    ];
    calculateAndRenderMetrics();
    renderOrdersTable();
    renderProductsTable();
  }

  // ==========================================
  // 3. CUSTOMER ORDERS CONTROLLER
  // ==========================================

  function renderOrdersTable() {
    if (!ordersTableBody) return;
    ordersTableBody.innerHTML = '';

    if (dbOrders.length === 0) {
      ordersTableBody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center text-muted">ยังไม่มีรายการสั่งซื้อของลูกค้าลงทะเบียนในระบบในขณะนี้</td>
        </tr>
      `;
      return;
    }

    dbOrders.forEach(order => {
      // Handle both old numeric IDs and new alphanumeric Firestore IDs
      const orderIdString = String(order.id).length > 10 ? 'LP-' + String(order.id).slice(0, 8).toUpperCase() : 'LP-' + String(order.id).padStart(6, '0');
      const date = new Date(order.created_at).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' });
      
      // Build order items list
      let itemsHtml = '<ul class="order-items-list">';
      if (Array.isArray(order.items)) {
        order.items.forEach(item => {
          itemsHtml += `<li><strong>${item.qty}x</strong> ${item.title} (${item.color}) - ฿${(item.price * item.qty).toFixed(2)}</li>`;
        });
      }
      itemsHtml += '</ul>';

      // Status badge class mapping
      let badgeClass = 'badge-pending';
      let statusTh = 'รอดำเนินการ';
      if (order.status === 'shipped') {
        badgeClass = 'badge-shipped';
        statusTh = 'จัดส่งแล้ว';
      }
      if (order.status === 'completed') {
        badgeClass = 'badge-completed';
        statusTh = 'เสร็จสมบูรณ์';
      }

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${orderIdString}</strong></td>
        <td>${date}</td>
        <td>
          <div style="font-weight: 500;">${order.customer_name}</div>
          <div style="font-size: 0.8rem; color: var(--color-muted);">${order.customer_email}</div>
          <div style="font-size: 0.75rem; color: var(--color-muted); max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${order.shipping_address}">${order.shipping_address}</div>
        </td>
        <td>${itemsHtml}</td>
        <td><strong>฿${parseFloat(order.total_price).toFixed(2)}</strong></td>
        <td><span class="badge ${badgeClass}">${statusTh}</span></td>
        <td>
          <select class="status-select" data-order-id="${order.docId}">
            <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>รอดำเนินการ (Pending)</option>
            <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>จัดส่งแล้ว (Shipped)</option>
            <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>เสร็จสมบูรณ์ (Completed)</option>
          </select>
        </td>
      `;
      ordersTableBody.appendChild(tr);
    });

    // Bind order status dropdown change events
    const statusSelects = ordersTableBody.querySelectorAll('.status-select');
    statusSelects.forEach(select => {
      select.addEventListener('change', async (e) => {
        const orderId = e.target.getAttribute('data-order-id');
        const newStatus = e.target.value;
        
        if (db) {
          try {
            console.log(`Updating order ID ${orderId} to status: ${newStatus}...`);
            await db.collection('orders').doc(orderId).update({ status: newStatus });
            
            // Reload dashboard metrics and rows
            loadDashboardData();
          } catch (err) {
            console.error("Order status update failed:", err);
            alert("Failed to update status. Please confirm Firestore database permissions.");
          }
        } else {
          alert("Offline demo mode. Status update simulated.");
          const idx = dbOrders.findIndex(o => String(o.id) === String(orderId));
          if (idx !== -1) dbOrders[idx].status = newStatus;
          calculateAndRenderMetrics();
          renderOrdersTable();
        }
      });
    });
  }

  if (refreshOrdersBtn) {
    refreshOrdersBtn.addEventListener('click', loadDashboardData);
  }

  // ==========================================
  // 4. PRODUCT CATALOG CONTROLLER (CRUD)
  // ==========================================

  function renderProductsTable() {
    if (!productsTableBody) return;
    productsTableBody.innerHTML = '';

    if (dbProducts.length === 0) {
      productsTableBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center text-muted">ไม่มีรายการสินค้าลงทะเบียนในคลังสินค้าในขณะนี้</td>
        </tr>
      `;
      return;
    }

    dbProducts.forEach(product => {
      const priceVal = parseFloat(product.price || 0);
      const imgUrl = product.image_url || 'assets/dog_bed.png';
      
      // Format swatches list
      let swatchesArray = [];
      if (Array.isArray(product.swatches)) {
        swatchesArray = product.swatches;
      } else if (product.swatches) {
        try {
          swatchesArray = typeof product.swatches === 'string' ? JSON.parse(product.swatches) : product.swatches;
          if (!Array.isArray(swatchesArray)) swatchesArray = [];
        } catch (e) {
          swatchesArray = [];
        }
      }
      
      const swatchesHtml = swatchesArray.map(s => `<span class="badge-pill">${s}</span>`).join('');

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><img src="${imgUrl}" alt="${product.title_en}" class="table-img"></td>
        <td>
          <div style="font-weight: 500;">${product.title_en}</div>
          <div style="font-size: 0.8rem; color: var(--color-muted);">${product.title_th}</div>
        </td>
        <td>
          <div>Slug: <code>${product.category}</code></div>
          <div style="font-size: 0.75rem; color: var(--color-muted);">${product.category_en} / ${product.category_th}</div>
        </td>
        <td><strong>฿${priceVal.toFixed(2)}</strong></td>
        <td>${swatchesHtml}</td>
        <td>
          <div class="actions-cell">
            <button class="btn btn-secondary btn-small btn-edit" data-product-id="${product.docId}">
              <i class="fa-solid fa-pen-to-square"></i> แก้ไข
            </button>
            <button class="btn btn-danger btn-small btn-delete" data-product-id="${product.docId}">
              <i class="fa-solid fa-trash-can"></i> ลบ
            </button>
          </div>
        </td>
      `;
      productsTableBody.appendChild(tr);
    });

    // Bind Edit and Delete button events
    const editBtns = productsTableBody.querySelectorAll('.btn-edit');
    editBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const prodId = btn.getAttribute('data-product-id');
        openProductModalForEdit(prodId);
      });
    });

    const deleteBtns = productsTableBody.querySelectorAll('.btn-delete');
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', async () => {
        const prodId = btn.getAttribute('data-product-id');
        if (confirm("คุณแน่ใจหรือไม่ที่จะลบสินค้านี้ออกจากคลังระบบฐานข้อมูลร้านค้า?")) {
          deleteProduct(prodId);
        }
      });
    });
  }

  // Open Modal to create new product
  if (openAddProductBtn) {
    openAddProductBtn.addEventListener('click', () => {
      productForm.reset();
      productIdField.value = '';
      modalTitle.textContent = "เพิ่มสินค้าใหม่";
      productModal.classList.add('open');
      productModalBackdrop.classList.add('open');
    });
  }

  // Edit Product Modal populate
  function openProductModalForEdit(id) {
    const product = dbProducts.find(p => String(p.docId) === String(id));
    if (!product) return;

    modalTitle.textContent = "แก้ไขรายละเอียดสินค้า";
    productIdField.value = product.docId;
    prodTitleEn.value = product.title_en;
    prodTitleTh.value = product.title_th;
    prodPrice.value = product.price;
    prodCategory.value = product.category;
    prodCatEn.value = product.category_en;
    prodCatTh.value = product.category_th;
    prodBadgeEn.value = product.badge_en || '';
    prodBadgeTh.value = product.badge_th || '';
    prodImageUrl.value = product.image_url;

    // Parse swatches to comma-separated text
    let swatchesArray = [];
    if (Array.isArray(product.swatches)) {
      swatchesArray = product.swatches;
    } else if (product.swatches) {
      try {
        swatchesArray = typeof product.swatches === 'string' ? JSON.parse(product.swatches) : product.swatches;
        if (!Array.isArray(swatchesArray)) swatchesArray = [];
      } catch (e) {
        swatchesArray = [];
      }
    }
    prodSwatches.value = swatchesArray.join(', ');

    productModal.classList.add('open');
    productModalBackdrop.classList.add('open');
  }

  function closeProductModal() {
    productModal.classList.remove('open');
    productModalBackdrop.classList.remove('open');
    productForm.reset();
  }

  if (closeProductModalBtn) closeProductModalBtn.addEventListener('click', closeProductModal);
  if (cancelProductBtn) cancelProductBtn.addEventListener('click', closeProductModal);
  if (productModalBackdrop) productModalBackdrop.addEventListener('click', closeProductModal);

  // Form Submit handler (Create or Update)
  if (productForm) {
    productForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const prodId = productIdField.value;
      const titleEn = prodTitleEn.value.trim();
      const titleTh = prodTitleTh.value.trim();
      const price = parseFloat(prodPrice.value) || 0.00;
      const category = prodCategory.value;
      const categoryEn = prodCatEn.value.trim();
      const categoryTh = prodCatTh.value.trim();
      const badgeEn = prodBadgeEn.value.trim() || null;
      const badgeTh = prodBadgeTh.value.trim() || null;
      const imageUrl = prodImageUrl.value.trim();

      // Convert swatches comma text back to clean JSON array
      const swatchesText = prodSwatches.value.trim();
      const swatchesList = swatchesText ? swatchesText.split(',').map(s => s.trim()).filter(s => s.length > 0) : [];

      const payload = {
        title_en: titleEn,
        title_th: titleTh,
        price: price,
        category: category,
        category_en: categoryEn,
        category_th: categoryTh,
        badge_en: badgeEn,
        badge_th: badgeTh,
        image_url: imageUrl,
        swatches: swatchesList
      };

      const saveBtn = document.getElementById('saveProductBtn');
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = 'กำลังบันทึกข้อมูลสินค้า...';
      }

      if (db) {
        try {
          if (prodId) {
            // Edit mode: Update Firestore document
            console.log(`Updating product doc ID ${prodId} on Firebase...`);
            await db.collection('products').doc(prodId).update(payload);
          } else {
            // Add mode: Add new Firestore document
            console.log("Inserting new product to Firebase...");
            // Get next integer ID for sorting consistency
            const nextId = dbProducts.length > 0 ? Math.max(...dbProducts.map(p => parseInt(p.id) || 0)) + 1 : 1;
            await db.collection('products').add({ id: nextId, ...payload });
          }
          
          closeProductModal();
          loadDashboardData();
        } catch (err) {
          console.error("Database save failed:", err);
          alert("บันทึกข้อมูลล้มเหลว กรุณาตรวจสอบสิทธิ์การเขียนข้อมูลลงฐานข้อมูล Firestore");
        }
      } else {
        // Offline demo save
        if (prodId) {
          const idx = dbProducts.findIndex(p => String(p.docId) === String(prodId));
          if (idx !== -1) dbProducts[idx] = { docId: prodId, id: dbProducts[idx].id, ...payload };
        } else {
          const newId = dbProducts.length > 0 ? Math.max(...dbProducts.map(p => p.id)) + 1 : 1;
          dbProducts.push({ docId: 'mock_' + newId, id: newId, ...payload });
        }
        closeProductModal();
        calculateAndRenderMetrics();
        renderProductsTable();
      }

      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = 'บันทึกสินค้า';
      }
    });
  }

  // Delete product logic
  async function deleteProduct(id) {
    if (db) {
      try {
        console.log(`Deleting product doc ID ${id} from Firebase...`);
        await db.collection('products').doc(id).delete();
        
        loadDashboardData();
      } catch (err) {
        console.error("Database deletion failed:", err);
        alert("ลบข้อมูลสินค้าล้มเหลว กรุณาตรวจสอบสิทธิ์การเขียนข้อมูลลงฐานข้อมูล Firestore");
      }
    } else {
      dbProducts = dbProducts.filter(p => String(p.docId) !== String(id));
      calculateAndRenderMetrics();
      renderProductsTable();
    }
  }

  // ==========================================
  // 5. TABS TOGGLE SYSTEM
  // ==========================================

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const tabTarget = btn.getAttribute('data-tab');
      tabPanels.forEach(panel => {
        if (panel.id === `${tabTarget}Panel`) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  // ==========================================
  // 6. STOREFRONT CMS & CONTENT MANAGER
  // ==========================================

  const cmsSectionSelect = document.getElementById('cmsSectionSelect');
  const cmsSectionGroups = document.querySelectorAll('.cms-section-group');

  if (cmsSectionSelect) {
    cmsSectionSelect.addEventListener('change', (e) => {
      const selected = e.target.value;
      cmsSectionGroups.forEach(group => {
        if (group.id === `cmsGroup_${selected}`) {
          group.style.display = 'block';
        } else {
          group.style.display = 'none';
        }
      });
    });
  }

  function renderCmsInputs() {
    // 1. Render Hero carousel slide inputs (5 items)
    const heroContainer = document.getElementById('heroSlidesInputsContainer');
    if (heroContainer) {
      let html = '';
      for (let i = 1; i <= 5; i++) {
        html += `
          <div class="cms-card-item">
            <h5>รูปภาพสไลด์แบนเนอร์ที่ ${i}</h5>
            <div class="cms-image-preview-container">
              <img src="assets/hero_banner.png" id="prev_hero_img_${i}" class="cms-image-preview">
              <div class="cms-image-controls">
                <input type="text" id="hero_img_${i}" placeholder="ลิงก์รูปภาพ (เช่น assets/hero_banner.png)">
                <input type="file" id="file_hero_img_${i}" accept="image/*" data-target="hero_img_${i}" data-prev="prev_hero_img_${i}">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-6">
                <label>หัวข้อบนภาพสไลด์ (อังกฤษ)</label>
                <input type="text" id="hero_title_en_${i}" placeholder="เช่น Sustainable Luxury">
              </div>
              <div class="form-group col-6">
                <label>หัวข้อบนภาพสไลด์ (ไทย)</label>
                <input type="text" id="hero_title_th_${i}" placeholder="เช่น ความหรูหราที่ยั่งยืน">
              </div>
            </div>
          </div>
        `;
      }
      heroContainer.innerHTML = html;
    }

    // 2. Render Gallery items (4 items)
    const galleryContainer = document.getElementById('galleryInputsContainer');
    if (galleryContainer) {
      let html = '';
      for (let i = 1; i <= 4; i++) {
        html += `
          <div class="cms-card-item">
            <h5>ภาพแกลเลอรีรีวิวติดตั้งที่ ${i}</h5>
            <div class="cms-image-preview-container">
              <img src="assets/hero_banner.png" id="prev_gallery_img_${i}" class="cms-image-preview">
              <div class="cms-image-controls">
                <input type="text" id="gallery_img_${i}" placeholder="ลิงก์รูปภาพ (URL)">
                <input type="file" id="file_gallery_img_${i}" accept="image/*" data-target="gallery_img_${i}" data-prev="prev_gallery_img_${i}">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-6">
                <label>คำอธิบายภาพ / สถานที่ติดตั้ง (อังกฤษ)</label>
                <input type="text" id="gallery_cap_en_${i}" placeholder="เช่น Urban Loft, Munich">
              </div>
              <div class="form-group col-6">
                <label>คำอธิบายภาพ / สถานที่ติดตั้ง (ไทย)</label>
                <input type="text" id="gallery_cap_th_${i}" placeholder="เช่น เออร์บันลอฟท์, มิวนิก">
              </div>
            </div>
          </div>
        `;
      }
      galleryContainer.innerHTML = html;
    }

    // 3. Render Blog items (4 posts - matching updated design)
    const blogContainer = document.getElementById('blogInputsContainer');
    if (blogContainer) {
      let html = '';
      for (let i = 1; i <= 4; i++) {
        html += `
          <div class="cms-card-item">
            <h5>บล็อกการ์ดบทความที่ ${i}</h5>
            <div class="cms-image-preview-container">
              <img src="assets/hero_banner.png" id="prev_blog_img_${i}" class="cms-image-preview">
              <div class="cms-image-controls">
                <input type="text" id="blog_img_${i}" placeholder="ลิงก์รูปภาพ (URL)">
                <input type="file" id="file_blog_img_${i}" accept="image/*" data-target="blog_img_${i}" data-prev="prev_blog_img_${i}">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-6">
                <label>ป้ายแท็กหัวข้อ (อังกฤษ)</label>
                <input type="text" id="blog_tag_en_${i}" placeholder="เช่น Health">
              </div>
              <div class="form-group col-6">
                <label>ป้ายแท็กหัวข้อ (ไทย)</label>
                <input type="text" id="blog_tag_th_${i}" placeholder="เช่น สุขภาพสัตว์เลี้ยง">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-6">
                <label>ชื่อบทความหลัก (อังกฤษ)</label>
                <input type="text" id="blog_title_en_${i}" placeholder="ชื่อหัวเรื่องภาษาอังกฤษ">
              </div>
              <div class="form-group col-6">
                <label>ชื่อบทความหลัก (ไทย)</label>
                <input type="text" id="blog_title_th_${i}" placeholder="ชื่อหัวเรื่องภาษาไทย">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-6">
                <label>คำอธิบายย่อยเกริ่นนำ (อังกฤษ)</label>
                <textarea id="blog_excerpt_en_${i}" rows="2" placeholder="สรุปย่อภาษาอังกฤษของบทความ..."></textarea>
              </div>
              <div class="form-group col-6">
                <label>คำอธิบายย่อยเกริ่นนำ (ไทย)</label>
                <textarea id="blog_excerpt_th_${i}" rows="2" placeholder="สรุปย่อภาษาไทยของบทความ..."></textarea>
              </div>
            </div>
          </div>
        `;
      }
      blogContainer.innerHTML = html;
    }

    // 4. Render Customer Reviews (3 items)
    const reviewContainer = document.getElementById('reviewInputsContainer');
    if (reviewContainer) {
      let html = '';
      for (let i = 1; i <= 3; i++) {
        html += `
          <div class="cms-card-item">
            <h5>บล็อกความคิดเห็นลูกค้าที่ ${i}</h5>
            <div class="form-row">
              <div class="form-group col-6">
                <label>ข้อความความคิดเห็นรีวิว (อังกฤษ)</label>
                <textarea id="review_text_en_${i}" rows="3" placeholder="ข้อความรีวิวภาษาอังกฤษ..."></textarea>
              </div>
              <div class="form-group col-6">
                <label>ข้อความความคิดเห็นรีวิว (ไทย)</label>
                <textarea id="review_text_th_${i}" rows="3" placeholder="ข้อความรีวิวภาษาไทย..."></textarea>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-4">
                <label>ชื่อลูกค้าผู้รีวิว</label>
                <input type="text" id="review_name_${i}" placeholder="เช่น Sarah K.">
              </div>
              <div class="form-group col-4">
                <label>รายละเอียด / ข้อมูลผู้ซื้อ (อังกฤษ)</label>
                <input type="text" id="review_title_en_${i}" placeholder="เช่น Owner of French Bulldog (Munich)">
              </div>
              <div class="form-group col-4">
                <label>รายละเอียด / ข้อมูลผู้ซื้อ (ไทย)</label>
                <input type="text" id="review_title_th_${i}" placeholder="เช่น เจ้าของสุนัขเฟรนช์บลูด็อก (มิวนิก)">
              </div>
            </div>
          </div>
        `;
      }
      reviewContainer.innerHTML = html;
    }

    // 5. Render FAQ items (4 items)
    const faqContainer = document.getElementById('faqInputsContainer');
    if (faqContainer) {
      let html = '';
      for (let i = 1; i <= 4; i++) {
        html += `
          <div class="cms-card-item">
            <h5>คำถามพบบ่อยรายการที่ ${i}</h5>
            <div class="form-row">
              <div class="form-group col-6">
                <label>คำถามหลัก (อังกฤษ)</label>
                <input type="text" id="faq_q_en_${i}" placeholder="FAQ Question (EN)">
              </div>
              <div class="form-group col-6">
                <label>คำถามหลัก (ไทย)</label>
                <input type="text" id="faq_q_th_${i}" placeholder="คำถามพบบ่อย (TH)">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-6">
                <label>คำตอบ / คำอธิบาย (อังกฤษ)</label>
                <textarea id="faq_a_en_${i}" rows="3" placeholder="FAQ Answer (EN)"></textarea>
              </div>
              <div class="form-group col-6">
                <label>คำตอบ / คำอธิบาย (ไทย)</label>
                <textarea id="faq_a_th_${i}" rows="3" placeholder="คำอธิบายหรือคำตอบ (TH)"></textarea>
              </div>
            </div>
          </div>
        `;
      }
      faqContainer.innerHTML = html;
    }
  }

  function setupCmsUploads() {
    const fileInputs = document.querySelectorAll('#cmsPanel input[type="file"]');
    fileInputs.forEach(fileInput => {
      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const textInputId = fileInput.getAttribute('data-target');
        const prevImgId = fileInput.getAttribute('data-prev');
        const textInput = document.getElementById(textInputId);
        const prevImg = document.getElementById(prevImgId);
        
        if (textInput) textInput.value = "Uploading file to Firebase Storage...";

        if (firebase.storage) {
          try {
            console.log("Uploading file to Firebase Storage:", file.name);
            const storageRef = firebase.storage().ref();
            const fileRef = storageRef.child(`storefront/${Date.now()}_${file.name}`);
            const snapshot = await fileRef.put(file);
            const downloadUrl = await snapshot.ref.getDownloadURL();
            
            console.log("File uploaded successfully. URL:", downloadUrl);
            if (textInput) textInput.value = downloadUrl;
            if (prevImg) prevImg.src = downloadUrl;
          } catch (err) {
            console.error("Firebase Storage upload failed:", err);
            alert("Firebase Storage upload failed. Please verify rules permit authenticated writes.");
            if (textInput) textInput.value = "";
          }
        } else {
          // Fallback offline path simulation
          const fakeUrl = `assets/${file.name}`;
          if (textInput) textInput.value = fakeUrl;
          if (prevImg) prevImg.src = fakeUrl;
        }
      });
    });

    // Sync input text changes to image uploader previews immediately
    const textInputs = document.querySelectorAll('#cmsPanel input[type="text"]');
    textInputs.forEach(input => {
      input.addEventListener('change', () => {
        const idNum = input.id.split('_').pop();
        let prevImg = null;
        if (input.id.startsWith('hero_img_')) prevImg = document.getElementById(`prev_hero_img_${idNum}`);
        else if (input.id.startsWith('gallery_img_')) prevImg = document.getElementById(`prev_gallery_img_${idNum}`);
        else if (input.id.startsWith('blog_img_')) prevImg = document.getElementById(`prev_blog_img_${idNum}`);
        else if (input.id === 'story_img') prevImg = document.getElementById('prev_story_img');
        
        if (prevImg && input.value) {
          prevImg.src = input.value;
        }
      });
    });
  }

  window.loadCmsData = async function() {
    if (!db) return;
    
    try {
      console.log("Fetching storefront CMS configurations from Firebase Firestore...");
      const doc = await db.collection('storefront_settings').doc('main').get();
      
      if (doc.exists) {
        const data = doc.data();
        
        // 1. Populate Hero Carousel
        if (Array.isArray(data.hero_slides)) {
          data.hero_slides.forEach((slide, idx) => {
            const i = idx + 1;
            if (document.getElementById(`hero_img_${i}`)) {
              document.getElementById(`hero_img_${i}`).value = slide.img || '';
              document.getElementById(`prev_hero_img_${i}`).src = slide.img || 'assets/hero_banner.png';
              document.getElementById(`hero_title_en_${i}`).value = slide.title_en || '';
              document.getElementById(`hero_title_th_${i}`).value = slide.title_th || '';
            }
          });
        }
        
        // 2. Populate Story Philosophy
        if (data.story) {
          document.getElementById('story_img').value = data.story.img || '';
          document.getElementById('prev_story_img').src = data.story.img || 'assets/hero_banner.png';
          document.getElementById('story_title_en').value = data.story.title_en || '';
          document.getElementById('story_title_th').value = data.story.title_th || '';
          document.getElementById('story_p1_en').value = data.story.p1_en || '';
          document.getElementById('story_p1_th').value = data.story.p1_th || '';
          document.getElementById('story_p2_en').value = data.story.p2_en || '';
          document.getElementById('story_p2_th').value = data.story.p2_th || '';
          document.getElementById('story_btn_en').value = data.story.btn_en || '';
          document.getElementById('story_btn_th').value = data.story.btn_th || '';
        }
        
        // 3. Populate Gallery
        if (Array.isArray(data.gallery)) {
          data.gallery.forEach((item, idx) => {
            const i = idx + 1;
            if (document.getElementById(`gallery_img_${i}`)) {
              document.getElementById(`gallery_img_${i}`).value = item.img || '';
              document.getElementById(`prev_gallery_img_${i}`).src = item.img || 'assets/hero_banner.png';
              document.getElementById(`gallery_cap_en_${i}`).value = item.cap_en || '';
              document.getElementById(`gallery_cap_th_${i}`).value = item.cap_th || '';
            }
          });
        }
        
        // 4. Populate Blog Cards
        if (Array.isArray(data.blog)) {
          data.blog.forEach((post, idx) => {
            const i = idx + 1;
            if (document.getElementById(`blog_img_${i}`)) {
              document.getElementById(`blog_img_${i}`).value = post.img || '';
              document.getElementById(`prev_blog_img_${i}`).src = post.img || 'assets/hero_banner.png';
              document.getElementById(`blog_tag_en_${i}`).value = post.tag_en || '';
              document.getElementById(`blog_tag_th_${i}`).value = post.tag_th || '';
              document.getElementById(`blog_title_en_${i}`).value = post.title_en || '';
              document.getElementById(`blog_title_th_${i}`).value = post.title_th || '';
              document.getElementById(`blog_excerpt_en_${i}`).value = post.excerpt_en || '';
              document.getElementById(`blog_excerpt_th_${i}`).value = post.excerpt_th || '';
            }
          });
        }
        
        // 5. Populate Testimonials
        if (Array.isArray(data.reviews)) {
          data.reviews.forEach((review, idx) => {
            const i = idx + 1;
            if (document.getElementById(`review_name_${i}`)) {
              document.getElementById(`review_text_en_${i}`).value = review.text_en || '';
              document.getElementById(`review_text_th_${i}`).value = review.text_th || '';
              document.getElementById(`review_name_${i}`).value = review.name || '';
              document.getElementById(`review_title_en_${i}`).value = review.title_en || '';
              document.getElementById(`review_title_th_${i}`).value = review.title_th || '';
            }
          });
        }
        
        // 6. Populate FAQ Accordions
        if (Array.isArray(data.faq)) {
          data.faq.forEach((item, idx) => {
            const i = idx + 1;
            if (document.getElementById(`faq_q_en_${i}`)) {
              document.getElementById(`faq_q_en_${i}`).value = item.q_en || '';
              document.getElementById(`faq_q_th_${i}`).value = item.q_th || '';
              document.getElementById(`faq_a_en_${i}`).value = item.a_en || '';
              document.getElementById(`faq_a_th_${i}`).value = item.a_th || '';
            }
          });
        }
      }
    } catch (err) {
      console.error("CMS load settings failed:", err);
    }
  };

  const saveCmsBtn = document.getElementById('saveCmsBtn');
  if (saveCmsBtn) {
    saveCmsBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      
      saveCmsBtn.disabled = true;
      saveCmsBtn.textContent = 'Saving storefront content...';
      
      const payload = {
        hero_slides: [],
        story: {
          img: document.getElementById('story_img').value.trim(),
          title_en: document.getElementById('story_title_en').value.trim(),
          title_th: document.getElementById('story_title_th').value.trim(),
          p1_en: document.getElementById('story_p1_en').value.trim(),
          p1_th: document.getElementById('story_p1_th').value.trim(),
          p2_en: document.getElementById('story_p2_en').value.trim(),
          p2_th: document.getElementById('story_p2_th').value.trim(),
          btn_en: document.getElementById('story_btn_en').value.trim(),
          btn_th: document.getElementById('story_btn_th').value.trim()
        },
        gallery: [],
        blog: [],
        reviews: [],
        faq: []
      };
      
      // Collect Hero Slides
      for (let i = 1; i <= 5; i++) {
        payload.hero_slides.push({
          img: document.getElementById(`hero_img_${i}`).value.trim(),
          title_en: document.getElementById(`hero_title_en_${i}`).value.trim(),
          title_th: document.getElementById(`hero_title_th_${i}`).value.trim()
        });
      }
      
      // Collect Gallery
      for (let i = 1; i <= 4; i++) {
        payload.gallery.push({
          img: document.getElementById(`gallery_img_${i}`).value.trim(),
          cap_en: document.getElementById(`gallery_cap_en_${i}`).value.trim(),
          cap_th: document.getElementById(`gallery_cap_th_${i}`).value.trim()
        });
      }
      
      // Collect Blog
      for (let i = 1; i <= 4; i++) {
        payload.blog.push({
          img: document.getElementById(`blog_img_${i}`).value.trim(),
          tag_en: document.getElementById(`blog_tag_en_${i}`).value.trim(),
          tag_th: document.getElementById(`blog_tag_th_${i}`).value.trim(),
          title_en: document.getElementById(`blog_title_en_${i}`).value.trim(),
          title_th: document.getElementById(`blog_title_th_${i}`).value.trim(),
          excerpt_en: document.getElementById(`blog_excerpt_en_${i}`).value.trim(),
          excerpt_th: document.getElementById(`blog_excerpt_th_${i}`).value.trim()
        });
      }
      
      // Collect Reviews
      for (let i = 1; i <= 3; i++) {
        payload.reviews.push({
          stars: 5,
          text_en: document.getElementById(`review_text_en_${i}`).value.trim(),
          text_th: document.getElementById(`review_text_th_${i}`).value.trim(),
          name: document.getElementById(`review_name_${i}`).value.trim(),
          title_en: document.getElementById(`review_title_en_${i}`).value.trim(),
          title_th: document.getElementById(`review_title_th_${i}`).value.trim()
        });
      }
      
      // Collect FAQ
      for (let i = 1; i <= 4; i++) {
        payload.faq.push({
          q_en: document.getElementById(`faq_q_en_${i}`).value.trim(),
          q_th: document.getElementById(`faq_q_th_${i}`).value.trim(),
          a_en: document.getElementById(`faq_a_en_${i}`).value.trim(),
          a_th: document.getElementById(`faq_a_th_${i}`).value.trim()
        });
      }
      
      if (db) {
        try {
          console.log("Writing storefront CMS settings to Firebase...", payload);
          await db.collection('storefront_settings').doc('main').set(payload);
          alert("บันทึกข้อมูลการปรับแต่งหน้าเว็บไซต์ (CMS) สำเร็จเรียบร้อยแล้ว!");
        } catch (err) {
          console.error("Save storefront CMS failed:", err);
          alert("ไม่สามารถบันทึกการปรับแต่งได้ กรุณาตรวจสอบสิทธิ์การเขียนฐานข้อมูล Firestore");
        }
      } else {
        alert("โหมดออฟไลน์ทดสอบจำลอง: การเปลี่ยนแปลงข้อมูลถูกจำลองไว้เรียบร้อยแล้ว");
      }
      
      saveCmsBtn.disabled = false;
      saveCmsBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> บันทึกการแก้ไข';
    });
  }

  // Run dynamic input renderers and uploader change hook setup
  renderCmsInputs();
  setupCmsUploads();

});
