/* ==========================================================================
   RIWAAYAT - Royal Men's Ethnic Couture JavaScript Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initial Preloaded Cart Data with exclusive Royal Men's Ethnic items
  let cart = [
    {
      id: 101,
      name: "Imperial Ivory Zardozi Groom Sherwani Set",
      price: 480.00,
      image: "images/hero-sherwani.jpg",
      variant: "Size: 40 (M) / Pure Raw Silk",
      quantity: 1
    },
    {
      id: 102,
      name: "Emerald Green Banarasi Brocade Bundi",
      price: 165.00,
      image: "images/cat-nehru-jacket.jpg",
      variant: "Size: 38 (S) / Pure Brocade Silk",
      quantity: 1
    },
    {
      id: 103,
      name: "Midnight Navy Bespoke Jodhpuri Bandhgala",
      price: 320.00,
      image: "images/cat-bandhgala.jpg",
      variant: "Size: 40 (M) / Structured Heritage Cut",
      quantity: 1
    }
  ];

  let wishlistCount = 2;
  let promoApplied = false;
  const PROMO_DISCOUNT = 0.15; // 15% Royal Privilege

  // DOM Elements
  const siteHeader = document.querySelector('.site-header');
  const cartToggleBtn = document.getElementById('cartToggleBtn');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartBadgeCount = document.getElementById('cartBadgeCount');
  const cartHeaderCount = document.getElementById('cartHeaderCount');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartTotal = document.getElementById('cartTotal');
  const discountRow = document.getElementById('discountRow');
  const cartDiscount = document.getElementById('cartDiscount');
  const promoInput = document.getElementById('promoInput');
  const applyPromoBtn = document.getElementById('applyPromoBtn');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const wishlistCountEl = document.getElementById('wishlistCount');

  // Modals & Search
  const lookbookModal = document.getElementById('lookbookModal');
  const closeLookbookBtn = document.getElementById('closeLookbookBtn');
  const viewLookbookHeroBtn = document.getElementById('viewLookbookHeroBtn');
  const shopNowHeroBtn = document.getElementById('shopNowHeroBtn');

  const searchModal = document.getElementById('searchModal');
  const openSearchBtn = document.getElementById('openSearchBtn');
  const closeSearchBtn = document.getElementById('closeSearchBtn');
  const searchInput = document.getElementById('searchInput');

  /* ==========================================================================
     Navbar Scroll Shrink Handler (Large Logo -> Small Logo on Scroll)
     ========================================================================== */
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });

  /* ==========================================================================
     Cart Drawer Functions
     ========================================================================== */
  function openCart() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (cartToggleBtn) cartToggleBtn.addEventListener('click', openCart);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  function renderCart() {
    if (!cartItemsList) return;
    cartItemsList.innerHTML = '';

    if (cart.length === 0) {
      cartItemsList.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--color-secondary);">
          <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" stroke-width="1.5" fill="none" style="margin-bottom: 1rem; opacity: 0.5;">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <p style="font-family: var(--font-sans); font-weight: 600;">Your Royal Shopping Bag is empty</p>
          <button class="btn-primary" style="margin-top: 1rem;" onclick="document.getElementById('catalog').scrollIntoView({behavior: 'smooth'}); document.getElementById('cartDrawer').classList.remove('open'); document.getElementById('cartOverlay').classList.remove('open');">EXPLORE MENSWEAR</button>
        </div>
      `;
    } else {
      cart.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-details">
            <h4 class="cart-item-name">${item.name}</h4>
            <span class="cart-item-variant">${item.variant}</span>
            <div class="cart-item-price-qty">
              <div class="qty-controls">
                <button class="qty-btn dec-qty" data-id="${item.id}" aria-label="Decrease quantity">-</button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn inc-qty" data-id="${item.id}" aria-label="Increase quantity">+</button>
              </div>
              <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          </div>
        `;
        cartItemsList.appendChild(itemEl);
      });
    }

    // Update Counts & Totals
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartBadgeCount) cartBadgeCount.textContent = totalQty;
    if (cartHeaderCount) cartHeaderCount.textContent = totalQty;

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;

    let finalTotal = subtotal;
    if (promoApplied) {
      const discountVal = subtotal * PROMO_DISCOUNT;
      finalTotal = subtotal - discountVal;
      if (cartDiscount) cartDiscount.textContent = `-$${discountVal.toFixed(2)}`;
      if (discountRow) discountRow.style.display = 'flex';
    } else {
      if (discountRow) discountRow.style.display = 'none';
    }

    if (cartTotal) cartTotal.textContent = `$${finalTotal.toFixed(2)}`;
  }

  // Quantity Handler in Cart
  if (cartItemsList) {
    cartItemsList.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.id);
      if (!id) return;

      if (e.target.classList.contains('inc-qty')) {
        const item = cart.find(i => i.id === id);
        if (item) item.quantity += 1;
      } else if (e.target.classList.contains('dec-qty')) {
        const item = cart.find(i => i.id === id);
        if (item) {
          item.quantity -= 1;
          if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
            showToast(`Removed from royal bag`);
          }
        }
      }
      renderCart();
    });
  }

  // Apply Promo Code
  if (applyPromoBtn && promoInput) {
    applyPromoBtn.addEventListener('click', () => {
      const code = promoInput.value.trim().toUpperCase();
      if (code === 'ROYAL15' || code === 'GLAMORA') {
        promoApplied = true;
        showToast('👑 Promo code ROYAL15 applied! 15% royal discount granted.');
        renderCart();
      } else if (code === '') {
        showToast('Please enter a promo code');
      } else {
        showToast('Invalid promo code. Try ROYAL15');
      }
    });
  }

  // Size Pill Selectors on Product Cards
  document.querySelectorAll('.product-card').forEach(card => {
    const pills = card.querySelectorAll('.size-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        card.dataset.selectedSize = pill.textContent.trim();
        showToast(`Selected Size: ${pill.textContent.trim()}`);
      });
    });
  });

  // Add to Bag Buttons on Product Cards
  document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      const img = btn.dataset.img;
      const card = btn.closest('.product-card');
      const selectedSize = card?.dataset.selectedSize || "40 (M)";

      const existing = cart.find(item => item.id === id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          id,
          name,
          price,
          image: img,
          variant: `Size: ${selectedSize} / Bespoke Fit`,
          quantity: 1
        });
      }
      renderCart();
      openCart();
      showToast(`Added "${name}" (${selectedSize}) to your Royal Bag!`);
    });
  });

  // Checkout Button Action
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('Your royal bag is empty!');
        return;
      }
      showToast('✨ Redirecting to secure royal bespoke checkout...');
      setTimeout(() => {
        alert('Thank you for choosing RIWAAYAT Royal Men\'s Couture!\nOur master stylist will be in touch regarding your bespoke measurements.');
        cart = [];
        promoApplied = false;
        renderCart();
        closeCart();
      }, 1200);
    });
  }

  /* ==========================================================================
     Wishlist Toggle
     ========================================================================== */
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('wishlist-active');
      if (btn.classList.contains('wishlist-active')) {
        wishlistCount += 1;
        showToast('Added to your Royal Wishlist 👑');
      } else {
        wishlistCount = Math.max(0, wishlistCount - 1);
        showToast('Removed from Royal Wishlist');
      }
      if (wishlistCountEl) wishlistCountEl.textContent = wishlistCount;
    });
  });

  /* ==========================================================================
     Category Tabs Filtering
     ========================================================================== */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const productCards = document.querySelectorAll('.product-card');

  window.filterCategory = function (category) {
    tabBtns.forEach(b => {
      if (b.dataset.category === category) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    document.querySelectorAll('.couture-chip, .hero-chip').forEach(chip => {
      const onclickAttr = chip.getAttribute('onclick') || '';
      if (onclickAttr.includes(`'${category}'`)) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });

    productCards.forEach(card => {
      if (category === 'all' || card.dataset.category === category) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  };

  tabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.dataset.category;
      window.filterCategory(category);
    });
  });

  // Category circle cards clicking
  document.querySelectorAll('.category-circle-card').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const filter = card.dataset.filter;
      if (filter) {
        window.filterCategory(filter);
      }
      const catalogEl = document.getElementById('catalog');
      if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ==========================================================================
     Lookbook Modal & Hero CTAs
     ========================================================================== */
  function openLookbook() {
    if (lookbookModal) lookbookModal.classList.add('open');
  }

  function closeLookbook() {
    if (lookbookModal) lookbookModal.classList.remove('open');
  }

  if (viewLookbookHeroBtn) viewLookbookHeroBtn.addEventListener('click', openLookbook);
  if (closeLookbookBtn) closeLookbookBtn.addEventListener('click', closeLookbook);
  if (shopNowHeroBtn) {
    shopNowHeroBtn.addEventListener('click', () => {
      const catalogEl = document.getElementById('catalog');
      if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
    });
  }
  if (lookbookModal) {
    lookbookModal.addEventListener('click', (e) => {
      if (e.target === lookbookModal) closeLookbook();
    });
  }

  if (shopNowHeroBtn) {
    shopNowHeroBtn.addEventListener('click', () => {
      const catalog = document.getElementById('catalog');
      if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     Search Modal & Live Search
     ========================================================================== */
  if (openSearchBtn && searchModal) {
    openSearchBtn.addEventListener('click', () => {
      searchModal.classList.add('open');
      setTimeout(() => searchInput && searchInput.focus(), 100);
    });
  }

  if (closeSearchBtn && searchModal) {
    closeSearchBtn.addEventListener('click', () => {
      searchModal.classList.remove('open');
    });
  }

  if (searchModal) {
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) searchModal.classList.remove('open');
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value.toLowerCase().trim();
      const resultsContainer = document.getElementById('searchResults');
      if (!resultsContainer) return;

      if (val === '') {
        resultsContainer.innerHTML = `<p style="font-size: 0.85rem; color: var(--color-secondary);">Popular searches: <strong>Groom Sherwani</strong>, <strong>Banarasi Bundi</strong>, <strong>Black Chikankari</strong>, <strong>Bandhgala Suit</strong>, <strong>Royal Mojari</strong></p>`;
        return;
      }

      const matches = Array.from(productCards).filter(card => {
        const title = card.querySelector('.product-title')?.textContent.toLowerCase() || '';
        const category = card.querySelector('.product-category')?.textContent.toLowerCase() || '';
        return title.includes(val) || category.includes(val);
      });

      if (matches.length === 0) {
        resultsContainer.innerHTML = `<p style="font-size: 0.9rem; color: var(--color-secondary);">No royal pieces found matching "${val}"</p>`;
      } else {
        resultsContainer.innerHTML = matches.map(card => {
          const title = card.querySelector('.product-title')?.textContent || '';
          const price = card.querySelector('.current-price')?.textContent || '';
          const img = card.querySelector('img')?.src || '';
          return `
            <div style="display: flex; align-items: center; gap: 14px; padding: 10px; border-radius: 8px; background: var(--bg-hero); cursor: pointer; transition: background 0.2s;" onclick="document.getElementById('searchModal').classList.remove('open'); document.getElementById('catalog').scrollIntoView({behavior:'smooth'});">
              <img src="${img}" alt="${title}" style="width: 52px; height: 64px; object-fit: cover; border-radius: 6px;">
              <div>
                <div style="font-weight: 700; font-size: 0.92rem; font-family: var(--font-serif);">${title}</div>
                <div style="font-size: 0.85rem; color: var(--color-accent-gold-dark); font-weight: 700;">${price}</div>
              </div>
            </div>
          `;
        }).join('');
      }
    });
  }

  /* ==========================================================================
     Toast Notifications Helper
     ========================================================================== */
  window.showToast = function (message) {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  };

  // Initial render
  renderCart();
});
