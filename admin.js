// LuxePaws Premium E-commerce Admin Dashboard Logic
// Powered by Supabase Auth, PostgreSQL Database, and CRUD APIs

// --- Supabase Credentials Configuration ---
const SUPABASE_URL = 'https://oylfiyelvquejtswpbxu.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_XaV__6RxvquvwygZrW9HYw_l6Ct7Tfd'; 

// Safe Memory Storage fallback for Supabase Auth in private browsing modes
const MemoryStorage = {
  store: {},
  getItem(key) { return this.store[key] || null; },
  setItem(key, value) { this.store[key] = value; },
  removeItem(key) { delete this.store[key]; }
};

let safeAuthStorage = null;
try {
  localStorage.setItem('__storage_test__', '1');
  localStorage.removeItem('__storage_test__');
  safeAuthStorage = localStorage;
} catch (e) {
  console.warn("localStorage is blocked. Falling back to in-memory storage for Supabase Auth.");
  safeAuthStorage = MemoryStorage;
}

let supabase = null;
try {
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storage: safeAuthStorage,
        persistSession: true,
        autoRefreshToken: true
      }
    });
    console.log("Supabase Admin client initialized successfully.");
  }
} catch (e) {
  console.error("Failed to initialize Supabase Admin client:", e);
}

document.addEventListener('DOMContentLoaded', () => {
  // --- UI Element Selectors ---
  const loginWrapper = document.getElementById('loginWrapper');
  const dashboardWrapper = document.getElementById('dashboardWrapper');
  const loginForm = document.getElementById('loginForm');
  const loginEmail = document.getElementById('loginEmail');
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
  if (supabase) {
    supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth Event triggered:", event);
      if (session) {
        // Authenticated admin state
        loginWrapper.style.display = 'none';
        dashboardWrapper.style.display = 'block';
        adminUserEmail.textContent = session.user.email;
        loadDashboardData();
      } else {
        // Unauthenticated login state
        loginWrapper.style.display = 'flex';
        dashboardWrapper.style.display = 'none';
      }
    });
  } else {
    // If Supabase fails to initialize, show dummy dashboard for demonstration
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
      
      const email = loginEmail.value.trim();
      const password = loginPassword.value.trim();
      const submitBtn = document.getElementById('loginSubmitBtn');

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Authenticating...';
      }

      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password
        });

        if (error) {
          loginError.textContent = error.message;
          loginError.style.display = 'block';
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Log In';
          }
        } else {
          console.log("Logged in successfully:", data);
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
      if (supabase) {
        await supabase.auth.signOut();
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
    if (!supabase) return;
    
    try {
      console.log("Loading dashboard data...");
      
      // Fetch Products and Orders from database
      const productsPromise = supabase.from('products').select('*').order('id', { ascending: true });
      const ordersPromise = supabase.from('orders').select('*').order('created_at', { ascending: false });

      const [productsRes, ordersRes] = await Promise.all([productsPromise, ordersPromise]);

      if (productsRes.error) throw productsRes.error;
      if (ordersRes.error) throw ordersRes.error;

      dbProducts = productsRes.data || [];
      dbOrders = ordersRes.data || [];

      // Update metrics panel
      calculateAndRenderMetrics();

      // Render tab tables
      renderOrdersTable();
      renderProductsTable();
      
      console.log("Dashboard database loading completed successfully.");
    } catch (err) {
      console.error("Dashboard data load error:", err);
      alert("Error reading backend data. Please ensure table RLS security policies are fully run in the SQL editor.");
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
    revenueMetric.textContent = `€${totalRevenue.toFixed(2)}`;

    // 2. Total Orders count
    ordersMetric.textContent = dbOrders.length.toString();

    // 3. Active Products in Catalog count
    productsMetric.textContent = dbProducts.length.toString();
  }

  // Offline mock dashboard loader
  function loadDashboardMockData() {
    dbProducts = [
      { id: 1, title_en: "Nido Felt Dog Bed", title_th: "ที่นอน Nido", price: 189, category: "dog", swatches: ["Grey", "Cream"] },
      { id: 2, title_en: "Desco Oak Bowl Stand", title_th: "ชามข้าว Desco", price: 99, category: "accessories", swatches: ["Oak"] }
    ];
    dbOrders = [
      { id: 1, created_at: new Date().toISOString(), customer_name: "Mock Customer", customer_email: "test@example.com", shipping_address: "Bangkok", items: [{title: "Nido Felt Dog Bed", qty: 1, price: 189, color: "Grey"}], total_price: 189, status: "pending" }
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
          <td colspan="7" class="text-center text-muted">No customer orders registered yet.</td>
        </tr>
      `;
      return;
    }

    dbOrders.forEach(order => {
      const orderIdString = 'LP-' + order.id.toString().padStart(6, '0');
      const date = new Date(order.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
      
      // Build order items list
      let itemsHtml = '<ul class="order-items-list">';
      if (Array.isArray(order.items)) {
        order.items.forEach(item => {
          itemsHtml += `<li><strong>${item.qty}x</strong> ${item.title} (${item.color}) - €${(item.price * item.qty).toFixed(2)}</li>`;
        });
      }
      itemsHtml += '</ul>';

      // Status badge class mapping
      let badgeClass = 'badge-pending';
      if (order.status === 'shipped') badgeClass = 'badge-shipped';
      if (order.status === 'completed') badgeClass = 'badge-completed';

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
        <td><strong>€${parseFloat(order.total_price).toFixed(2)}</strong></td>
        <td><span class="badge ${badgeClass}">${order.status}</span></td>
        <td>
          <select class="status-select" data-order-id="${order.id}">
            <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
            <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
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
        
        if (supabase) {
          try {
            console.log(`Updating order ID ${orderId} to status: ${newStatus}...`);
            const { error } = await supabase
              .from('orders')
              .update({ status: newStatus })
              .eq('id', orderId);

            if (error) throw error;
            
            // Reload dashboard metrics and rows
            loadDashboardData();
          } catch (err) {
            console.error("Order status update failed:", err);
            alert("Failed to update status. Please confirm admin database write permission.");
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
          <td colspan="6" class="text-center text-muted">No products in catalog database.</td>
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
        <td><strong>€${priceVal.toFixed(2)}</strong></td>
        <td>${swatchesHtml}</td>
        <td>
          <div class="actions-cell">
            <button class="btn btn-secondary btn-small btn-edit" data-product-id="${product.id}">
              <i class="fa-solid fa-pen-to-square"></i> Edit
            </button>
            <button class="btn btn-danger btn-small btn-delete" data-product-id="${product.id}">
              <i class="fa-solid fa-trash-can"></i> Delete
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
        if (confirm("Are you sure you want to delete this product from the store catalog database?")) {
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
      modalTitle.textContent = "Add New Product";
      productModal.classList.add('open');
      productModalBackdrop.classList.add('open');
    });
  }

  // Edit Product Modal populate
  function openProductModalForEdit(id) {
    const product = dbProducts.find(p => String(p.id) === String(id));
    if (!product) return;

    modalTitle.textContent = "Edit Product Information";
    productIdField.value = product.id;
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
        saveBtn.textContent = 'Saving product...';
      }

      if (supabase) {
        try {
          if (prodId) {
            // Edit mode: Update DB row
            console.log(`Updating product ID ${prodId} on Supabase...`);
            const { error } = await supabase
              .from('products')
              .update(payload)
              .eq('id', prodId);
              
            if (error) throw error;
          } else {
            // Add mode: Insert new DB row
            console.log("Inserting new product to Supabase...");
            const { error } = await supabase
              .from('products')
              .insert([payload]);

            if (error) throw error;
          }
          
          closeProductModal();
          loadDashboardData();
        } catch (err) {
          console.error("Database save failed:", err);
          alert("Save operation failed. Please check table structure policy settings.");
        }
      } else {
        // Offline demo save
        if (prodId) {
          const idx = dbProducts.findIndex(p => String(p.id) === String(prodId));
          if (idx !== -1) dbProducts[idx] = { id: prodId, ...payload };
        } else {
          const newId = dbProducts.length > 0 ? Math.max(...dbProducts.map(p => p.id)) + 1 : 1;
          dbProducts.push({ id: newId, ...payload });
        }
        closeProductModal();
        calculateAndRenderMetrics();
        renderProductsTable();
      }

      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Product';
      }
    });
  }

  // Delete product logic
  async function deleteProduct(id) {
    if (supabase) {
      try {
        console.log(`Deleting product ID ${id} from Supabase...`);
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        loadDashboardData();
      } catch (err) {
        console.error("Database deletion failed:", err);
        alert("Deletion failed. Verify authenticated admin write permissions.");
      }
    } else {
      dbProducts = dbProducts.filter(p => String(p.id) !== String(id));
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

});
