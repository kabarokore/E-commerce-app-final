/**
 * Counter System Test Script
 * This script helps developers test the cart and wishlist counter system.
 * It allows for manual testing and verification across different pages.
 */

(function () {
  // Create test interface if needed
  function createTestInterface() {
    // Only create if it doesn't exist and we're in development mode
    if (
      document.getElementById("counter-test-panel") ||
      window.location.hostname !== "localhost"
    ) {
      return;
    }

    const panel = document.createElement("div");
    panel.id = "counter-test-panel";
    panel.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 300px;
      background-color: #f0f0f0;
      border: 1px solid #ccc;
      border-radius: 5px;
      padding: 10px;
      font-family: Arial, sans-serif;
      font-size: 14px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      z-index: 9999;
    `;

    const title = document.createElement("h3");
    title.textContent = "Counter Test Panel";
    title.style.margin = "0 0 10px 0";

    const cartSection = createCounterSection(
      "Cart",
      "increment-cart",
      "decrement-cart",
      "refresh-cart"
    );
    const wishlistSection = createCounterSection(
      "Wishlist",
      "increment-wishlist",
      "decrement-wishlist",
      "refresh-wishlist"
    );

    const statusDiv = document.createElement("div");
    statusDiv.id = "counter-test-status";
    statusDiv.style.cssText = `
      margin-top: 10px;
      padding: 5px;
      border-radius: 3px;
      font-size: 12px;
      color: #666;
    `;
    statusDiv.textContent = "Ready to test counters";

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Close";
    closeBtn.style.cssText = `
      margin-top: 10px;
      padding: 5px 10px;
      background-color: #f44336;
      color: white;
      border: none;
      border-radius: 3px;
      cursor: pointer;
    `;
    closeBtn.onclick = function () {
      panel.remove();
    };

    panel.appendChild(title);
    panel.appendChild(cartSection);
    panel.appendChild(wishlistSection);
    panel.appendChild(statusDiv);
    panel.appendChild(closeBtn);

    document.body.appendChild(panel);

    // Setup event handlers
    setupEventHandlers();
  }

  function createCounterSection(title, incrementId, decrementId, refreshId) {
    const section = document.createElement("div");
    section.style.cssText = `
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #ddd;
    `;

    const heading = document.createElement("h4");
    heading.textContent = title + " Counter";
    heading.style.margin = "0 0 5px 0";

    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.gap = "5px";

    const incrementBtn = createButton("+1", incrementId);
    const decrementBtn = createButton("-1", decrementId);
    const refreshBtn = createButton("Refresh", refreshId);

    buttonContainer.appendChild(incrementBtn);
    buttonContainer.appendChild(decrementBtn);
    buttonContainer.appendChild(refreshBtn);

    section.appendChild(heading);
    section.appendChild(buttonContainer);

    return section;
  }

  function createButton(text, id) {
    const button = document.createElement("button");
    button.textContent = text;
    button.id = id;
    button.style.cssText = `
      padding: 5px 10px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      flex: 1;
    `;
    return button;
  }

  function setupEventHandlers() {
    // Cart counter buttons
    document
      .getElementById("increment-cart")
      .addEventListener("click", function () {
        const currentCount = getCurrentCartCount();
        if (window.counterUtils && window.counterUtils.setCartCount) {
          window.counterUtils.setCartCount(currentCount + 1);
          updateStatus(`Cart count incremented to ${currentCount + 1}`);
        } else {
          updateStatus("Error: counterUtils not available");
        }
      });

    document
      .getElementById("decrement-cart")
      .addEventListener("click", function () {
        const currentCount = getCurrentCartCount();
        if (window.counterUtils && window.counterUtils.setCartCount) {
          window.counterUtils.setCartCount(Math.max(0, currentCount - 1));
          updateStatus(
            `Cart count decremented to ${Math.max(0, currentCount - 1)}`
          );
        } else {
          updateStatus("Error: counterUtils not available");
        }
      });

    document
      .getElementById("refresh-cart")
      .addEventListener("click", function () {
        if (window.counterUtils && window.counterUtils.refreshCounters) {
          window.counterUtils.refreshCounters();
          updateStatus("Counters refreshed from server");
        } else {
          updateStatus("Error: counterUtils not available");
        }
      });

    // Wishlist counter buttons
    document
      .getElementById("increment-wishlist")
      .addEventListener("click", function () {
        const currentCount = getCurrentWishlistCount();
        if (window.counterUtils && window.counterUtils.setWishlistCount) {
          window.counterUtils.setWishlistCount(currentCount + 1);
          updateStatus(`Wishlist count incremented to ${currentCount + 1}`);
        } else {
          updateStatus("Error: counterUtils not available");
        }
      });

    document
      .getElementById("decrement-wishlist")
      .addEventListener("click", function () {
        const currentCount = getCurrentWishlistCount();
        if (window.counterUtils && window.counterUtils.setWishlistCount) {
          window.counterUtils.setWishlistCount(Math.max(0, currentCount - 1));
          updateStatus(
            `Wishlist count decremented to ${Math.max(0, currentCount - 1)}`
          );
        } else {
          updateStatus("Error: counterUtils not available");
        }
      });

    document
      .getElementById("refresh-wishlist")
      .addEventListener("click", function () {
        if (window.counterUtils && window.counterUtils.refreshCounters) {
          window.counterUtils.refreshCounters();
          updateStatus("Counters refreshed from server");
        } else {
          updateStatus("Error: counterUtils not available");
        }
      });
  }

  function updateStatus(message) {
    const statusDiv = document.getElementById("counter-test-status");
    if (statusDiv) {
      statusDiv.textContent = message;
      // Flash the status to indicate an update
      statusDiv.style.backgroundColor = "#e6f7ff";
      setTimeout(() => {
        statusDiv.style.backgroundColor = "transparent";
      }, 500);
    }
  }

  function getCurrentCartCount() {
    try {
      // Try to get from local storage first
      const storedCount = localStorage.getItem("cartCount");
      if (storedCount !== null) {
        return parseInt(storedCount, 10) || 0;
      }

      // Fall back to DOM element
      const cartCounter = document.querySelector(".cart-counter");
      if (cartCounter) {
        return parseInt(cartCounter.textContent, 10) || 0;
      }

      return 0;
    } catch (e) {
      console.error("Error getting cart count:", e);
      return 0;
    }
  }

  function getCurrentWishlistCount() {
    try {
      // Try to get from local storage first
      const storedCount = localStorage.getItem("wishlistCount");
      if (storedCount !== null) {
        return parseInt(storedCount, 10) || 0;
      }

      // Fall back to DOM element
      const wishlistCounter = document.querySelector(".wishlist-counter");
      if (wishlistCounter) {
        return parseInt(wishlistCounter.textContent, 10) || 0;
      }

      return 0;
    } catch (e) {
      console.error("Error getting wishlist count:", e);
      return 0;
    }
  }

  // Add a keyboard shortcut (Ctrl+Shift+T) to show/hide the test panel
  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.shiftKey && event.key === "T") {
      const panel = document.getElementById("counter-test-panel");
      if (panel) {
        panel.remove();
      } else {
        createTestInterface();
      }
    }
  });

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      // Don't automatically show test panel, use keyboard shortcut
    });
  } else {
    // Don't automatically show test panel, use keyboard shortcut
  }

  // Expose test utility to global scope for console testing
  window.counterTestUtils = {
    showTestPanel: createTestInterface,
    hideTestPanel: function () {
      const panel = document.getElementById("counter-test-panel");
      if (panel) {
        panel.remove();
      }
    },
    getCartCount: getCurrentCartCount,
    getWishlistCount: getCurrentWishlistCount,
    runFullTest: async function () {
      console.log("Running full counter system test...");

      const results = {
        cartLocalStorage: null,
        cartDOM: null,
        wishlistLocalStorage: null,
        wishlistDOM: null,
        serverSync: null,
      };

      // Check local storage
      results.cartLocalStorage = localStorage.getItem("cartCount");
      results.wishlistLocalStorage = localStorage.getItem("wishlistCount");

      // Check DOM elements
      const cartCounter = document.querySelector(".cart-counter");
      results.cartDOM = cartCounter ? cartCounter.textContent : null;

      const wishlistCounter = document.querySelector(".wishlist-counter");
      results.wishlistDOM = wishlistCounter
        ? wishlistCounter.textContent
        : null;

      // Check server sync
      try {
        if (window.counterUtils && window.counterUtils.forceServerSync) {
          results.serverSync = await window.counterUtils.forceServerSync();
        } else {
          results.serverSync = "counterUtils.forceServerSync not available";
        }
      } catch (e) {
        results.serverSync = `Error: ${e.message}`;
      }

      console.table(results);
      return results;
    },
  };
})();
