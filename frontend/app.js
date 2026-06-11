// ============================================================
// API CONFIG
// ============================================================
const API_BASE = window.location.origin + '/api';
let RAZORPAY_KEY = 'rzp_test_SgoJAptrv9wz1j'; // fallback
apiFetch('/config').then(data => { if(data.success && data.razorpayKeyId) RAZORPAY_KEY = data.razorpayKeyId.trim(); }).catch(()=>{});

const FALLBACK_CATEGORIES = [
  { name:'Murukku',  image:'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80', count:18 },
  { name:'Mixture',  image:'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80', count:12 },
  { name:'Sweets',   image:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',    count:22 },
  { name:'Namkeen',  image:'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&q=80', count:15 },
  { name:'Chips',    image:'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&q=80', count:10 },
  { name:'Ladoo',    image:'https://images.unsplash.com/photo-1645177628172-a94c1f96debb?w=400&q=80', count:8  },
];
let CATEGORIES = [...FALLBACK_CATEGORIES];

const LOCAL_PRODUCTS = [
  { id:1,  name:'Crispy Murukku',  category:'Murukku', price:149, pricePerKg:596, oldPrice:189, weight:'250g', image:'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80', badge:'Best Seller', rating:4.8, reviews:312, description:'Traditional rice flour murukku with cumin and sesame seeds, fried to golden perfection.' },
  { id:2,  name:'Kara Sev',        category:'Namkeen', price:109, pricePerKg:545, oldPrice:139, weight:'200g', image:'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&q=80', badge:'Spicy',      rating:4.7, reviews:198, description:'Spicy gram flour sev with black pepper and curry leaves.' },
  { id:3,  name:'Bombay Mixture',  category:'Mixture', price:129, pricePerKg:516, oldPrice:159, weight:'250g', image:'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80', badge:'Fan Fav',    rating:4.9, reviews:502, description:'A crunchy medley of sev, peanuts, curry leaves and fried gram.' },
  { id:4,  name:'Coconut Burfi',   category:'Sweets',  price:199, pricePerKg:663, oldPrice:249, weight:'300g', image:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', badge:'Pure Ghee',  rating:4.8, reviews:267, description:'Soft, melt-in-mouth coconut burfi made with fresh grated coconut and cardamom.' },
  { id:5,  name:'Boondi Ladoo',    category:'Ladoo',   price:179, pricePerKg:716, oldPrice:229, weight:'250g', image:'https://images.unsplash.com/photo-1645177628172-a94c1f96debb?w=600&q=80', badge:'Festive',   rating:4.9, reviews:445, description:'Golden boondi soaked in sugar syrup with cardamom and cashews.' },
  { id:6,  name:'Banana Chips',    category:'Chips',   price:89,  pricePerKg:445, oldPrice:110, weight:'200g', image:'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&q=80', badge:'Kerala Style', rating:4.6, reviews:321, description:'Thin, crispy Kerala-style banana chips fried in pure coconut oil.' },
  { id:7,  name:'Ribbon Pakoda',   category:'Murukku', price:139, pricePerKg:695, oldPrice:169, weight:'200g', image:'https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&q=80', badge:'Crunchy',   rating:4.7, reviews:189, description:'Flat ribbon-shaped snack from rice and gram flour.' },
  { id:8,  name:'Mysore Pak',      category:'Sweets',  price:249, pricePerKg:996, oldPrice:299, weight:'250g', image:'https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?w=600&q=80', badge:'Premium',   rating:4.9, reviews:378, description:'The legendary Mysore Pak — crumbly, ghee-laden, melt-in-mouth.' },
  { id:9,  name:'Masala Peanuts',  category:'Namkeen', price:79,  pricePerKg:395, oldPrice:99,  weight:'200g', image:'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&q=80', badge:'10% Off',   rating:4.5, reviews:156, description:'Crunchy peanuts in spicy gram flour batter.' },
  { id:10, name:'Besan Ladoo',     category:'Ladoo',   price:169, pricePerKg:676, oldPrice:209, weight:'250g', image:'https://images.unsplash.com/photo-1631459663000-4427b87d2bf3?w=600&q=80', badge:'Traditional', rating:4.8, reviews:289, description:'Nutty roasted besan combined with ghee and cardamom.' },
  { id:11, name:'Tapioca Chips',   category:'Chips',   price:99,  pricePerKg:495, oldPrice:119, weight:'200g', image:'https://images.unsplash.com/photo-1576506542790-51244b486a6b?w=600&q=80', badge:'Crispy',    rating:4.4, reviews:112, description:'Thinly sliced tapioca chips with rock salt.' },
  { id:12, name:'Chivda Mix',      category:'Mixture', price:119, pricePerKg:397, oldPrice:149, weight:'300g', image:'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=600&q=80', badge:'Light',     rating:4.6, reviews:203, description:'Poha-based light and crunchy snack with peanuts.' },
];

const REVIEWS = [
  {name:'Priya Raman',      location:'Mylapore',        text:"Swamy Bakery has been our family's go-to for 15 years! The murukku and mixture are absolutely addictive. Best in Chennai!", stars:'★★★★★', initials:'PR'},
  {name:'Karthik Shankar',  location:'Anna Nagar',      text:"Ordered 50 boxes of Mysore Pak for our office Diwali gifts. Delivered on time, packaging gorgeous, everyone loved them!", stars:'★★★★★', initials:'KS'},
  {name:'Meena Subramaniam',location:'T. Nagar',        text:"The banana chips are now a daily snack at home. Crispy, fresh, and fried in coconut oil. Delivery always punctual.", stars:'★★★★☆', initials:'MS'},
  {name:'Arjun K',          location:'Adyar',           text:"Got a custom Diwali hamper — 6 varieties, beautiful box, tasted even better than I imagined. So professional!", stars:'★★★★★', initials:'AK'},
  {name:'Lakshmi V',        location:'Velachery',       text:"The boondi ladoo is seasonal magic. So perfectly proportioned, not too sweet. I wait for it every festive season!", stars:'★★★★★', initials:'LV'},
  {name:'Raj Iyer',         location:'Nungambakkam',    text:"My daughter loves the coconut burfi. Made with real coconut and ghee — you can taste the quality difference!", stars:'★★★★★', initials:'RI'},
];

// ============================================================
// STATE
// ============================================================
let cart       = JSON.parse(localStorage.getItem('swamy_cart') || '[]');
let wishlist   = JSON.parse(localStorage.getItem('swamy_wish') || '[]');
let authToken  = localStorage.getItem('swamy_token') || null;
let authUser   = JSON.parse(localStorage.getItem('swamy_user') || 'null');
let appliedCoupon = null;

function getMergedProducts() {
  try {
    const adminProds = JSON.parse(localStorage.getItem('admin_products') || 'null');
    if (adminProds && adminProds.length) return adminProds;
  } catch {}
  return [...LOCAL_PRODUCTS];
}

let allProducts          = getMergedProducts();
let shopProductsFiltered = [...allProducts];
let currentProduct       = null;
let currentQty           = 1;
let currentDetailWeight  = 250; // grams, default 250g for detail page
let maxPrice             = 1000;
let selectedSlot         = 'Today 2–4 PM';

// ============================================================
// API HELPER
// ============================================================
async function apiFetch(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (authToken) headers['Authorization'] = 'Bearer ' + authToken;
  const res = await fetch(API_BASE + path, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

// ============================================================
// NAVIGATION  (SPA history-aware)
// ============================================================
let _currentPage = 'home';

function navigate(page, opts = {}) {
  // Push a history entry so swipe-back stays inside the app
  if (!opts.fromPopstate) {
    history.pushState({ page }, '', '#' + page);
  }
  _currentPage = page;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById('page-' + page);
  if (el) el.classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const navEl = document.getElementById('nav-' + page);
  if (navEl) navEl.classList.add('active');
  window.scrollTo(0, 0);
  if (page === 'shop')     renderShop();
  if (page === 'cart')     renderCart();
  if (page === 'checkout') renderCheckout();
  if (page === 'wishlist') renderWishlist();
  if (page === 'about')    renderAbout();
  if (page === 'myorders') renderMyOrders();
  updateCartBadge();
}

// ── Swipe-back / hardware back-button handler ───────────────
let _lastBackPress = 0;

window.addEventListener('popstate', function(e) {
  const state = e.state;
  if (state && state.page) {
    // Navigate to the page encoded in the history state (no new push)
    navigate(state.page, { fromPopstate: true });
    // If a specific product was stored, re-open it
    if (state.page === 'product' && state.pid) {
      openProduct(state.pid, { fromPopstate: true });
    }
  } else {
    // We've reached the bottom of our history stack (home page)
    const now = Date.now();
    if (now - _lastBackPress < 2000) {
      // Second back within 2s → let the browser exit
      return;
    }
    _lastBackPress = now;
    // Push a sentinel so we don't exit immediately
    history.pushState({ page: 'home' }, '', '#home');
    navigate('home', { fromPopstate: true });
    showToast('Press back again to exit');
  }
});

// ============================================================
// HOME
// ============================================================
async function initHome() {
  initHeroCarousel();
  try {
    const res = await fetch(`${API_BASE}/categories`);
    const data = await res.json();
    if (data.categories && data.categories.length) {
      CATEGORIES = data.categories.map(c => ({
        name: c.name, image: c.image || '', emoji: c.emoji || '📦',
        count: allProducts.filter(p => p.category === c.name).length || 0
      }));
    }
  } catch {}

  const catEl = document.getElementById('homeCategories');
  if (catEl) catEl.innerHTML = CATEGORIES.map(c =>
    `<div class="category-card" onclick="filterByCategory('${c.name}')">
      ${c.image
        ? `<img src="${c.image}" alt="${c.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/>
           <div style="display:none;width:100%;height:100%;align-items:center;justify-content:center;font-size:3rem;background:var(--cream2)">${c.emoji||'📦'}</div>`
        : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3.5rem;background:var(--cream2)">${c.emoji||'📦'}</div>`
      }
      <div class="category-overlay">
        <div class="cat-emoji">${c.emoji||'📦'}</div>
        <div class="cat-name">${c.name}</div>
        <div class="cat-count">${c.count} item${c.count !== 1 ? 's' : ''}</div>
        <div class="cat-arrow">›</div>
      </div>
    </div>`).join('');

  const revEl = document.getElementById('homeReviews');
  if (revEl) revEl.innerHTML = REVIEWS.map(r =>
    `<div class="review-card">
      <div class="review-stars">${r.stars}</div>
      <p class="review-text">"${r.text}"</p>
      <div class="reviewer">
        <div class="reviewer-avatar">${r.initials}</div>
        <div><div class="reviewer-name">${r.name}</div><div class="reviewer-location">${r.location}</div></div>
      </div>
    </div>`).join('');

  try {
    const data = await apiFetch('/products');
    if (data.success && data.products && data.products.length) {
      allProducts = data.products;
      CATEGORIES = CATEGORIES.map(c => ({ ...c, count: allProducts.filter(p => p.category === c.name).length }));
      renderProductGrid('featuredProducts', data.products.slice(0, 8));
    } else throw new Error('no products');
  } catch {
    renderProductGrid('featuredProducts', LOCAL_PRODUCTS.slice(0, 8));
  }

  loadActiveCouponBanner();
}

// ============================================================
// PRODUCT CARD
// ============================================================
function getProductId(p) { return p._id || p.id; }

const WEIGHT_OPTIONS = [
  { label: '250g', grams: 250 },
  { label: '500g', grams: 500 },
  { label: '750g', grams: 750 },
  { label: '1kg',  grams: 1000 },
];

function getPriceByWeight(pricePerKg, weight) {
  return Math.round((pricePerKg / 1000) * weight);
}

function getProductPricePerKg(p) {
  return p.pricePerKg || p.price || 0;
}

// Track selected weight per product card
const cardSelectedWeight = {};

function selectCardWeight(pid, grams, btn) {
  cardSelectedWeight[String(pid)] = grams;
  const card = document.getElementById('card-' + pid);
  if (card) {
    card.querySelectorAll('.weight-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  const p = findProduct(pid);
  if (!p) return;
  const pricePerKg = getProductPricePerKg(p);
  const newPrice = getPriceByWeight(pricePerKg, grams);
  const priceEl = document.getElementById('card-price-' + pid);
  if (priceEl) priceEl.textContent = '₹' + newPrice;
  if (p.oldPrice) {
    const oldPriceEl = document.getElementById('card-oldprice-' + pid);
    if (oldPriceEl) {
      const oldPrice = getPriceByWeight(p.oldPrice, grams);
      oldPriceEl.textContent = '₹' + oldPrice;
      const offEl = document.getElementById('card-off-' + pid);
      if (offEl) { offEl.textContent = Math.round((1 - newPrice / oldPrice) * 100) + '%'; }
    }
  }
}

function addToCartWithWeight(pid, qty = 1) {
  const grams = cardSelectedWeight[String(pid)] || WEIGHT_OPTIONS[0].grams;
  addToCart(pid, qty, grams);
}

function productCard(p) {
  const pid = getProductId(p);
  const wishlisted = wishlist.includes(String(pid));
  const pricePerKg = getProductPricePerKg(p);
  const defaultGrams = WEIGHT_OPTIONS[0].grams; // 250g
  const displayPrice = getPriceByWeight(pricePerKg, defaultGrams);
  const displayOldPrice = p.oldPrice ? getPriceByWeight(p.oldPrice, defaultGrams) : 0;
  const off = displayOldPrice ? Math.round((1 - displayPrice / displayOldPrice) * 100) : 0;
  const rating = p.rating || 4.5;
  const stars = '★'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '½' : '') ;
  const savings = off > 0 ? Math.round(displayOldPrice - displayPrice) : 0;
  return `
  <div class="product-card" id="card-${pid}">
    <div class="product-card-img" onclick="openProduct('${pid}')">
      ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ''}
      ${p.image
        ? `<img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.onerror=null;this.parentElement.innerHTML='🍿';" style="object-fit:cover;width:100%;height:100%;"/>`
        : `<div class="img-fallback">🍿</div>`}
      <div class="product-card-img-overlay"></div>
      <button class="wishlist-btn ${wishlisted ? 'active' : ''}" onclick="toggleWishlist(event,'${pid}')">
        <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
      </button>
    </div>
    <div class="product-card-body">
      <div class="product-rating">
        <span class="stars">${stars}</span>
        <span class="rating-count">${rating} (${p.reviews || 0})</span>
      </div>
      <div class="product-category">${p.category}</div>
      <div class="product-name">${p.name}</div>
      <div class="weight-selector">
        ${WEIGHT_OPTIONS.map(w =>
          '<button class="weight-btn ' + (w.grams === defaultGrams ? 'active' : '') + '"'
          + ' onclick="event.stopPropagation();selectCardWeight(\''+ pid +'\','+ w.grams +',this)"'
          + ' data-grams="' + w.grams + '">' + w.label + '</button>'
        ).join('')}
      </div>
      <div class="product-footer">
        <div>
          <span class="product-price" id="card-price-${pid}">₹${displayPrice}</span>
          ${p.oldPrice ? `<span class="product-price-old" id="card-oldprice-${pid}">₹${displayOldPrice}</span>` : ''}
          ${savings > 0 ? `<div class="product-savings">Save ₹${savings}</div>` : ''}
        </div>
        <button class="add-cart-btn" onclick="event.stopPropagation();addToCartWithWeight('${pid}')">+ Add</button>
      </div>
    </div>
  </div>`;
}

function renderProductGrid(elId, list) {
  const el = document.getElementById(elId);
  if (el) el.innerHTML = list.length
    ? list.map(p => productCard(p)).join('')
    : '<p style="color:var(--text2);padding:2rem;grid-column:1/-1">No products found.</p>';
}

// ============================================================
// SHOP
// ============================================================
async function renderShop() {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    const data = await res.json();
    if (data.categories && data.categories.length) {
      CATEGORIES = data.categories.map(c => ({ name: c.name, image: c.image || '', emoji: c.emoji || '📦', count: 0 }));
    }
  } catch {}

  const catFiltersEl = document.getElementById('categoryFilters');
  if (catFiltersEl) {
    catFiltersEl.innerHTML = CATEGORIES.map(c =>
      `<div class="filter-option">
        <input type="checkbox" id="cat_${c.name}" checked onchange="applyFilters()"/>
        <label for="cat_${c.name}">${c.name}</label>
      </div>`).join('');
  }
  try {
    const data = await apiFetch('/products');
    if (data.success && data.products) {
      allProducts = data.products;
      shopProductsFiltered = [...data.products];
    } else throw new Error();
  } catch {
    allProducts = [...LOCAL_PRODUCTS];
    shopProductsFiltered = [...LOCAL_PRODUCTS];
  }
  renderShopGrid();
}

function renderShopGrid() {
  renderProductGrid('shopProducts', shopProductsFiltered);
  const countEl = document.getElementById('shopCount');
  if (countEl) countEl.textContent = `Showing ${shopProductsFiltered.length} snack${shopProductsFiltered.length !== 1 ? 's' : ''}`;
}

function applyFilters() {
  const checkedCats = [...document.querySelectorAll('[id^="cat_"]:checked')].map(el => el.id.replace('cat_',''));
  shopProductsFiltered = allProducts.filter(p => checkedCats.includes(p.category) && p.price <= maxPrice);
  renderShopGrid();
}

function updatePriceFilter(val) {
  maxPrice = parseInt(val);
  document.getElementById('priceLabel').textContent = '₹' + val;
  applyFilters();
}

function sortProducts() {
  const val = document.getElementById('sortSelect').value;
  if (val === 'price_asc')  shopProductsFiltered.sort((a,b) => a.price - b.price);
  if (val === 'price_desc') shopProductsFiltered.sort((a,b) => b.price - a.price);
  if (val === 'rating')     shopProductsFiltered.sort((a,b) => (b.rating||0) - (a.rating||0));
  if (val === 'popular')    shopProductsFiltered.sort((a,b) => (b.reviews||0) - (a.reviews||0));
  renderShopGrid();
}

function toggleFilters() { document.getElementById('shopFilters').classList.toggle('open'); }

function searchProducts(query) {
  const q = (query || '').toLowerCase().trim();
  if (!q) {
    shopProductsFiltered = [...allProducts];
  } else {
    shopProductsFiltered = allProducts.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)
    );
  }
  renderShopGrid();
}

function filterByCategory(cat) {
  navigate('shop');
  setTimeout(() => {
    shopProductsFiltered = allProducts.filter(p => p.category === cat);
    renderShopGrid();
  }, 100);
}

// ============================================================
// PRODUCT DETAIL
// ============================================================
async function openProduct(pid, opts = {}) {
  currentQty = 1;
  currentDetailWeight = 250;
  let p = allProducts.find(x => String(x._id || x.id) === String(pid));
  if (!p) {
    try {
      const data = await apiFetch('/products/' + pid);
      if (data.success) p = data.product;
    } catch {}
  }
  if (!p) return;
  currentProduct = p;
  // Push product page into history (with pid so popstate can restore it)
  if (!opts.fromPopstate) {
    history.pushState({ page: 'product', pid: String(pid) }, '', '#product-' + pid);
  }
  _currentPage = 'product';
  document.querySelectorAll('.page').forEach(pg => pg.classList.remove('active'));
  const el = document.getElementById('page-product');
  if (el) el.classList.add('active');
  window.scrollTo(0, 0);
  updateCartBadge();

  document.getElementById('productBreadcrumb').innerHTML =
    `<a onclick="navigate('home')">Home</a><span>/</span><a onclick="navigate('shop')">Shop</a><span>/</span>${p.name}`;

  const mainImg = document.getElementById('mainProductImg');
  if (p.image) {
    mainImg.innerHTML = `<img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.onerror=null;this.parentElement.innerHTML='🍿';this.parentElement.style.display='flex';this.parentElement.style.alignItems='center';this.parentElement.style.justifyContent='center';this.parentElement.style.fontSize='4rem';"/>`;
  } else {
    mainImg.innerHTML = `<div class="img-fallback" style="position:absolute;inset:0;font-size:4rem">🍿</div>`;
  }

  document.getElementById('productThumbs').innerHTML = [0,1,2,3].map((i) =>
    `<div class="thumb ${i===0?'active':''}">
      ${p.image ? `<img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.onerror=null"/>` : '<div class="img-fallback">🍿</div>'}
    </div>`).join('');

  const off = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  document.getElementById('productInfoPanel').innerHTML = `
    <div class="product-category">${p.category}</div>
    <h1 style="font-size:clamp(1.1rem,3vw,2rem);color:var(--brown);line-height:1.2;margin-bottom:0.4rem">${p.name}</h1>
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:0.7rem">
      <span style="color:#F5A05E;font-size:0.95rem">${'★'.repeat(Math.floor(p.rating||4))}${'☆'.repeat(5-Math.floor(p.rating||4))}</span>
      <span style="font-size:0.85rem;font-weight:600;color:var(--brown)">${p.rating||'4.5'}</span>
      <span style="font-size:0.8rem;color:var(--text2)">(${p.reviews||0} reviews)</span>
    </div>
    <div style="margin-bottom:0.8rem">
      <div style="font-size:0.75rem;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Select Weight</div>
      <div class="weight-selector" id="detailWeightSelector">
        ${WEIGHT_OPTIONS.map(w => {
          const wPrice = getPriceByWeight(getProductPricePerKg(p), w.grams);
          return '<button class="weight-btn ' + (w.grams === 250 ? 'active' : '') + '"' +
            ' onclick="selectDetailWeight(' + w.grams + ',this)"' +
            ' data-grams="' + w.grams + '">' + w.label + '</button>';
        }).join('')}
      </div>
    </div>
    <div class="price-block">
      <span class="price-main" id="detailPrice">₹${getPriceByWeight(getProductPricePerKg(p), 250)}</span>
      ${p.oldPrice ? `<span class="price-old" id="detailOldPrice">₹${getPriceByWeight(p.oldPrice, 250)}</span>` : ''}
      ${off > 0 ? `<span class="price-off" id="detailOff">${off}% OFF</span>` : ''}
    </div>
    <div style="font-size:0.8rem;color:var(--text2);margin-top:-0.6rem;margin-bottom:0.8rem">₹${getProductPricePerKg(p)} per kg</div>
    <div class="offer-tag">🏷️ Use <strong>SWAMY10</strong> for 10% off your first order!</div>
    <div class="qty-action-row" style="display:flex;align-items:center;gap:0.8rem;margin-bottom:0.9rem">
      <div style="font-size:0.8rem;font-weight:600;color:var(--text2);white-space:nowrap">Qty:</div>
      <div class="qty-selector">
        <button class="qty-btn" onclick="changeQty(-1)">−</button>
        <div class="qty-display" id="detailQty">1</div>
        <button class="qty-btn" onclick="changeQty(1)">+</button>
      </div>
    </div>
    <div class="action-row">
      <button class="btn-primary" style="flex:1;justify-content:center" onclick="addToCart('${getProductId(p)}',currentQty,currentDetailWeight);navigate('cart')">🛒 Add to Cart</button>
      <button class="btn-buy" onclick="addToCart('${getProductId(p)}',currentQty,currentDetailWeight);navigate('checkout')">Buy Now</button>
    </div>
    <div style="margin-top:1.2rem">
      <div class="tab-nav">
        <button class="tab-btn active" onclick="setTab(this,'desc')">Description</button>
        <button class="tab-btn" onclick="setTab(this,'ing')">Ingredients</button>
      </div>
      <div id="tabContent" style="padding:0.6rem 0">
        <p style="color:var(--text2);line-height:1.75;font-size:0.9rem">${p.description||'Freshly made in our kitchen!'}</p>
      </div>
    </div>`;

  const related = allProducts.filter(x => x.category === p.category && String(x._id||x.id) !== String(pid)).slice(0, 4);
  renderProductGrid('relatedProducts', related);
}

function changeQty(delta) {
  currentQty = Math.max(1, Math.min(10, currentQty + delta));
  const el = document.getElementById('detailQty');
  if (el) el.textContent = currentQty;
}

function selectDetailWeight(grams, btn) {
  currentDetailWeight = grams;
  document.querySelectorAll('#detailWeightSelector .weight-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const p = currentProduct;
  if (!p) return;
  // Update price display
  const pricePerKg = getProductPricePerKg(p);
  const newPrice = getPriceByWeight(pricePerKg, grams);
  const priceEl = document.getElementById('detailPrice');
  if (priceEl) priceEl.textContent = '₹' + newPrice;
  if (p.oldPrice) {
    const oldPrice = getPriceByWeight(p.oldPrice, grams);
    const oldEl = document.getElementById('detailOldPrice');
    if (oldEl) oldEl.textContent = '₹' + oldPrice;
    const offEl = document.getElementById('detailOff');
    if (offEl) offEl.textContent = Math.round((1 - newPrice / oldPrice) * 100) + '% OFF';
  }
}

function setTab(el, type) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  const content = document.getElementById('tabContent');
  if (!content) return;
  if (type === 'desc') content.innerHTML = `<p style="color:var(--text2);line-height:1.8;font-size:0.92rem">${currentProduct?.description||'Freshly made in our kitchen!'}</p>`;
  else {
    const ingredients = currentProduct?.ingredients || 'Rice flour / Gram flour, Pure vegetable oil / Coconut oil, Rock salt, Cumin seeds, Sesame seeds, Red chilli, Curry leaves, Asafoetida.';
    content.innerHTML = `<p style="color:var(--text2);line-height:1.8;font-size:0.92rem">${ingredients}<br><br><strong style="color:var(--brown)">✓ No preservatives · ✓ No artificial colours · ✓ FSSAI Certified</strong></p>`;
  }
}

// ============================================================
// CART
// ============================================================
function findProduct(pid) {
  return allProducts.find(p => String(p._id||p.id) === String(pid))
      || LOCAL_PRODUCTS.find(p => String(p._id||p.id) === String(pid));
}

function addToCart(pid, qty = 1, weightGrams = 250) {
  const p = findProduct(pid);
  const pricePerKg = p ? getProductPricePerKg(p) : 0;
  const computedPrice = getPriceByWeight(pricePerKg, weightGrams);
  const key = String(pid) + '_' + weightGrams;
  const existing = cart.find(c => c.key === key);
  if (existing) existing.qty = Math.min(10, existing.qty + qty);
  else cart.push({ key, id: String(pid), weight: weightGrams, price: computedPrice, qty });
  saveCart();
  showToast('Added to cart! 🛒');
}

function removeFromCart(keyOrId) {
  cart = cart.filter(c => (c.key || c.id) !== keyOrId && String(c.id) !== String(keyOrId));
  saveCart(); renderCart();
}

function updateCartQty(keyOrId, delta) {
  const item = cart.find(c => (c.key || c.id) === keyOrId || String(c.id) === String(keyOrId));
  if (!item) return;
  item.qty = Math.max(1, Math.min(10, item.qty + delta));
  saveCart(); renderCart();
}

function saveCart() {
  localStorage.setItem('swamy_cart', JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const total = cart.reduce((s,c) => s + c.qty, 0);
  const el = document.getElementById('cartBadge');
  if (el) el.textContent = total;
  const sbbEl = document.getElementById('sbbBadge');
  if (sbbEl) sbbEl.textContent = total;
}

function getCartTotals() {
  const subtotal = cart.reduce((s,c) => {
    // Use stored per-weight price if available, else fall back to product price
    const itemPrice = c.price != null ? c.price : (findProduct(c.id)?.price || 0);
    return s + (itemPrice * c.qty);
  }, 0);
  const delivery = subtotal >= 499 ? 0 : 49;
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const total    = Math.max(0, subtotal - discount) + delivery;
  return { subtotal, delivery, discount, total };
}

function renderCart() {
  const el = document.getElementById('cartLayout');
  if (!el) return;
  if (cart.length === 0) {
    el.innerHTML = `<div style="grid-column:1/-1"><div class="empty-state"><div class="empty-icon">🛒</div><h3>Your cart is empty</h3><p>Add some freshly made snacks!</p><button class="btn-primary" onclick="navigate('shop')">Browse Snacks →</button></div></div>`;
    return;
  }
  const { subtotal, delivery, discount, total } = getCartTotals();
  el.innerHTML = `
    <div class="cart-items">
      <h3 style="font-size:1rem;font-weight:700;color:var(--brown);margin-bottom:1.2rem;padding-bottom:0.8rem;border-bottom:1px solid var(--cream2)">${cart.length} Item${cart.length>1?'s':''}</h3>
      ${cart.map(c => {
        const p = findProduct(c.id);
        if (!p) return '';
        return `<div class="cart-item">
          <div class="cart-item-img">
            ${p.image ? `<img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.onerror=null;this.parentElement.innerHTML='🍿';this.parentElement.style.display='flex';this.parentElement.style.alignItems='center';this.parentElement.style.justifyContent='center';this.parentElement.style.fontSize='2rem';"/>` : '<div style="display:flex;align-items:center;justify-content:center;font-size:2rem;width:100%;height:100%">🍿</div>'}
          </div>
          <div class="cart-item-info">
            <div class="cart-item-name">${p.name}</div>
            <div class="cart-item-meta">${p.category} · ${c.weight >= 1000 ? (c.weight/1000)+'kg' : (c.weight||250)+'g'}</div>
            <div class="cart-qty">
              <button class="cart-qty-btn" onclick="updateCartQty('${c.key || c.id}',-1)">−</button>
              <div class="cart-qty-val">${c.qty}</div>
              <button class="cart-qty-btn" onclick="updateCartQty('${c.key || c.id}',1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart('${c.key || c.id}')">✕ Remove</button>
          </div>
          <div class="cart-item-price">₹${(c.price||p.price)*c.qty}<div style="font-size:0.75rem;color:var(--text2);font-weight:400">₹${c.price||p.price} each</div></div>
        </div>`;
      }).join('')}
    </div>
    <div class="cart-summary">
      <h3 style="font-size:1rem;font-weight:700;color:var(--brown);margin-bottom:1.2rem;padding-bottom:0.8rem;border-bottom:1px solid var(--cream2)">Order Summary</h3>
      <div class="summary-row"><span>Subtotal</span><span>₹${subtotal}</span></div>
      <div class="summary-row"><span>Delivery</span><span>${delivery===0?'<span style="color:green;font-weight:600">FREE</span>':'₹'+delivery}</span></div>
      ${delivery>0?`<div style="font-size:0.78rem;color:var(--text2);margin-top:-0.4rem;margin-bottom:0.8rem">Add ₹${499-subtotal} more for free delivery</div>`:''}
      ${discount>0?`<div class="summary-row" style="color:green;font-weight:600"><span>💸 Discount (${appliedCoupon.code})</span><span>−₹${discount}</span></div>`:''}
      <div class="promo-input">
        <input type="text" id="promoInput" placeholder="Promo code" value="${appliedCoupon ? appliedCoupon.code : ''}"/>
        <button onclick="${appliedCoupon ? 'removeCoupon()' : 'applyPromo()'}">${appliedCoupon ? '✕ Remove' : 'Apply'}</button>
      </div>
      <div class="summary-row total"><span>Total</span><span>₹${total}</span></div>
      <button class="btn-primary" style="width:100%;justify-content:center;margin-bottom:0.8rem;margin-top:0.5rem" onclick="navigate('checkout')">Proceed to Checkout →</button>
      <button class="btn-outline" style="width:100%;justify-content:center" onclick="navigate('shop')">Continue Shopping</button>
    </div>`;
}

async function applyPromo() {
  const code = document.getElementById('promoInput')?.value.trim().toUpperCase();
  if (!code) { showToast('Please enter a promo code'); return; }
  let coupons = [];
  try {
    const res = await fetch(`${API_BASE}/coupons`);
    const data = await res.json();
    coupons = data.coupons || [];
  } catch {
    try { coupons = JSON.parse(localStorage.getItem('admin_coupons') || '[]'); } catch {}
  }
  const coupon = coupons.find(c => c.code === code && c.active !== false);
  if (!coupon) { showToast('❌ Invalid or expired promo code'); return; }
  const { subtotal } = getCartTotals();
  if (coupon.min && subtotal < coupon.min) { showToast(`Minimum order ₹${coupon.min} required for ${code}`); return; }
  const discount = coupon.type === 'percent'
    ? Math.round(subtotal * coupon.discount / 100)
    : Math.min(coupon.discount, subtotal);
  appliedCoupon = { code, discount };
  showToast(`✅ ${code} applied! You save ₹${discount}`);
  renderCart();
}

async function loadActiveCouponBanner() {
  try {
    const res = await fetch(`${API_BASE}/coupons`);
    const data = await res.json();
    const active = (data.coupons || []).filter(c => c.active);
    if (!active.length) return;
    const c = active[0];
    const label = c.type === 'percent' ? `${c.discount}% Off` : `₹${c.discount} Off`;
    const banner = document.getElementById('ctaBanner');
    if (banner) {
      banner.innerHTML = `
        <h2>Ready to Order? Get ${label} Your Next Order!</h2>
        <p>Use code <strong style="color:var(--orange-light)">${c.code}</strong> at checkout${c.min ? ` (min ₹${c.min})` : ''}.</p>
        <button class="btn-primary" onclick="navigate('shop')">Order Now 🛒</button>`;
    }
    document.querySelectorAll('.offer-tag').forEach(el => {
      el.innerHTML = `🏷️ Use <strong>${c.code}</strong> for ${label} your order!`;
    });
  } catch {}
}

// ============================================================
// CHECKOUT
// ============================================================
function renderCheckout() {
  if (cart.length === 0) { navigate('shop'); return; }
  const { subtotal, delivery, total } = getCartTotals();
  document.getElementById('checkoutLayout').innerHTML = `
    <div>
      <div class="form-card">
        <h3>Delivery Address</h3>
        <div class="form-row">
          <div class="form-group"><label>First Name *</label><input type="text" id="ch-fname" placeholder="Ramu" value="${authUser?.name?.split(' ')[0]||''}"/></div>
          <div class="form-group"><label>Last Name</label><input type="text" id="ch-lname" placeholder="Swamy" value="${authUser?.name?.split(' ').slice(1).join(' ')||''}"/></div>
        </div>
        <div class="form-group"><label>Phone *</label><input type="tel" id="ch-phone" placeholder="9876543210" maxlength="10" value="${authUser?.phone||''}"/></div>
        <div class="form-group"><label>Email *</label><input type="email" id="ch-email" placeholder="you@email.com" value="${authUser?.email||''}"/></div>
        <div class="form-group"><label>Address Line 1 *</label><input type="text" id="ch-addr1" placeholder="House/Flat no., Street name"/></div>
        <div class="form-group"><label>Address Line 2</label><input type="text" id="ch-addr2" placeholder="Area, Landmark (optional)"/></div>
        <div class="form-row">
          <div class="form-group"><label>City</label><input type="text" id="ch-city" value="Chennai"/></div>
          <div class="form-group"><label>Pincode *</label><input type="text" id="ch-pin" placeholder="600001" maxlength="6"/></div>
        </div>
        <div class="form-group"><label>State</label>
          <select id="ch-state"><option>Tamil Nadu</option><option>Karnataka</option><option>Andhra Pradesh</option><option>Kerala</option></select>
        </div>
      </div>
      <div class="form-card">
        <h3>Delivery Slot</h3>
        <div class="delivery-slots" id="slotOptions">
          ${['Today 2–4 PM','Today 4–6 PM','Tomorrow 10–12 PM','Tomorrow 2–4 PM'].map((s,i) =>
            `<div class="slot-option ${i===0?'selected':''}" onclick="selectSlot(this,'${s}')">${s}</div>`).join('')}
        </div>
      </div>
      <div class="form-card">
        <h3>Payment Method</h3>
        <div class="payment-options">
          <div class="payment-option selected">
            <input type="radio" name="pay" checked/>
            <div class="payment-icon">💳</div>
            <div><div class="payment-label">UPI / Online Payment</div><div class="payment-sub">GPay, PhonePe, Card — via Razorpay</div></div>
          </div>
        </div>
      </div>
    </div>
    <div class="cart-summary" style="position:sticky;top:80px">
      <h3 style="font-size:1rem;font-weight:700;color:var(--brown);margin-bottom:1.2rem;padding-bottom:0.8rem;border-bottom:1px solid var(--cream2)">Order Summary</h3>
      ${cart.map(c => {
        const p = findProduct(c.id);
        if (!p) return '';
        return `<div style="display:flex;gap:10px;align-items:center;margin-bottom:0.8rem">
          <div style="width:40px;height:40px;border-radius:8px;overflow:hidden;flex-shrink:0;background:var(--cream2)">
            ${p.image ? `<img src="${p.image}" alt="${p.name}" loading="lazy" style="width:100%;height:100%;object-fit:cover"/>` : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:1.2rem">🍿</div>'}
          </div>
          <div style="flex:1;min-width:0"><div style="font-size:0.88rem;font-weight:600;color:var(--brown);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.name}</div><div style="font-size:0.75rem;color:var(--text2)">${c.weight >= 1000 ? (c.weight/1000)+'kg' : (c.weight||250)+'g'} × ${c.qty}</div></div>
          <div style="font-weight:600;color:var(--brown);font-size:0.9rem;flex-shrink:0">₹${(c.price||p.price)*c.qty}</div>
        </div>`;
      }).join('')}
      <div style="border-top:1px solid var(--cream2);padding-top:0.8rem;margin-top:0.5rem">
        <div class="summary-row"><span>Subtotal</span><span>₹${subtotal}</span></div>
        <div class="summary-row"><span>Delivery</span><span>${delivery===0?'<span style="color:green;font-weight:600">FREE</span>':'₹'+delivery}</span></div>
        <div class="summary-row total"><span>Total to Pay</span><span>₹${total}</span></div>
      </div>
      <button class="btn-primary" id="placeOrderBtn" style="width:100%;justify-content:center;margin-top:1rem" onclick="placeOrder()">Place Order ₹${total} →</button>
      <p style="font-size:0.75rem;color:var(--text2);text-align:center;margin-top:0.8rem">🔒 Secured by Razorpay · 100% Safe</p>
    </div>`;
}

function selectSlot(el, slot) {
  document.querySelectorAll('.slot-option').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
  selectedSlot = slot;
}

async function placeOrder() {
  if (!authToken || !authUser) { document.getElementById('loginRequiredModal').classList.add('open'); return; }
  const addr = {
    firstName: document.getElementById('ch-fname')?.value.trim(),
    lastName:  document.getElementById('ch-lname')?.value.trim(),
    phone:     document.getElementById('ch-phone')?.value.trim(),
    email:     document.getElementById('ch-email')?.value.trim(),
    line1:     document.getElementById('ch-addr1')?.value.trim(),
    line2:     document.getElementById('ch-addr2')?.value.trim(),
    city:      document.getElementById('ch-city')?.value.trim(),
    pincode:   document.getElementById('ch-pin')?.value.trim(),
    state:     document.getElementById('ch-state')?.value,
  };
  if (!addr.firstName)                          { showToast('Please enter your first name'); return; }
  if (!addr.phone || addr.phone.length < 10)    { showToast('Please enter a valid 10-digit phone'); return; }
  if (!addr.email || !addr.email.includes('@')) { showToast('Please enter a valid email'); return; }
  if (!addr.line1)                              { showToast('Please enter your delivery address'); return; }
  if (!addr.pincode || addr.pincode.length < 6) { showToast('Please enter a valid 6-digit pincode'); return; }
  const { total } = getCartTotals();
  openRazorpay(total, addr);
}

async function openRazorpay(amount, addr) {
  const btn = document.getElementById('placeOrderBtn');
  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Processing...'; }

  try {
    const { total } = getCartTotals();
    const orderData = {
      items: cart.map(c => ({ id: c.id, qty: c.qty, weight: c.weight })),
      address: addr,
      deliverySlot: selectedSlot
    };

    const res = await apiFetch('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({ orderData })
    });
    
    if (!res.success) {
      throw new Error(res.message || 'Failed to create payment order');
    }

    const options = {
      key: res.razorpayKeyId || RAZORPAY_KEY,
      amount: total * 100,
      currency: 'INR',
      name: 'Swamy Bakery',
      description: 'Snacks Order',
      order_id: res.razorpayOrderId,
      handler: async (response) => {
        showToast('Payment successful! Verifying...');
        // The webhook handles background confirmation, but we verify here for fast UI updates
        const verifyRes = await apiFetch('/orders', {
          method: 'POST',
          body: JSON.stringify({
            payment: {
              method: 'online',
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            },
            mongoOrderId: res.mongoOrderId
          })
        });
        
        cart = []; saveCart();
        navigate('order-success');
        setTimeout(() => renderOrderSuccess(verifyRes.order || { id: res.mongoOrderId, status: 'confirmed' }), 100);
      },
      prefill: { name: addr.firstName + ' ' + addr.lastName, email: addr.email, contact: addr.phone },
      theme: { color: '#E8763A' },
      modal: { 
        ondismiss: () => {
          showToast('Payment cancelled. Order saved as Pending.');
          if (btn) { btn.disabled = false; btn.textContent = 'Place Order →'; }
        } 
      },
    };
    new Razorpay(options).open();
  } catch (err) {
    showToast('Payment Error: ' + err.message);
    if (btn) { btn.disabled = false; btn.textContent = 'Place Order →'; }
  }
}

async function submitOrder(addr, paymentMethod, paymentData = null) {
  const btn = document.getElementById('placeOrderBtn');
  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Placing Order...'; }
  const { subtotal, delivery, total } = getCartTotals();
  
  let paymentPayload = { method: paymentMethod };
  if (paymentMethod === 'online' && paymentData) {
    paymentPayload = { ...paymentPayload, ...paymentData };
  }

  const orderData = {
    items: cart.map(c => {
      const p = findProduct(c.id);
      return { id: c.id, name: p?.name||'', price: c.price||p?.price||0, qty: c.qty, image: p?.image||'', weight: c.weight >= 1000 ? (c.weight/1000)+'kg' : (c.weight||250)+'g' };
    }),
    address: addr,
    payment: paymentPayload,
    deliverySlot: selectedSlot,
    subtotal, deliveryCharge: delivery, total,
  };
  try {
    const data = await apiFetch('/orders', { method: 'POST', body: JSON.stringify(orderData) });
    if (data.success) {
      const placedOrder = data.order || { ...orderData, id: data.orderId, status: 'confirmed' };
      const savedId = placedOrder.id || placedOrder.orderId || data.orderId || '';
      if (savedId) {
        localStorage.setItem('swamy_last_order', String(savedId));
        localStorage.setItem('swamy_last_order_data', JSON.stringify(placedOrder));
        addToLocalOrderHistory(placedOrder);
      }
      cart = []; saveCart();
      navigate('order-success');
      setTimeout(() => renderOrderSuccess(placedOrder), 100);
    } else {
      showToast('Order failed: ' + (data.message || 'Please try again'));
      if (btn) { btn.disabled = false; btn.textContent = 'Place Order →'; }
    }
  } catch {
    showToast('Cannot connect to server. Please check your connection.');
    if (btn) { btn.disabled = false; btn.textContent = 'Place Order →'; }
  }
}

function addToLocalOrderHistory(order) {
  try {
    let history = JSON.parse(localStorage.getItem('swamy_order_history') || '[]');
    const id = order.id || order.orderId || '';
    if (id && !history.find(o => (o.id || o.orderId) === id)) {
      history.unshift(order);
      if (history.length > 50) history = history.slice(0, 50);
      localStorage.setItem('swamy_order_history', JSON.stringify(history));
    }
  } catch {}
}

function getLocalOrderHistory() {
  try { return JSON.parse(localStorage.getItem('swamy_order_history') || '[]'); }
  catch { return []; }
}

// ============================================================
// MY ORDERS
// ============================================================
async function renderMyOrders() {
  showOrdersList();
  const listEl = document.getElementById('myOrdersList');
  listEl.innerHTML = `<div class="empty-state"><div class="spinner" style="border-top-color:var(--orange);border-color:var(--cream2);width:28px;height:28px;margin:0 auto 1rem"></div><p style="color:var(--text2)">Loading your orders...</p></div>`;
  let orders = [];
  try {
    const data = await apiFetch('/orders/my-orders');
    if (data.success && data.orders && data.orders.length) orders = data.orders;
    else throw new Error('no orders from api');
  } catch {
    orders = getLocalOrderHistory();
  }
  if (orders.length === 0) {
    listEl.innerHTML = `<div class="empty-state"><div class="empty-icon">📦</div><h3>No orders yet</h3><p>Your placed orders will appear here.</p><button class="btn-primary" onclick="navigate('shop')">Start Shopping →</button></div>`;
    return;
  }
  listEl.innerHTML = orders.map(o => {
    const orderId = o.id || o.orderId || '—';
    const firstItem = (o.items || [])[0];
    const itemNames = (o.items || []).map(i => i.name).join(', ') || 'Items';
    const thumb = firstItem?.image || '';
    const status = o.status || 'confirmed';
    const statusClass = 'status-' + status;
    const statusLabel = {confirmed:'Confirmed',preparing:'Preparing',packed:'Packed',shipped:'Out for Delivery',delivered:'Delivered'}[status] || status;
    const dateStr = o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) : 'Recent';
    return `
      <div class="order-row" onclick="openOrderDetail('${orderId}')">
        <div class="order-row-thumb">
          ${thumb ? `<img src="${thumb}" alt="Order" loading="lazy" onerror="this.onerror=null;this.parentElement.innerHTML='🍿';this.parentElement.style.display='flex';this.parentElement.style.alignItems='center';this.parentElement.style.justifyContent='center';this.parentElement.style.fontSize='1.5rem';"/>` : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:1.5rem">🍿</div>'}
        </div>
        <div class="order-row-info">
          <div class="order-row-id">Order #${orderId}</div>
          <div class="order-row-items">${itemNames}</div>
          <div class="order-row-date">📅 ${dateStr} · ${(o.items||[]).length} item${(o.items||[]).length!==1?'s':''}</div>
        </div>
        <div class="order-row-right">
          <div class="order-row-total">₹${o.total||0}</div>
          <span class="order-status-pill ${statusClass}">${statusLabel}</span>
        </div>
        <div class="order-row-arrow">›</div>
      </div>`;
  }).join('');
}

function showOrdersList() {
  document.getElementById('myOrdersList').style.display = 'block';
  document.getElementById('myOrdersDetail').style.display = 'none';
}

async function openOrderDetail(orderId) {
  document.getElementById('myOrdersList').style.display = 'none';
  const detailWrap = document.getElementById('myOrdersDetail');
  detailWrap.style.display = 'block';
  window.scrollTo(0, 0);
  const contentEl = document.getElementById('myOrdersDetailContent');
  contentEl.innerHTML = `<div style="text-align:center;padding:3rem"><div class="spinner" style="border-top-color:var(--orange);border-color:var(--cream2);width:28px;height:28px;margin:0 auto 1rem"></div><p style="color:var(--text2)">Loading order details...</p></div>`;
  let order = null;
  try {
    const data = await apiFetch('/orders/' + orderId);
    if (data.success) order = data.order;
  } catch {}
  if (!order) {
    const history = getLocalOrderHistory();
    order = history.find(o => String(o.id || o.orderId) === String(orderId)) || null;
    if (!order) {
      try {
        const cached = JSON.parse(localStorage.getItem('swamy_last_order_data') || 'null');
        if (cached && String(cached.id || cached.orderId) === String(orderId)) order = cached;
      } catch {}
    }
  }
  if (!order) { contentEl.innerHTML = `<div class="empty-state"><div class="empty-icon">❌</div><h3>Order not found</h3><p>Could not load order #${orderId}</p></div>`; return; }
  contentEl.innerHTML = renderOrderDetailHTML(order);
}

function renderOrderDetailHTML(o) {
  const orderId = o.id || o.orderId || '—';
  const statusSteps = ['confirmed','preparing','packed','shipped','delivered'];
  const stepEmojis  = ['✅','👨‍🍳','📦','🚚','🏠'];
  const stepLabels  = ['Order Confirmed','Preparing','Packed','Out for Delivery','Delivered'];
  const stepTimes   = ['Received','~30 min','~1 hr','~2 hrs','Done'];
  const currentIdx  = Math.max(0, statusSteps.indexOf(o.status || 'confirmed'));
  const est = o.estimatedDelivery
    ? new Date(o.estimatedDelivery).toLocaleString('en-IN',{weekday:'short',day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})
    : 'Today by 6 PM';

  return `
    <div style="background:var(--white);border-radius:var(--r-lg);padding:1.4rem 1.5rem;box-shadow:var(--shadow);margin-bottom:1rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.8rem">
      <div><div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--orange)">Order ID</div><div style="font-size:1.1rem;font-weight:700;color:var(--brown);font-family:'Playfair Display',serif">#${orderId}</div></div>
      <div style="text-align:center"><div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--orange)">Total</div><div style="font-size:1.1rem;font-weight:700;color:var(--brown)">₹${o.total||0}</div></div>
      <div style="text-align:center"><div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--orange)">Payment</div><div style="font-size:0.9rem;font-weight:600;color:var(--brown)">${(o.payment?.method||'cod').toUpperCase()}</div></div>
      <div style="text-align:right"><div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--orange)">Est. Delivery</div><div style="font-size:0.85rem;font-weight:600;color:var(--brown)">${est}</div></div>
    </div>
    <div style="background:var(--white);border-radius:var(--radius-lg);padding:1.5rem;box-shadow:var(--shadow);margin-bottom:1rem">
      <div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--orange);margin-bottom:1.2rem">🔴 Live Status</div>
      <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:2px">
        ${statusSteps.map((s,i) => `
          <div style="flex:1;text-align:center">
            <div style="width:40px;height:40px;border-radius:50%;margin:0 auto 6px;display:flex;align-items:center;justify-content:center;font-size:1rem;background:${i<currentIdx?'var(--orange)':i===currentIdx?'var(--brown)':'var(--cream2)'};color:${i<=currentIdx?'white':'var(--text2)'};${i===currentIdx?'animation:pulse 2s infinite':''}">${i<=currentIdx?stepEmojis[i]:'○'}</div>
            <div style="font-size:0.6rem;color:${i===currentIdx?'var(--brown)':i<currentIdx?'var(--orange)':'var(--text2)'};font-weight:${i<=currentIdx?'700':'400'};line-height:1.3">${stepLabels[i]}</div>
          </div>
          ${i<4?`<div style="flex:0 0 8px;height:3px;border-radius:2px;background:${i<currentIdx?'var(--orange)':'var(--cream2)'};margin-bottom:26px"></div>`:''}
        `).join('')}
      </div>
      <div style="margin-top:1rem;background:var(--orange-pale);border-radius:var(--radius);padding:0.8rem 1rem;font-size:0.88rem;color:var(--brown);font-weight:600;text-align:center">🕐 ${stepLabels[currentIdx]} — ${stepTimes[currentIdx]}</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
      <div style="background:var(--white);border-radius:var(--radius-lg);padding:1.4rem;box-shadow:var(--shadow)">
        <div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--orange);margin-bottom:1rem">Items Ordered</div>
        ${(o.items||[]).map(i=>`<div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--cream2)"><div style="width:40px;height:40px;border-radius:8px;background:var(--cream2);overflow:hidden;flex-shrink:0">${i.image?`<img src="${i.image}" loading="lazy" style="width:100%;height:100%;object-fit:cover" onerror="this.parentElement.innerHTML='🍿'"/>`:'<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:1rem">🍿</div>'}</div><div style="flex:1;min-width:0"><div style="font-size:0.85rem;font-weight:600;color:var(--brown);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${i.name}</div><div style="font-size:0.72rem;color:var(--text2)">${i.weight||''} × ${i.qty||1}</div></div><div style="font-weight:700;color:var(--brown);font-size:0.85rem;flex-shrink:0">₹${(i.price||0)*(i.qty||1)}</div></div>`).join('')}
        <div style="display:flex;justify-content:space-between;font-size:0.82rem;color:var(--text2);margin-top:0.6rem"><span>Delivery</span><span style="color:${(o.deliveryCharge||0)===0?'green':'inherit'}">${(o.deliveryCharge||0)===0?'FREE':'₹'+(o.deliveryCharge)}</span></div>
        <div style="display:flex;justify-content:space-between;font-weight:700;color:var(--brown);margin-top:4px;padding-top:6px;border-top:1px solid var(--cream2)"><span>Total</span><span>₹${o.total||0}</span></div>
      </div>
      <div style="background:var(--white);border-radius:var(--radius-lg);padding:1.4rem;box-shadow:var(--shadow)">
        <div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--orange);margin-bottom:1rem">Delivery Address</div>
        ${o.address?`<div style="font-weight:600;color:var(--brown);margin-bottom:6px">${o.address.firstName||''} ${o.address.lastName||''}</div><div style="font-size:0.85rem;color:var(--text2);line-height:1.8">${o.address.line1||''}${o.address.line2?'<br>'+o.address.line2:''}<br>${o.address.city||''}, ${o.address.state||''} – ${o.address.pincode||''}<br>📞 ${o.address.phone||''}</div><div style="margin-top:1rem;padding-top:0.8rem;border-top:1px solid var(--cream2)"><div style="font-size:0.75rem;color:var(--text2)">🕐 Delivery Slot</div><div style="font-size:0.88rem;font-weight:600;color:var(--brown)">${o.deliverySlot||'—'}</div></div>`:'<p style="color:var(--text2);font-size:0.85rem">Address not available</p>'}
      </div>
    </div>
    <div style="text-align:center;padding-bottom:1.5rem"><button class="btn-primary" onclick="navigate('shop')" style="font-size:0.88rem">Continue Shopping →</button></div>`;
}

// ============================================================
// ORDER SUCCESS
// ============================================================
function renderOrderSuccess(order) {
  const orderId = order.id || order.orderId || '—';
  const idEl = document.getElementById('successOrderId');
  if (idEl) idEl.textContent = 'Order #' + orderId;
  const est = order.estimatedDelivery
    ? new Date(order.estimatedDelivery).toLocaleString('en-IN', { weekday:'short', day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })
    : 'Today by 6 PM';
  const statusSteps = ['confirmed','preparing','packed','shipped','delivered'];
  const stepEmojis  = ['✅','👨‍🍳','📦','🚚','🏠'];
  const stepLabels  = ['Order Confirmed','Preparing in Kitchen','Packed & Ready','Out for Delivery','Delivered'];
  const currentIdx  = statusSteps.indexOf(order.status || 'confirmed');
  const body = document.getElementById('orderSuccessBody');
  if (!body) return;
  body.innerHTML = `
    <div style="background:var(--white);border-radius:var(--radius-lg);padding:1.5rem;box-shadow:var(--shadow);margin-bottom:1.2rem">
      <div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--orange);margin-bottom:1rem">Order Status</div>
      <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:4px">
        ${statusSteps.map((s,i) => `
          <div style="flex:1;text-align:center">
            <div style="width:36px;height:36px;border-radius:50%;margin:0 auto 6px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;background:${i<=currentIdx?'var(--orange)':'var(--cream2)'};color:${i<=currentIdx?'white':'var(--text2)'}">${i<=currentIdx?stepEmojis[i]:'○'}</div>
            <div style="font-size:0.62rem;color:${i===currentIdx?'var(--orange)':i<currentIdx?'var(--brown)':'var(--text2)'};font-weight:${i<=currentIdx?'600':'400'};line-height:1.3">${stepLabels[i]}</div>
          </div>
          ${i<4?`<div style="flex:0 0 16px;height:2px;background:${i<currentIdx?'var(--orange)':'var(--cream2)'};margin-bottom:22px"></div>`:''}
        `).join('')}
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;margin-bottom:1.2rem">
      <div style="background:var(--white);border-radius:var(--radius-lg);padding:1.5rem;box-shadow:var(--shadow)">
        <div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--orange);margin-bottom:1rem">Items Ordered</div>
        ${(order.items||[]).map(i => `<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--cream2)"><div style="width:42px;height:42px;border-radius:8px;background:var(--cream2);overflow:hidden;flex-shrink:0">${i.image?`<img src="${i.image}" loading="lazy" style="width:100%;height:100%;object-fit:cover"/>`:'<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:1.3rem">🍿</div>'}</div><div style="flex:1;min-width:0"><div style="font-size:0.88rem;font-weight:600;color:var(--brown);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${i.name}</div><div style="font-size:0.75rem;color:var(--text2)">${i.weight||''} × ${i.qty}</div></div><div style="font-weight:700;color:var(--brown);font-size:0.9rem;flex-shrink:0">₹${i.price*i.qty}</div></div>`).join('')}
        <div style="display:flex;justify-content:space-between;font-size:0.85rem;color:var(--text2);margin-top:0.6rem"><span>Delivery</span><span style="color:${(order.deliveryCharge||0)===0?'green':'inherit'}">${(order.deliveryCharge||0)===0?'FREE':'₹'+(order.deliveryCharge||0)}</span></div>
        <div style="display:flex;justify-content:space-between;font-size:1rem;font-weight:700;color:var(--brown);margin-top:0.6rem;padding-top:0.6rem;border-top:1px solid var(--cream2)"><span>Total Paid</span><span>₹${order.total||0}</span></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:1.2rem">
        <div style="background:var(--white);border-radius:var(--radius-lg);padding:1.5rem;box-shadow:var(--shadow)">
          <div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--orange);margin-bottom:1rem">Delivery Address</div>
          ${order.address ? `<div style="font-size:0.9rem;color:var(--brown);font-weight:600;margin-bottom:4px">${order.address.firstName||''} ${order.address.lastName||''}</div><div style="font-size:0.85rem;color:var(--text2);line-height:1.7">${order.address.line1||''}${order.address.line2?', '+order.address.line2:''}<br>${order.address.city||''}, ${order.address.state||''} – ${order.address.pincode||''}<br>📞 ${order.address.phone||''}</div>` : '<p style="color:var(--text2);font-size:0.85rem">Address not available</p>'}
        </div>
        <div style="background:var(--white);border-radius:var(--radius-lg);padding:1.5rem;box-shadow:var(--shadow)">
          <div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--orange);margin-bottom:1rem">Order Info</div>
          <div style="font-size:0.85rem;color:var(--text2);line-height:2">
            <div>🕐 Slot: <strong style="color:var(--brown)">${order.deliverySlot||'—'}</strong></div>
            <div>💳 Payment: <strong style="color:var(--brown)">${(order.payment?.method||'cod').toUpperCase()}</strong></div>
            <div>📅 Est. Delivery: <strong style="color:var(--brown)">${est}</strong></div>
          </div>
        </div>
      </div>
    </div>
    <div style="display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;padding-bottom:2rem">
      <button class="btn-primary" onclick="navigate('myorders')">📦 View My Orders</button>
      <button class="btn-outline" onclick="navigate('shop')">Continue Shopping</button>
    </div>`;
}

// ============================================================
// WISHLIST
// ============================================================
function toggleWishlist(event, pid) {
  if (event) event.stopPropagation();
  const key = String(pid);
  const idx = wishlist.indexOf(key);
  if (idx > -1) { wishlist.splice(idx,1); showToast('Removed from wishlist'); }
  else { wishlist.push(key); showToast('Added to wishlist ❤️'); }
  localStorage.setItem('swamy_wish', JSON.stringify(wishlist));
}

function renderWishlist() {
  const el = document.getElementById('wishlistProducts');
  const emptyEl = document.getElementById('wishlistEmpty');
  const list = allProducts.filter(p => wishlist.includes(String(getProductId(p))));
  if (list.length === 0) { el.innerHTML = ''; emptyEl.style.display = 'block'; }
  else { emptyEl.style.display = 'none'; el.innerHTML = list.map(p => productCard(p)).join(''); }
}

// ============================================================
// ABOUT
// ============================================================
function renderAbout() {
  // Collapse about story grid on mobile
  const grid = document.getElementById('aboutStoryGrid');
  if (grid && window.innerWidth < 640) {
    grid.style.gridTemplateColumns = '1fr';
    grid.style.gap = '1.2rem';
  }
  const values = [
    {icon:'🌾',title:'100% Fresh',    desc:'Every snack made fresh the same morning it reaches you.'},
    {icon:'🧪',title:'Lab Tested',    desc:'Monthly NABL lab tests for quality and safety of all products.'},
    {icon:'♻️',title:'Eco-Friendly',  desc:'Biodegradable packaging and zero single-use plastic.'},
    {icon:'💝',title:'Community First',desc:'15% of profits go to "Hunger Free Chennai".'},
    {icon:'🤝',title:'Farmer Direct', desc:'We source directly from Tamil Nadu farmers.'},
    {icon:'🏅',title:'Award Winning', desc:'Best Snack Brand in Chennai — Times Food Award 2019, 2021, 2023.'},
  ];
  const el = document.getElementById('aboutValues');
  if (el) el.innerHTML = values.map(v =>
    `<div class="value-card"><div class="value-icon">${v.icon}</div><h3>${v.title}</h3><p>${v.desc}</p></div>`).join('');
}

// ============================================================
// CONTACT
// ============================================================
function submitContact() {
  const fname = document.getElementById('cf-fname')?.value.trim();
  const email = document.getElementById('cf-email')?.value.trim();
  const msg   = document.getElementById('cf-msg')?.value.trim();
  if (!fname) { showToast('Please enter your name'); return; }
  if (!email || !email.includes('@')) { showToast('Please enter a valid email'); return; }
  if (!msg)   { showToast('Please write a message'); return; }
  showToast("Message sent! We'll reply within 24 hours 🎉");
  ['cf-fname','cf-lname','cf-email','cf-msg'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
}

// ============================================================
// AUTH
// ============================================================
function handleLoginClick() {
  if (authUser) {
    if (confirm(`Logged in as ${authUser.name}. Logout?`)) {
      authToken = null; authUser = null;
      localStorage.removeItem('swamy_token');
      localStorage.removeItem('swamy_user');
      showToast('Logged out successfully');
      updateLoginUI();
    }
  } else { openLogin(); }
}

function openLogin()  { document.getElementById('loginModal').classList.add('open'); }
function closeLogin() { document.getElementById('loginModal').classList.remove('open'); }
function closeLoginRequired() { document.getElementById('loginRequiredModal').classList.remove('open'); }

function updateLoginUI() {
  const btn = document.getElementById('loginBtn');
  if (btn) btn.title = authUser ? `Hi, ${authUser.name} (click to logout)` : 'Login / My Account';
}

document.getElementById('loginModal').addEventListener('click', e => {
  if (e.target === document.getElementById('loginModal')) closeLogin();
});
document.getElementById('loginRequiredModal').addEventListener('click', e => {
  if (e.target === document.getElementById('loginRequiredModal')) closeLoginRequired();
});

function switchAuth(type, el) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('loginForm').style.display  = type === 'login'  ? 'block' : 'none';
  document.getElementById('signupForm').style.display = type === 'signup' ? 'block' : 'none';
}

async function submitLogin() {
  const email = document.getElementById('li-email')?.value.trim();
  const pass  = document.getElementById('li-pass')?.value;
  if (!email || !pass) { showToast('Please fill in all fields'); return; }
  const btn = document.getElementById('loginSubmitBtn');
  btn.innerHTML = '<span class="spinner"></span> Logging in...'; btn.disabled = true;
  try {
    const data = await apiFetch('/users/login', { method: 'POST', body: JSON.stringify({ email, password: pass }) });
    if (data.success) {
      authToken = data.token; authUser = data.user;
      localStorage.setItem('swamy_token', authToken);
      localStorage.setItem('swamy_user', JSON.stringify(authUser));
      closeLogin();
      showToast(`Welcome back, ${data.user.name}! 👋`);
      updateLoginUI();
      if (cart.length > 0 && document.getElementById('page-checkout').classList.contains('active')) {
        renderCheckout();
      } else if (cart.length > 0) {
        navigate('checkout');
      }
    } else { showToast(data.message || 'Login failed'); }
  } catch (err) { showToast(err.message || 'Could not connect to server'); }
  finally { btn.textContent = 'Login'; btn.disabled = false; }
}

async function submitSignup() {
  const fname = document.getElementById('su-fname')?.value.trim();
  const lname = document.getElementById('su-lname')?.value.trim();
  const phone = document.getElementById('su-phone')?.value.trim();
  const email = document.getElementById('su-email')?.value.trim();
  const pass  = document.getElementById('su-pass')?.value;
  if (!fname || !email || !phone || !pass) { showToast('Please fill in all fields'); return; }
  if (pass.length < 6) { showToast('Password must be at least 6 characters'); return; }
  const btn = document.getElementById('signupSubmitBtn');
  btn.innerHTML = '<span class="spinner"></span> Creating Account...'; btn.disabled = true;
  try {
    const data = await apiFetch('/users/register', { method: 'POST', body: JSON.stringify({ name: fname+' '+lname, email, phone, password: pass }) });
    if (data.success) {
      authToken = data.token; authUser = data.user;
      localStorage.setItem('swamy_token', authToken);
      localStorage.setItem('swamy_user', JSON.stringify(authUser));
      closeLogin(); showToast(`Welcome to Swamy Bakery, ${data.user.name}! 🎉`); updateLoginUI();
    } else { showToast(data.message || 'Signup failed'); }
  } catch (err) { showToast(err.message || 'Could not connect to server'); }
  finally { btn.textContent = 'Create Account'; btn.disabled = false; }
}

// ============================================================
// TOAST + SCROLL
// ============================================================
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg; toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

window.addEventListener('scroll', () => {
  document.getElementById('mainNav').classList.toggle('scrolled', window.scrollY > 20);
});

function toggleMobileMenu() { document.getElementById('mobileMenu').classList.toggle('open'); }
function closeMobileMenu()  { document.getElementById('mobileMenu').classList.remove('open'); }

// ============================================================
// INIT
// ============================================================
(function fixStalLastOrder() {
  try {
    const raw = localStorage.getItem('swamy_last_order');
    if (raw && raw.startsWith('{')) {
      const parsed = JSON.parse(raw);
      const id = parsed.orderId || parsed.id || '';
      if (id) localStorage.setItem('swamy_last_order', String(id));
      else    localStorage.removeItem('swamy_last_order');
    }
  } catch { localStorage.removeItem('swamy_last_order'); }
})();

// ── Boot: show home page and seed the history stack ──────────
// Ensure home page is visible on load
document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
const _homePage = document.getElementById('page-home');
if (_homePage) _homePage.classList.add('active');

// Handle deep-link via hash on load (e.g. after Netlify redirect)
(function _handleInitHash() {
  const hash = location.hash.replace('#', '');
  if (hash && hash !== 'home') {
    const page = hash.split('-')[0]; // 'product-5' → 'product'
    const pid  = hash.includes('-') ? hash.split('-')[1] : null;
    history.replaceState({ page: 'home' }, '', '#home');
    if (pid) {
      history.pushState({ page: page, pid }, '', '#' + hash);
      openProduct(pid, { fromPopstate: false });
    } else if (page) {
      navigate(page);
    }
  } else {
    history.replaceState({ page: 'home' }, '', '#home');
  }
})();
// ============================================================
// HERO CAROUSEL
// ============================================================
let heroSlideIndex = 0;
let heroInterval = null;

function initHeroCarousel() {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;
  showHeroSlide(0);
  startHeroCarousel();
}

function startHeroCarousel() {
  clearInterval(heroInterval);
  heroInterval = setInterval(() => moveSlide(1), 4500);
}

function moveSlide(step) {
  const slides = document.querySelectorAll('.hero-slide');
  heroSlideIndex = (heroSlideIndex + step + slides.length) % slides.length;
  showHeroSlide(heroSlideIndex);
}

function currentSlide(n) {
  heroSlideIndex = n;
  showHeroSlide(heroSlideIndex);
}

function showHeroSlide(n) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('#heroDots .dot');
  if (!slides.length) return;
  
  const heroSlidesContainer = document.getElementById('heroSlides');
  if (heroSlidesContainer) {
    heroSlidesContainer.style.transform = `translateX(-${n * 25}%)`;
  }
  
  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  slides[n].classList.add('active');
  if(dots[n]) dots[n].classList.add('active');
}

// ============================================================
// BOOTSTRAP
// ============================================================
initHome();
updateCartBadge();
updateLoginUI();

