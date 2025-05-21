/**
 * Combined Counter Synchronization
 * This script ensures cart and wishlist counters are synchronized
 * across tabs and properly animated together
 */

(function () {
  // Constants
  const CART_STORAGE_KEY = "cartCount";
  const WISHLIST_STORAGE_KEY = "wishlistCount";
  const WISHLIST_FULL_STORAGE_KEY = "ecommerce_wishlist";

  // Initialize on load
  document.addEventListener("DOMContentLoaded", function () {
    setupCounterSynchronization();
  });

  // Setup counter synchronization
  function setupCounterSynchronization() {
    // Initial update from localStorage
    syncFromLocalStorage();

    // Listen for cart updates
    document.addEventListener("cart:updated", function (e) {
      if (e.detail && typeof e.detail.count !== "undefined") {
        updateCounter("cart", e.detail.count);
      }
    });

    // Listen for wishlist updates
    document.addEventListener("wishlist:updated", function (e) {
      if (e.detail && typeof e.detail.count !== "undefined") {
        updateCounter("wishlist", e.detail.count);
      }
    });

    // Cross-tab synchronization
    window.addEventListener("storage", function (e) {
      if (e.key === CART_STORAGE_KEY) {
        const count = parseInt(e.newValue || "0");
        if (!isNaN(count)) {
          updateCounter("cart", count, false); // Don't save to avoid loops
        }
      } else if (
        e.key === WISHLIST_STORAGE_KEY ||
        e.key === WISHLIST_FULL_STORAGE_KEY
      ) {
        syncFromLocalStorage();
      }
    });

    // Sync on visibility change
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible") {
        syncFromLocalStorage();
      }
    });
  }

  // Update counter by type
  function updateCounter(type, count, saveToStorage = true) {
    // Determine elements and storage key
    const counterClass =
      type === "cart" ? ".cart-counter" : ".wishlist-counter";
    const tooltipClass =
      type === "cart" ? ".cart-tooltip" : ".wishlist-tooltip";
    const iconName = type === "cart" ? "bag-handle-outline" : "heart-outline";
    const storageKey =
      type === "cart" ? CART_STORAGE_KEY : WISHLIST_STORAGE_KEY;

    // Update the DOM
    const counters = document.querySelectorAll(counterClass);

    counters.forEach((counter) => {
      const oldCount = parseInt(counter.textContent || "0");
      if (oldCount !== count) {
        // Update count with animation
        counter.textContent = count;
        counter.classList.add("counter-update");

        // Animate the icon
        const icon = counter
          .closest(".action-btn")
          ?.querySelector(`ion-icon[name="${iconName}"]`);
        if (icon) {
          icon.style.animation = "none";
          void icon.offsetWidth; // Trigger reflow
          icon.style.animation = "counterPulse 0.5s ease-in-out";
        }

        // Remove animation class after animation completes
        setTimeout(() => {
          counter.classList.remove("counter-update");
        }, 500);

        // Adjust size based on count digits
        if (count > 9) {
          counter.style.width = "24px";
        } else {
          counter.style.width = count > 0 ? "22px" : "18px";
        }
        counter.style.fontSize = count > 0 ? "12px" : "10px";

        // Update tooltip
        updateTooltipText(type, tooltipClass, count);
      }
    });

    // Save to localStorage for cross-tab sync if needed
    if (saveToStorage) {
      try {
        localStorage.setItem(storageKey, count.toString());
      } catch (e) {
        console.error(`Failed to save ${type} count to localStorage:`, e);
      }
    }
  }

  // Update tooltip text
  function updateTooltipText(type, tooltipClass, count) {
    const tooltips = document.querySelectorAll(tooltipClass);
    const emptyText = type === "cart" ? "Cart Empty" : "Wishlist Empty";
    const singularText =
      type === "cart" ? "View Cart (1 item)" : "View Wishlist (1 item)";
    const pluralText =
      type === "cart"
        ? `View Cart (${count} items)`
        : `View Wishlist (${count} items)`;

    tooltips.forEach((tooltip) => {
      if (count === 0) {
        tooltip.textContent = emptyText;
      } else if (count === 1) {
        tooltip.textContent = singularText;
      } else {
        tooltip.textContent = pluralText;
      }
    });
  }

  // Sync from localStorage
  function syncFromLocalStorage() {
    try {
      // Sync cart count
      const cartCount = localStorage.getItem(CART_STORAGE_KEY);
      if (cartCount) {
        updateCounter("cart", parseInt(cartCount), false);
      }

      // Sync wishlist count
      let wishlistCount = localStorage.getItem(WISHLIST_STORAGE_KEY);

      // If direct count not available, try getting from full wishlist object
      if (!wishlistCount) {
        const wishlistData = localStorage.getItem(WISHLIST_FULL_STORAGE_KEY);
        if (wishlistData) {
          try {
            const parsedData = JSON.parse(wishlistData);
            wishlistCount = parsedData.count || "0";
          } catch (e) {
            console.error("Error parsing wishlist data:", e);
          }
        }
      }

      if (wishlistCount) {
        updateCounter("wishlist", parseInt(wishlistCount), false);
      }
    } catch (e) {
      console.error("Error syncing counts from localStorage:", e);
    }
  }
})();
