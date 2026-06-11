// ============================================================
// CONFIG
// ============================================================
const API_BASE = window.location.origin + '/api';

// ============================================================
// STATE
// ============================================================
let isLoggedIn   = false;
let adminToken   = localStorage.getItem('admin_token') || null;
let allProducts  = [];
let allOrders    = [];
let allCustomers = [];
let allCoupons   = [];
let allCategories = [];
let editingProductId = null;
let currentOrderId   = null;
let productFilter    = 'All';

// ============================================================
// AUTH HEADER HELPER — always use this for protected requests
// ============================================================
function authHeaders(extra = {}) {
  return {
    'Content-Type': 'application/json',
    ...(adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {}),
    ...extra
  };
}

// ============================================================
// INIT
// ============================================================
window.onload = () => {
  updateClock();
  setInterval(updateClock, 1000);
  if (adminToken) {
    showDashboard();
  }
};

function updateClock() {
  const el = document.getElementById('timeDisplay');
  if (el) el.textContent = new Date().toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' });
}

// ============================================================
// ✅ FIX: LOGIN — always hits the API to get a real JWT token
// ============================================================
async function adminLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPass').value;
  const errEl = document.getElementById('loginError');
  errEl.textContent = '';

  if (!email || !pass) {
    errEl.textContent = 'Please enter email and password';
    errEl.style.color = 'var(--red)';
    return;
  }

  const btn = document.querySelector('#loginScreen .btn-primary');
  btn.textContent = 'Logging in...';
  btn.disabled = true;

  try {
    const res = await fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });

    const data = await res.json();

    if (data.token) {
      // ✅ Store the real JWT token
      adminToken = data.token;
      localStorage.setItem('admin_token', adminToken);

      if (data.user?.name) {
        document.getElementById('adminName').textContent = data.user.name;
      }

      showDashboard();
      toast('Welcome back, Admin! 🎉', 'green');
    } else {
      errEl.textContent = data.message || 'Invalid credentials';
      errEl.style.color = 'var(--red)';
    }
  } catch (e) {
    errEl.textContent = 'Cannot connect to server. Please try again.';
    errEl.style.color = 'var(--red)';
  } finally {
    btn.textContent = 'Login to Dashboard';
    btn.disabled = false;
  }
}

function showDashboard() {
  document.getElementById('loginScreen').style.display  = 'none';
  document.getElementById('panel-dashboard').style.display = 'block';
  document.getElementById('panel-dashboard').classList.add('active');
  isLoggedIn = true;
  loadDashboard();
}

function logout() {
  localStorage.removeItem('admin_token');
  adminToken = null;
  location.reload();
}

// ============================================================
// NAVIGATION
// ============================================================
function showPanel(name, el) {
  document.querySelectorAll('.panel').forEach(p => { p.classList.remove('active'); p.style.display = 'none'; });
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const panel = document.getElementById('panel-' + name);
  if (panel) { panel.style.display = 'block'; panel.classList.add('active'); }
  if (el) el.classList.add('active');
  document.getElementById('pageTitle').textContent = {
    dashboard:'Dashboard', products:'Products', orders:'Orders',
    customers:'Customers', categories:'Categories', coupons:'Coupons', settings:'Settings'
  }[name] || name;
  if (name === 'products')   loadProducts();
  if (name === 'orders')     loadOrders();
  if (name === 'customers')  loadCustomers();
  if (name === 'categories') loadCategories();
  if (name === 'coupons')    loadCoupons();
}

function toggleSidebar() { document.getElementById('sidebar').classList.toggle('open'); }

// ============================================================
// DASHBOARD
// ============================================================
async function loadDashboard() {
  ['stat-revenue','stat-orders','stat-customers','stat-products'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '...';
  });
  document.getElementById('recentOrdersTable').innerHTML =
    '<tr><td colspan="5" style="text-align:center;padding:1rem;color:var(--text2)">Loading from database...</td></tr>';

  try {
    const [pRes, oRes] = await Promise.all([
      fetch(`${API_BASE}/products`).then(r => r.json()).catch(() => ({ products: [] })),
      fetch(`${API_BASE}/orders/all`, { headers: authHeaders() }).then(r => r.json()).catch(() => ({ orders: [] })),
    ]);
    allProducts = pRes.products || [];
    allOrders   = oRes.orders   || [];

    const revenue = allOrders.reduce((s, o) => s + (o.total || 0), 0);
    const uniqueCustomers = new Set(allOrders.map(o => o.address?.email || o.address?.phone || '').filter(Boolean));
    document.getElementById('stat-products').textContent  = allProducts.length;
    document.getElementById('stat-orders').textContent    = allOrders.length;
    document.getElementById('stat-revenue').textContent   = '₹' + revenue.toLocaleString('en-IN');
    document.getElementById('stat-customers').textContent = uniqueCustomers.size;

    const weekCounts = [0,0,0,0,0,0,0];
    const now = new Date();
    allOrders.forEach(o => {
      const d = new Date(o.createdAt);
      const diff = Math.floor((now - d) / 86400000);
      if (diff < 7) weekCounts[d.getDay()]++;
    });
    const todayIdx = now.getDay();
    const orderedCounts = [];
    for (let i = 1; i <= 7; i++) orderedCounts.push(weekCounts[(todayIdx + i) % 7]);
    const maxV = Math.max(...orderedCounts, 1);
    document.getElementById('weeklyChart').innerHTML = orderedCounts.map(v =>
      `<div class="mini-bar" style="height:${Math.max((v/maxV)*100,4)}%"><div class="tooltip">${v} orders</div></div>`
    ).join('');

    const catOrders = {};
    allOrders.forEach(o => (o.items || []).forEach(item => {
      const prod = allProducts.find(p => p._id === item.id || p.name === item.name);
      const cat  = prod?.category || 'Other';
      catOrders[cat] = (catOrders[cat] || 0) + (item.qty || 1);
    }));
    const totalItems = Object.values(catOrders).reduce((a,b) => a+b, 0) || 1;
    const sortedCats = Object.entries(catOrders).sort((a,b) => b[1]-a[1]).slice(0,5);
    document.getElementById('topCategories').innerHTML = sortedCats.length
      ? sortedCats.map(([name, count]) => {
          const pct = Math.round((count / totalItems) * 100);
          return `<div style="margin-bottom:0.8rem">
            <div style="display:flex;justify-content:space-between;font-size:0.78rem;margin-bottom:4px">
              <span style="color:var(--text)">${name}</span><span style="color:var(--text2)">${pct}%</span>
            </div>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          </div>`;
        }).join('')
      : '<p style="color:var(--text2);font-size:0.85rem">No order data yet</p>';

    const recent = allOrders.slice(0, 6);
    document.getElementById('recentOrdersTable').innerHTML = recent.length
      ? recent.map(o => `
          <tr>
            <td class="td-name">${o.orderId || o._id}</td>
            <td>${o.address?.firstName || 'Customer'} ${o.address?.lastName || ''}</td>
            <td>₹${o.total || 0}</td>
            <td>${statusBadge(o.status)}</td>
            <td>${formatDate(o.createdAt)}</td>
          </tr>`).join('')
      : '<tr><td colspan="5"><div class="empty"><div class="icon">📦</div><p>No orders in database yet</p></div></td></tr>';

  } catch(e) {
    console.error('Dashboard load error:', e);
    document.getElementById('recentOrdersTable').innerHTML =
      '<tr><td colspan="5" style="text-align:center;padding:1rem;color:var(--red)">Could not connect to API.</td></tr>';
    ['stat-revenue','stat-orders','stat-customers','stat-products'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '—';
    });
  }
}

// ============================================================
// PRODUCTS
// ============================================================
async function loadProducts() {
  try {
    const res  = await fetch(`${API_BASE}/products`);
    const data = await res.json();
    allProducts = data.products || [];
  } catch {
    allProducts = localProducts();
  }
  buildProductCatFilter();
  renderProducts(allProducts);
}

function buildProductCatFilter() {
  const cats = ['All', ...new Set(allProducts.map(p => p.category))];
  document.getElementById('productCatFilter').innerHTML = cats.map(c =>
    `<div class="cat-pill ${c==='All'?'active':''}" onclick="filterProductsByCat('${c}',this)">${c}</div>`).join('');
}

function filterProductsByCat(cat, el) {
  productFilter = cat;
  document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  const list = cat === 'All' ? allProducts : allProducts.filter(p => p.category === cat);
  renderProducts(list);
}

function renderProducts(list) {
  document.getElementById('productCount').textContent = list.length;
  document.getElementById('productsTable').innerHTML = list.length ? list.map(p => `
    <tr>
      <td><div class="product-cell"><div class="product-thumb">${p.image ? `<img src="${p.image}" alt="${p.name}" onerror="this.parentNode.innerHTML='${(p.emoji||'🍰').replace(/'/g,"\\'")}'"/>` : (p.emoji||'🍰')}</div><div class="td-name">${p.name}</div></div></td>
      <td><span class="badge badge-blue">${p.category}</span></td>
      <td style="color:var(--orange);font-weight:700">₹${p.price}</td>
      <td><span style="text-decoration:line-through;color:var(--text3)">₹${p.oldPrice||'-'}</span></td>
      <td>${p.badge ? `<span class="badge badge-orange">${p.badge}</span>` : '-'}</td>
      <td>⭐ ${p.rating||'4.5'}</td>
      <td><div class="action-btns">
        <button class="icon-btn icon-btn-edit" onclick="openProductModal(${p.id||"'"+p._id+"'"})">✏️</button>
        <button class="icon-btn icon-btn-del" onclick="deleteProduct(${p.id||"'"+p._id+"'"})">🗑️</button>
      </div></td>
    </tr>`).join('') : '<tr><td colspan="7"><div class="empty"><div class="icon">🧁</div><p>No products found</p></div></td></tr>';
}

function searchProducts(q) {
  const list = allProducts.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.category.toLowerCase().includes(q.toLowerCase()));
  renderProducts(list);
}

async function populateProductCategoryDropdown(selectedCategory = '') {
  if (allCategories.length === 0) {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      const data = await res.json();
      allCategories = data.categories || [];
    } catch {
      toast('Could not load categories', 'red');
    }
  }
  const sel = document.getElementById('p-cat');
  if (allCategories.length === 0) {
    sel.innerHTML = '<option value="">No categories found — add one first</option>';
    return;
  }
  sel.innerHTML = allCategories.map(c =>
    `<option value="${c.name}" ${c.name === selectedCategory ? 'selected' : ''}>${c.name}</option>`
  ).join('');
}

async function openProductModal(id = null) {
  editingProductId = id;
  document.getElementById('productModalTitle').textContent = id ? 'Edit Product' : 'Add Product';
  clearImage();
  const existingCategory = id ? (allProducts.find(x => x.id === id || x._id === id)?.category || '') : '';
  await populateProductCategoryDropdown(existingCategory);
  if (id) {
    const p = allProducts.find(x => x.id === id || x._id === id);
    if (p) {
      document.getElementById('p-name').value     = p.name || '';
      document.getElementById('p-cat').value      = p.category || '';
      document.getElementById('p-price').value    = p.pricePerKg || p.price || '';
      document.getElementById('p-oldprice').value = p.oldPrice || '';
      document.getElementById('p-weight').value   = '';
      document.getElementById('p-badge').value    = p.badge || '';
      document.getElementById('p-rating').value   = p.rating || '';
      document.getElementById('p-emoji').value    = p.emoji || '';
      document.getElementById('p-desc').value     = p.desc || p.description || '';
      document.getElementById('p-ingredients').value = p.ingredients || '';
      document.getElementById('p-tags').value     = (p.tags || []).join(', ');
      if (p.image) setImagePreview(p.image, p.image.startsWith('data:') ? 'Uploaded file' : 'URL: ' + p.image.slice(0,40) + '…');
    }
  } else {
    ['p-name','p-price','p-oldprice','p-weight','p-badge','p-rating','p-emoji','p-desc','p-ingredients','p-tags'].forEach(fid => document.getElementById(fid).value = '');
  }
  openModal('productModal');
}

async function saveProduct() {
  const name = document.getElementById('p-name').value.trim();
  const price = document.getElementById('p-price').value;
  if (!name || !price) { toast('Name and price are required', 'red'); return; }

  const pricePerKg = parseFloat(price);
  const productData = {
    name,
    pricePerKg,
    price: pricePerKg, // keep price = pricePerKg for backward compat; frontend will compute by weight
    category:  document.getElementById('p-cat').value,
    oldPrice:  parseFloat(document.getElementById('p-oldprice').value) || 0,
    weight:    '', // weight handled on frontend via selector
    badge:     document.getElementById('p-badge').value.trim(),
    rating:    parseFloat(document.getElementById('p-rating').value) || 4.5,
    emoji:     document.getElementById('p-emoji').value.trim() || '🍰',
    image:     document.getElementById('p-image').value.trim() || '',
    desc:      document.getElementById('p-desc').value.trim(),
    ingredients: document.getElementById('p-ingredients').value.trim(),
    tags:      document.getElementById('p-tags').value.split(',').map(t => t.trim()).filter(Boolean),
  };

  try {
    const method = editingProductId ? 'PUT' : 'POST';
    const url    = editingProductId ? `${API_BASE}/products/${editingProductId}` : `${API_BASE}/products`;
    const res = await fetch(url, {
      method,
      headers: authHeaders(),
      body: JSON.stringify(productData),
    });
    const data = await res.json();
    if (data.success) {
      toast(editingProductId ? 'Product updated!' : 'Product added!', 'green');
      closeModal('productModal');
      loadProducts();
      return;
    } else {
      toast('Error: ' + (data.message || 'Save failed'), 'red');
    }
  } catch (e) {
    toast('Network error: ' + e.message, 'red');
  }
}

async function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  try {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    const data = await res.json();
    if (!data.success) { toast('Server error: ' + (data.message||'Delete failed'), 'red'); return; }
    allProducts = allProducts.filter(p => p.id !== id && p._id !== id);
    renderProducts(allProducts);
    toast('Product deleted!', 'red');
  } catch(e) {
    toast('Cannot reach server', 'red');
  }
}

// ============================================================
// ORDERS
// ============================================================
async function loadOrders() {
  document.getElementById('ordersTable').innerHTML =
    `<tr><td colspan="8" style="text-align:center;padding:1.5rem;color:var(--text2)">Loading orders from database...</td></tr>`;

  try {
    const res  = await fetch(`${API_BASE}/orders/all`, { headers: authHeaders() });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    allOrders = data.orders || [];
  } catch (e) {
    console.error('Orders load error:', e);
    // Try alternate endpoint
    try {
      const res2 = await fetch(`${API_BASE}/orders`, { headers: authHeaders() });
      const data2 = await res2.json();
      allOrders = data2.orders || [];
    } catch {
      allOrders = [];
      toast('Could not load orders', 'red');
    }
  }

  renderOrders(allOrders);
}

function renderOrders(list) {
  document.getElementById('orderCount').textContent = list.length;
  document.getElementById('ordersTable').innerHTML = list.length ? list.map(o => `
    <tr>
      <td class="td-name">${o.orderId || o.id}</td>
      <td>${o.address?.firstName || o.customer || 'Customer'} ${o.address?.lastName || ''}</td>
      <td>${(o.items || []).length} item${(o.items||[]).length !== 1 ? 's' : ''}</td>
      <td style="color:var(--orange);font-weight:700">₹${o.total || 0}</td>
      <td><span class="badge badge-gray">${(o.payment?.method || 'ONLINE').toUpperCase()}</span></td>
      <td>${statusBadge(o.status)}</td>
      <td>${formatDate(o.createdAt || o.date)}</td>
      <td><div class="action-btns">
        <button class="icon-btn icon-btn-view" onclick="viewOrder('${o.orderId || o.id || o._id}')">👁️</button>
      </div></td>
    </tr>`).join('') :
    '<tr><td colspan="8"><div class="empty"><div class="icon">📦</div><p>No orders found in database</p></div></td></tr>';
}

function searchOrders(q) {
  const list = allOrders.filter(o => (o.orderId||'').toLowerCase().includes(q.toLowerCase()) || (o.address?.firstName||'').toLowerCase().includes(q.toLowerCase()));
  renderOrders(list);
}

function filterOrders(status) {
  const list = status ? allOrders.filter(o => o.status === status) : allOrders;
  renderOrders(list);
}

function viewOrder(orderId) {
  currentOrderId = orderId;
  const o = allOrders.find(x => x.orderId === orderId || x.id === orderId || x._id === orderId);
  if (!o) { toast('Order not found', 'red'); return; }

  document.getElementById('orderModalTitle').textContent = 'Order ' + (o.orderId || orderId);
  document.getElementById('orderModalBody').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.2rem">
      <div>
        <div style="font-size:0.72rem;color:var(--text2);text-transform:uppercase;margin-bottom:4px">Update Status</div>
        <select id="orderStatusSel" style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:8px 10px;color:var(--text);font-family:'DM Sans',sans-serif;width:100%;font-size:0.88rem">
          <option value="confirmed"        ${(o.status||'confirmed')==='confirmed'        ?'selected':''}>✅ Confirmed</option>
          <option value="preparing"        ${o.status==='preparing'        ?'selected':''}>👨‍🍳 Preparing</option>
          <option value="packed"           ${o.status==='packed'           ?'selected':''}>📦 Packed</option>
          <option value="out_for_delivery" ${o.status==='out_for_delivery' ?'selected':''}>🚚 Out for Delivery</option>
          <option value="delivered"        ${o.status==='delivered'        ?'selected':''}>🏠 Delivered</option>
          <option value="cancelled"        ${o.status==='cancelled'        ?'selected':''}>❌ Cancelled</option>
        </select>
      </div>
      <div>
        <div style="font-size:0.72rem;color:var(--text2);text-transform:uppercase;margin-bottom:4px">Payment</div>
        <div style="font-weight:600;color:var(--text);padding-top:8px">${(o.payment?.method||'ONLINE').toUpperCase()}</div>
      </div>
    </div>
    ${o.address ? `
    <div style="background:var(--surface2);border-radius:var(--radius);padding:1rem;margin-bottom:1rem">
      <div style="font-size:0.72rem;color:var(--text2);text-transform:uppercase;margin-bottom:6px">Delivery Address</div>
      <div style="font-size:0.88rem;color:var(--text);line-height:1.6;word-break:break-word;">
        <strong>${o.address.firstName} ${o.address.lastName||''}</strong><br>
        ${o.address.line1||''}${o.address.line2?', '+o.address.line2:''}<br>
        ${o.address.city||''}, ${o.address.state||''} – ${o.address.pincode||''}<br>
        📞 ${o.address.phone||''}
      </div>
    </div>` : ''}
    <div style="background:var(--surface2);border-radius:var(--radius);padding:1rem">
      <div style="font-size:0.72rem;color:var(--text2);text-transform:uppercase;margin-bottom:8px">Items Ordered</div>
      ${(o.items||[]).map(i =>
        `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border);font-size:0.85rem">
          <span style="color:var(--text)">${i.name} × ${i.qty}</span>
          <span style="color:var(--orange);font-weight:600">₹${(i.price * i.qty).toLocaleString('en-IN')}</span>
        </div>`).join('')}
      <div style="display:flex;justify-content:space-between;padding:8px 0 0;font-size:0.9rem;font-weight:700;color:var(--text)">
        <span>Total</span><span>₹${(o.total||0).toLocaleString('en-IN')}</span>
      </div>
    </div>`;
  openModal('orderModal');
}

// ============================================================
// ✅ FIX: updateOrderStatus — properly saves to DB with token
// ============================================================
async function updateOrderStatus() {
  const newStatus = document.getElementById('orderStatusSel')?.value;
  if (!newStatus) { toast('No status selected', 'red'); return; }

  const o = allOrders.find(x => x.orderId === currentOrderId || x.id === currentOrderId || x._id === currentOrderId);
  const dbId = o?.orderId || currentOrderId;

  const btn = document.getElementById('updateStatusBtn');
  btn.textContent = 'Saving...';
  btn.disabled = true;

  try {
    const res = await fetch(`${API_BASE}/orders/${dbId}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      toast('Failed to update: ' + (err.message || `Error ${res.status}`), 'red');
      btn.textContent = 'Update Status';
      btn.disabled = false;
      return;
    }

    const result = await res.json();

    // Update local array so table reflects immediately
    if (o) o.status = newStatus;
    renderOrders(allOrders);

    toast('✅ Order status updated to: ' + newStatus.replace(/_/g,' '), 'green');
    closeModal('orderModal');
  } catch (e) {
    toast('Network error: ' + e.message, 'red');
  } finally {
    btn.textContent = 'Update Status';
    btn.disabled = false;
  }
}

// ============================================================
// CUSTOMERS
// ============================================================
async function loadCustomers() {
  try {
    const res  = await fetch(`${API_BASE}/users`, { headers: authHeaders() });
    const data = await res.json();
    allCustomers = data.users || [];
  } catch { allCustomers = mockCustomers(); }
  renderCustomers(allCustomers);
}

function renderCustomers(list) {
  document.getElementById('customerCount').textContent = list.length;
  document.getElementById('customersTable').innerHTML = list.length ? list.map(u => `
    <tr>
      <td class="td-name">${u.name}</td>
      <td>${u.email}</td>
      <td>${u.phone || '-'}</td>
      <td><span class="badge badge-orange">${u.orders || 0} orders</span></td>
      <td>${formatDate(u.createdAt)}</td>
      <td><div class="action-btns">
        <button class="icon-btn icon-btn-view" onclick="toast('Customer: ${u.name}')">👁️</button>
      </div></td>
    </tr>`).join('') : '<tr><td colspan="6"><div class="empty"><div class="icon">👥</div><p>No customers yet</p></div></td></tr>';
}

function searchCustomers(q) {
  const list = allCustomers.filter(u => u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()));
  renderCustomers(list);
}

// ============================================================
// CATEGORIES
// ============================================================
async function loadCategories() {
  document.getElementById('categoriesGrid').innerHTML =
    '<div style="color:var(--text2);padding:2rem;grid-column:1/-1;text-align:center">Loading categories...</div>';
  try {
    const res = await fetch(`${API_BASE}/categories`);
    const data = await res.json();
    allCategories = data.categories || [];
  } catch {
    toast('Could not load categories from server', 'red');
    allCategories = [];
  }
  if (allProducts.length === 0) {
    try {
      const res = await fetch(`${API_BASE}/products`);
      const data = await res.json();
      allProducts = data.products || [];
    } catch {}
  }
  renderCategories();
}

function renderCategories() {
  document.getElementById('categoriesGrid').innerHTML = allCategories.length
    ? allCategories.map((c) => {
        const imgSrc = c.image || null;
        const count  = allProducts.filter(p => p.category === c.name).length;
        return `
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.5rem;text-align:center;position:relative;overflow:hidden">
          <div style="width:72px;height:72px;border-radius:50%;margin:0 auto 0.8rem;overflow:hidden;background:var(--surface3);display:flex;align-items:center;justify-content:center;border:2px solid var(--border2)">
            ${imgSrc
              ? `<img src="${imgSrc}" alt="${c.name}" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display='none';this.nextSibling.style.display='flex'"/><span style="display:none;font-size:2rem;width:100%;height:100%;align-items:center;justify-content:center">${c.emoji||'🍰'}</span>`
              : `<span style="font-size:2rem">${c.emoji||'🍰'}</span>`}
          </div>
          <div style="font-weight:600;color:var(--text);margin-bottom:4px">${c.name}</div>
          <div style="font-size:0.75rem;color:var(--text2)">${count} product${count!==1?'s':''}</div>
          <button class="icon-btn icon-btn-del" style="position:absolute;top:8px;right:8px" onclick="deleteCategory('${c._id}')">🗑️</button>
        </div>`;
      }).join('')
    : '<div class="empty" style="grid-column:1/-1"><div class="icon">🗂️</div><p>No categories yet. Add one!</p></div>';
}

function openCatModal() {
  removeCatImage();
  document.getElementById('cat-name').value = '';
  document.getElementById('cat-emoji').value = '';
  document.getElementById('cat-img-url').value = '';
  openModal('catModal');
}

let catImageData = null;

function handleCatImageFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) { toast('Image must be under 2MB', 'red'); return; }
  const reader = new FileReader();
  reader.onload = e => setCatImagePreview(e.target.result);
  reader.readAsDataURL(file);
}

function loadCatImageFromUrl() {
  const url = document.getElementById('cat-img-url').value.trim();
  if (!url || !url.startsWith('http')) { toast('Enter a valid URL', 'red'); return; }
  setCatImagePreview(url);
}

function setCatImagePreview(src) {
  catImageData = src;
  document.getElementById('catImgPreview').src = src;
  document.getElementById('catImgPreviewWrap').style.display = 'inline-block';
  document.getElementById('catImgPlaceholder').style.display = 'none';
}

function removeCatImage() {
  catImageData = null;
  document.getElementById('catImgPreview').src = '';
  document.getElementById('catImgPreviewWrap').style.display = 'none';
  document.getElementById('catImgPlaceholder').style.display = 'block';
  document.getElementById('cat-img-file').value = '';
  document.getElementById('cat-img-url').value = '';
}

async function saveCategory() {
  const name  = document.getElementById('cat-name').value.trim();
  const emoji = document.getElementById('cat-emoji').value.trim() || '📦';
  if (!name) { toast('Category name required', 'red'); return; }
  const urlFieldValue = document.getElementById('cat-img-url').value.trim();
  const image = catImageData || (urlFieldValue.startsWith('http') ? urlFieldValue : '');
  const payload = { name, emoji, image };
  try {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed'); }
    toast('Category added!', 'green');
    closeModal('catModal');
    loadCategories();
  } catch (e) {
    toast('Error: ' + e.message, 'red');
  }
}

async function deleteCategory(id) {
  if (!confirm('Delete this category?')) return;
  try {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    if (!res.ok) throw new Error('Delete failed');
    toast('Category deleted', 'red');
    loadCategories();
  } catch (e) {
    toast('Error: ' + e.message, 'red');
  }
}

// ============================================================
// COUPONS
// ============================================================
async function loadCoupons() {
  document.getElementById('couponsTable').innerHTML =
    '<tr><td colspan="7" style="text-align:center;padding:1.5rem;color:var(--text2)">Loading coupons...</td></tr>';
  try {
    const res = await fetch(`${API_BASE}/coupons`);
    const data = await res.json();
    allCoupons = data.coupons || [];
  } catch {
    toast('Could not load coupons from server', 'red');
    allCoupons = [];
  }
  renderCoupons();
}

function renderCoupons() {
  document.getElementById('couponsTable').innerHTML = allCoupons.length
    ? allCoupons.map((c) => `
    <tr>
      <td class="td-name" style="font-family:monospace;font-size:0.95rem;letter-spacing:1px">${c.code}</td>
      <td style="color:var(--orange);font-weight:700">${c.discount}${c.type==='percent'?'%':'₹'}</td>
      <td><span class="badge badge-blue">${c.type==='percent'?'Percentage':'Flat'}</span></td>
      <td>₹${c.min||0}</td>
      <td>${c.uses||0} / ${c.maxUses||100}</td>
      <td>${c.active ? '<span class="badge badge-green">Active</span>' : '<span class="badge badge-red">Inactive</span>'}</td>
      <td><div class="action-btns">
        <button class="icon-btn icon-btn-edit" title="${c.active?'Deactivate':'Activate'}" onclick="toggleCoupon('${c._id}',${!c.active})">${c.active?'⏸️':'▶️'}</button>
        <button class="icon-btn icon-btn-del" onclick="deleteCoupon('${c._id}')">🗑️</button>
      </div></td>
    </tr>`).join('')
    : '<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--text2)">No coupons yet. Create one!</td></tr>';
}

function openCouponModal() { openModal('couponModal'); }

async function saveCoupon() {
  const code = document.getElementById('cp-code').value.trim().toUpperCase();
  const discount = parseFloat(document.getElementById('cp-discount').value);
  if (!code || !discount) { toast('Code and discount required', 'red'); return; }
  const payload = {
    code, discount,
    type: document.getElementById('cp-type').value,
    min: parseFloat(document.getElementById('cp-min').value) || 0,
    maxUses: parseInt(document.getElementById('cp-uses').value) || 100,
    active: true
  };
  try {
    const res = await fetch(`${API_BASE}/coupons`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed'); }
    toast('Coupon created!', 'green');
    closeModal('couponModal');
    document.getElementById('cp-code').value = '';
    document.getElementById('cp-discount').value = '';
    loadCoupons();
  } catch (e) {
    toast('Error: ' + e.message, 'red');
  }
}

async function toggleCoupon(id, newActive) {
  try {
    await fetch(`${API_BASE}/coupons/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ active: newActive })
    });
    loadCoupons();
  } catch { toast('Update failed', 'red'); }
}

async function deleteCoupon(id) {
  if (!confirm('Delete this coupon?')) return;
  try {
    const res = await fetch(`${API_BASE}/coupons/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    if (!res.ok) throw new Error('Delete failed');
    toast('Coupon deleted', 'red');
    loadCoupons();
  } catch (e) {
    toast('Error: ' + e.message, 'red');
  }
}

// ============================================================
// SETTINGS
// ============================================================
function saveSettings() { toast('Settings saved!', 'green'); }
async function testAPI() {
  try {
    const res  = await fetch(`${API_BASE}/health`);
    const data = await res.json();
    toast('API connected: ' + (data.message || 'OK'), 'green');
  } catch { toast('Cannot reach API', 'red'); }
}

// ============================================================
// IMAGE UPLOAD HELPERS
// ============================================================
function handleImageFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) { toast('Image must be under 2MB', 'red'); return; }
  const reader = new FileReader();
  reader.onload = e => setImagePreview(e.target.result, `📁 ${file.name} (${(file.size/1024).toFixed(0)}KB)`);
  reader.readAsDataURL(file);
}

function loadImageFromUrl() {
  const url = document.getElementById('p-img-url').value.trim();
  if (!url) return;
  if (!url.startsWith('http')) { toast('Enter a valid URL starting with http', 'red'); return; }
  const testImg = new Image();
  testImg.onload = () => { setImagePreview(url, 'URL: ' + url.slice(0,45) + (url.length > 45 ? '…' : '')); toast('Image loaded!', 'green'); };
  testImg.onerror = () => { toast('Cannot load image from that URL. Try uploading directly.', 'red'); };
  testImg.src = url;
}

function setImagePreview(src, sourceLabel) {
  document.getElementById('p-image').value = src;
  document.getElementById('imgPreview').src = src;
  document.getElementById('imgSource').textContent = sourceLabel || '';
  document.getElementById('imgUploadPlaceholder').style.display = 'none';
  document.getElementById('imgPreviewWrap').style.display = 'block';
  document.getElementById('imgUploadArea').style.cursor = 'default';
}

function clearImage() {
  document.getElementById('p-image').value = '';
  document.getElementById('p-img-url').value = '';
  document.getElementById('p-img-file').value = '';
  document.getElementById('imgPreview').src = '';
  document.getElementById('imgSource').textContent = '';
  document.getElementById('imgUploadPlaceholder').style.display = 'block';
  document.getElementById('imgPreviewWrap').style.display = 'none';
  document.getElementById('imgUploadArea').style.cursor = 'pointer';
}

// ============================================================
// MODAL HELPERS
// ============================================================
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal-overlay').forEach(m => m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); }));

// ============================================================
// TOAST
// ============================================================
function toast(msg, type = 'default') {
  const el = document.getElementById('toast');
  const icons = { green: '✅', red: '❌', default: 'ℹ️' };
  el.innerHTML = `<span>${icons[type]||'ℹ️'}</span> ${msg}`;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3500);
}

// ============================================================
// HELPERS
// ============================================================
function statusBadge(status) {
  const map = {
    confirmed:'badge-blue', preparing:'badge-orange', packed:'badge-orange',
    out_for_delivery:'badge-orange', delivered:'badge-green', cancelled:'badge-red'
  };
  const labels = {
    confirmed:'Confirmed', preparing:'Preparing', packed:'Packed',
    out_for_delivery:'Out for Delivery', delivered:'Delivered', cancelled:'Cancelled'
  };
  return `<span class="badge ${map[status]||'badge-gray'}">${labels[status]||status||'Confirmed'}</span>`;
}

function formatDate(d) {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}

function mockCustomers() {
  return [
    { name:'Priya Raman', email:'priya@gmail.com', phone:'9876543210', orders:5, createdAt: new Date(Date.now()-86400000*10).toISOString() },
    { name:'Karthik Shankar', email:'karthik@gmail.com', phone:'9876541234', orders:3, createdAt: new Date(Date.now()-86400000*5).toISOString() },
  ];
}

function localProducts() {
  return [
    {id:1,name:'Black Forest Cake',category:'Cakes',price:549,oldPrice:699,weight:'500g',emoji:'🎂',badge:'Best Seller',rating:4.8},
    {id:2,name:'Butter Cookies Box',category:'Cookies',price:199,oldPrice:249,weight:'250g',emoji:'🍪',badge:'10% Off',rating:4.6},
    {id:3,name:'Whole Wheat Bread',category:'Breads',price:65,oldPrice:75,weight:'400g',emoji:'🍞',badge:'Fresh',rating:4.5},
  ];
}