/**
 * Wishlist Counter Script
 * This script handles updating the wishlist counter in real-time
 * Server-first approach with minimal browser storage dependency
 */

// Execute immediately
(function () {
  // Constants
  const WISHLIST_COUNT_KEY = "wishlistCount";
  const TOAST_DURATION = 3000;

  // Immediate DOM inspection - for debugging only
  console.log("WISHLIST COUNTER SCRIPT LOADED");

  // Get direct server count via API
  async function fetchWishlistCountFromServer() {
    console.log("Fetching wishlist count directly from server");

    try {
      // Try with query parameter instead of expecting JSON response
      const url = "/api/wishlist/count";
      let data = null;

      try {
        data = await safeApiCall(url, "GET");
      } catch (fetchError) {
        console.error("Error fetching from API:", fetchError);
        throw fetchError;
      }

      // Handle different response formats
      let count = 0;

      if (data) {
        if (typeof data === "number") {
          // Direct number response
          count = data;
        } else if (data && typeof data.count === "number") {
          // Object with count property
          count = data.count;
        } else if (data && data.data && typeof data.data.count === "number") {
          // Nested data.count format
          count = data.data.count;
        } else if (data && typeof data.wishlistCount === "number") {
          // Alternative property name
          count = data.wishlistCount;
        } else {
          console.warn("Server returned unexpected data format:", data);
          throw new Error("Invalid response format from server");
        }

        console.log(`Server returned wishlist count: ${count}`);
        updateWishlistCounter(count);

        // Cache the successful count
        try {
          sessionStorage.setItem(WISHLIST_COUNT_KEY, count.toString());
        } catch (e) {
          console.error("Failed to cache wishlist count:", e);
        }

        return count;
      }
    } catch (error) {
      console.error("Error fetching wishlist count from server:", error);

      // Check if we have a cached count from a previous successful request
      const cachedCount = sessionStorage.getItem(WISHLIST_COUNT_KEY);
      if (cachedCount && !error.message.includes("Session expired")) {
        console.log(`Using cached wishlist count: ${cachedCount}`);
        const count = parseInt(cachedCount);
        updateWishlistCounter(count);
        return count;
      }

      // Only use fallback if it wasn't a session timeout
      if (!error.message.includes("Session expired")) {
        // Fall back to DOM values if server fetch fails
        const domCount = getCountFromDOM();
        if (domCount > 0) {
          updateWishlistCounter(domCount);
          return domCount;
        }
      }

      // If no cached count and no DOM count, show a retry button
      const toastMessage = `
        Unable to fetch wishlist count. 
        <button class="retry-btn" onclick="window.location.reload()">
          Retry
        </button>
      `;
      showToast("Error", toastMessage, "error");

      throw error;
    }
  }

  // Update all wishlist counters in the UI
  function updateWishlistCounter(count) {
    // Ensure count is a valid number
    if (typeof count !== "number" || isNaN(count)) {
      console.error(`Invalid wishlist count: ${count}, using 0 instead`);
      count = 0;
    }

    console.log(`Updating wishlist counter to ${count}`);

    // Get all counter elements - use multiple selectors for broader coverage
    const wishlistCounters = document.querySelectorAll(
      ".wishlist-counter, [data-wishlist-count]"
    );
    const allCountElements = document.querySelectorAll(".count");

    // Track if any counters were updated successfully
    let updatedAny = false;

    // Update specific wishlist-counter elements
    if (wishlistCounters.length > 0) {
      console.log(
        `Updating ${wishlistCounters.length} dedicated wishlist counters`
      );
      wishlistCounters.forEach((el) => {
        updateSingleCounter(el, count);
        updatedAny = true;

        // Also set data attribute for potential future fallbacks
        el.setAttribute("data-wishlist-count", count.toString());
      });
    }

    // Update generic count elements inside wishlist buttons
    let genericCountersUpdated = 0;
    allCountElements.forEach((element) => {
      const parentButton = element.closest(
        ".action-btn, .wishlist-btn, .btn-wishlist"
      );
      if (
        parentButton &&
        (parentButton.querySelector('ion-icon[name="heart-outline"]') ||
          parentButton.querySelector('ion-icon[name="heart"]') ||
          parentButton.classList.contains("wishlist-btn") ||
          parentButton.classList.contains("btn-wishlist")) &&
        !element.classList.contains("wishlist-counter")
      ) {
        updateSingleCounter(element, count);
        genericCountersUpdated++;
        updatedAny = true;
      }
    });

    if (genericCountersUpdated > 0) {
      console.log(`Updated ${genericCountersUpdated} generic count elements`);
    }

    // Update tooltips
    updateWishlistTooltip(count);

    // If no counters were found or updated, create a hidden one for reference
    if (!updatedAny) {
      console.warn(
        "No wishlist counters found in the DOM, creating a reference counter"
      );
      const hiddenCounter = document.createElement("span");
      hiddenCounter.className = "wishlist-counter hidden-counter";
      hiddenCounter.style.display = "none";
      hiddenCounter.textContent = count.toString();
      hiddenCounter.setAttribute("data-wishlist-count", count.toString());
      document.body.appendChild(hiddenCounter);
    }

    // Update local reference - only for page session, no reliance on this
    try {
      sessionStorage.setItem(WISHLIST_COUNT_KEY, count.toString());
    } catch (e) {
      console.error("Failed to update session storage:", e);
    }
  }

  // Update a single counter element with animation
  function updateSingleCounter(element, count) {
    try {
      // Get current value for animation direction
      const currentValue = parseInt(element.textContent.trim() || "0");
      const isIncreasing = count > currentValue;

      // Ensure counter is visible
      element.style.display = "flex";
      element.style.visibility = "visible";
      element.style.opacity = "1";

      // Save original values for animation
      const originalClasses = element.className;
      const originalSize = {
        width: element.style.width,
        fontSize: element.style.fontSize,
      };

      // Add animation class based on direction
      if (count !== currentValue) {
        element.classList.add(
          isIncreasing ? "counter-increase" : "counter-decrease"
        );
      }

      // Update the text
      element.textContent = count;

      // Adjust size based on count digits
      if (count > 99) {
        element.style.width = "30px"; // For 3+ digits
        element.style.fontSize = "10px";
      } else if (count > 9) {
        element.style.width = "24px"; // For 2 digits
        element.style.fontSize = "11px";
      } else {
        element.style.width = count > 0 ? "22px" : "18px";
        element.style.fontSize = count > 0 ? "12px" : "10px";
      }

      // Remove animation classes after animation completes
      if (count !== currentValue) {
        setTimeout(() => {
          element.classList.remove("counter-increase", "counter-decrease");
        }, 600); // Animation duration
      }
    } catch (e) {
      // Fallback if animation fails
      console.error("Error updating counter element:", e);

      // Basic update without animation
      element.textContent = count;
      element.style.display = "flex";
      element.style.visibility = "visible";
    }
  }

  // Update wishlist tooltip text based on item count
  function updateWishlistTooltip(count) {
    const tooltips = document.querySelectorAll(".wishlist-tooltip");
    tooltips.forEach((tooltip) => {
      if (count === 0) {
        tooltip.textContent = "Wishlist Empty";
      } else if (count === 1) {
        tooltip.textContent = "View Wishlist (1 item)";
      } else {
        tooltip.textContent = `View Wishlist (${count} items)`;
      }
    });
  }

  // Show toast notification for wishlist actions
  function showToast(title, message, type = "success", autoHide = true) {
    // Check if toast container exists, create if not
    let toastContainer = document.querySelector(".toast-container");
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.className = "toast-container";
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    // Check if message contains HTML elements like retry buttons
    const hasHTML = /<[a-z][\s\S]*>/i.test(message);

    const toastContent = `
      <div class="toast-icon">
        <ion-icon name="${
          type === "success" ? "checkmark-circle" : "alert-circle"
        }"></ion-icon>
      </div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()">
        <ion-icon name="close"></ion-icon>
      </button>
    `;

    toast.innerHTML = toastContent;
    toastContainer.appendChild(toast);

    // If message has interactive HTML elements and autoHide is not explicitly set to true,
    // give the user more time to interact with them
    if (autoHide && !hasHTML) {
      // Regular toast - hide after standard duration
      setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => {
          toast.remove();
        }, 300);
      }, TOAST_DURATION);
    } else if (hasHTML) {
      // Toast with interactive elements - longer timeout
      setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => {
          toast.remove();
        }, 300);
      }, TOAST_DURATION * 3); // 3x longer for interactive toasts
    }
    // If autoHide is explicitly false, don't auto-hide the toast
  }

  // Function to load mini wishlist preview content
  async function loadMiniWishlistPreview() {
    const miniWishlistItems = document.querySelector(".mini-wishlist-items");
    if (!miniWishlistItems) return;

    // Always fetch fresh data from server
    miniWishlistItems.innerHTML =
      '<div class="mini-wishlist-loading">Loading wishlist items...</div>';

    try {
      // Fetch wishlist items from server using safeApiCall
      const data = await safeApiCall("/wishlist/mini", "GET");

      if (!data || !data.items) {
        console.warn("Server returned unexpected data format:", data);
        throw new Error("Invalid response format from server");
      }

      renderMiniWishlist(data.items || []);

      // Update counter with server data
      if (data.count !== undefined) {
        updateWishlistCounter(data.count);

        // Cache the count
        try {
          sessionStorage.setItem(WISHLIST_COUNT_KEY, data.count.toString());
        } catch (e) {
          console.error("Failed to cache wishlist count:", e);
        }
      }
    } catch (error) {
      if (error.message.includes("Session expired")) {
        miniWishlistItems.innerHTML =
          '<div class="mini-wishlist-error">Session expired. Please <a href="/login">log in again</a>.</div>';
      } else {
        miniWishlistItems.innerHTML = `
          <div class="mini-wishlist-error">
            Failed to load wishlist items
            <button class="retry-btn" onclick="loadMiniWishlistPreview()">Retry</button>
          </div>`;
        console.error("Error loading wishlist:", error);
      }
    }
  }

  // Render mini wishlist content
  function renderMiniWishlist(items) {
    const miniWishlistItems = document.querySelector(".mini-wishlist-items");
    if (!miniWishlistItems) return;

    if (items && items.length > 0) {
      // Wishlist has items
      let html = "";
      items.forEach((item) => {
        const imageUrl = item.imageUrl || item.image || "";
        html += `
          <div class="mini-wishlist-item">
            <img src="${imageUrl}" alt="${
          item.name
        }" class="mini-wishlist-item-img">
            <div class="mini-wishlist-item-details">
              <h5 class="mini-wishlist-item-title">${item.name}</h5>
              <p class="mini-wishlist-item-price">${
                item.price || item.salePrice || ""
              }</p>
            </div>
            <button class="mini-wishlist-item-remove" onclick="removeFromWishlist(${
              item.id
            })">×</button>
          </div>
        `;
      });

      miniWishlistItems.innerHTML = html;
    } else {
      // Wishlist is empty
      miniWishlistItems.innerHTML =
        '<div class="mini-wishlist-empty">Your wishlist is empty</div>';
    }
  }

  // No longer needed - replaced by fetchWishlistCountFromServer

  // Get count from DOM elements - fallback method
  function getCountFromDOM() {
    let maxCount = 0;

    console.log("Looking for wishlist count in DOM elements as fallback");

    // Find all wishlist counters in the DOM (try multiple selector patterns)
    const selectors = [
      ".wishlist-counter",
      ".wishlist-btn .count",
      ".wishlist-count",
      ".action-btn .count",
      "[data-wishlist-count]",
    ];

    // Try each selector to find a valid count
    selectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      console.log(`Found ${elements.length} elements matching "${selector}"`);

      elements.forEach((counter) => {
        // Get count from text content
        let count = 0;
        if (counter.hasAttribute("data-wishlist-count")) {
          count = parseInt(counter.getAttribute("data-wishlist-count"));
        } else {
          const countText = counter.textContent.trim();
          count = parseInt(countText);
        }

        // Validate and use the highest count found
        if (!isNaN(count) && count > maxCount) {
          console.log(`Found valid count: ${count} in element`, counter);
          maxCount = count;
        }
      });
    });

    console.log(`Final count from DOM elements: ${maxCount}`);
    return maxCount;
  }

  // Set up event listeners for wishlist updates
  function setupWishlistEventListeners() {
    // Listen for wishlist:updated events from wishlist-storage.js
    document.addEventListener("wishlist:updated", function (e) {
      const count = e.detail.count || 0;
      updateWishlistCounter(count);

      // Show toast notification if action is specified
      if (e.detail.action) {
        if (e.detail.action === "add") {
          showToast("Success", "Item added to wishlist", "success");
        } else if (e.detail.action === "remove") {
          showToast("Success", "Item removed from wishlist", "success");
        }

        // Clear cache and reload mini wishlist if it's open
        clearWishlistCache();
      }
    });

    // Listen for storage events (for cross-tab synchronization)
    window.addEventListener("storage", function (e) {
      if (e.key === "ecommerce_wishlist") {
        try {
          const wishlistData = JSON.parse(e.newValue);
          const count = wishlistData.count || 0;
          updateWishlistCounter(count);
          clearWishlistCache();
        } catch (e) {
          console.error("Error processing wishlist storage event:", e);
        }
      }

      // Also listen for direct wishlistCount updates
      if (e.key === WISHLIST_COUNT_KEY) {
        const count = parseInt(e.newValue || "0");
        if (!isNaN(count)) {
          updateWishlistCounter(count);
        }
      }

      // Listen for mini wishlist cache clearing
      if (e.key === "miniWishlistLastLoad" && e.newValue === null) {
        loadMiniWishlistPreview();
      }
    });

    // Listen for wishlist button clicks
    document.addEventListener("click", function (event) {
      const wishlistBtn = event.target.closest(
        ".wishlist-toggle, .product-wishlist-btn, .add-to-wishlist-btn, .btn-action, [data-wishlist-toggle]"
      );

      // Check if it's a wishlist button by examining various indicators
      if (
        wishlistBtn &&
        (wishlistBtn.classList.contains("wishlist-toggle") ||
          wishlistBtn.classList.contains("product-wishlist-btn") ||
          wishlistBtn.classList.contains("add-to-wishlist-btn") ||
          wishlistBtn.hasAttribute("data-wishlist-toggle") ||
          (wishlistBtn.getAttribute("onclick") &&
            wishlistBtn.getAttribute("onclick").includes("wishlist")))
      ) {
        // Small delay to allow wishlist storage to update first
        setTimeout(() => {
          initializeWishlistCounter();
          clearWishlistCache();
        }, 100);
      }
    });

    // Handle wishlist hover events to load mini preview
    const wishlistBtns = document.querySelectorAll(".wishlist-btn");
    wishlistBtns.forEach((btn) => {
      btn.addEventListener("mouseenter", function () {
        loadMiniWishlistPreview();
      });
    });
  }

  // No longer needed - we don't cache mini wishlist anymore

  // Handle session timeout
  function handleSessionTimeout() {
    // Clear session-related data
    localStorage.removeItem(WISHLIST_COUNT_KEY);
    sessionStorage.removeItem(WISHLIST_COUNT_KEY);
    localStorage.removeItem("ecommerce_wishlist");

    // Log the timeout event
    console.log("Session timeout detected in wishlist system");

    // Reset wishlist counter to 0 in UI
    updateWishlistCounter(0);

    // Don't interrupt user flow with a modal on every page
    // Instead, show a non-modal toast with login option
    const currentPage = window.location.pathname;

    // Only show modal on wishlist-specific pages where action is critical
    if (currentPage.includes("/wishlist")) {
      // Show modal asking user to login again
      const confirmLogin = confirm(
        "Your session has expired. Would you like to log in again?"
      );

      if (confirmLogin) {
        // Redirect to login page with return URL
        window.location.href = `/login?redirect=${encodeURIComponent(
          currentPage
        )}`;
      }
    } else {
      // On other pages, just show a toast notification
      const loginUrl = `/login?redirect=${encodeURIComponent(currentPage)}`;
      const message = `Your session has expired. <a href="${loginUrl}" class="toast-link">Log in again</a>`;
      showToast("Session Expired", message, "error", false);
    }
  }

  // Enhanced API request handler with proper error handling
  async function safeApiCall(url, method = "GET", body = null, retryCount = 0) {
    try {
      // CSRF protection removed

      console.log(`Making ${method} request to ${url}`);

      // For GET requests, consider using URL parameters instead of JSON body
      let requestUrl = url;
      if (method === "GET" && body) {
        // Convert body to URL parameters
        const params = new URLSearchParams();
        Object.entries(body).forEach(([key, value]) => {
          params.append(key, value);
        });
        requestUrl = `${url}?${params.toString()}`;
        body = null; // No need for body in GET request
      }

      // Log detailed request information for debugging
      console.group(`API Request: ${requestUrl}`);
      console.log(`Method: ${method}`);
      if (body) console.log("Request body:", body);
      console.groupEnd();

      const response = await fetch(requestUrl, {
        method: method,
        headers: {
          ...(body ? { "Content-Type": "application/json" } : {}),
          // CSRF protection removed
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
        credentials: "same-origin",
      });

      // Check if response is OK
      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`);

        // Handle specific status codes
        if (response.status === 401 || response.status === 403) {
          handleSessionTimeout();
          throw new Error("Session expired");
        }

        // For 5xx errors, we might want to retry
        if (response.status >= 500 && response.status < 600) {
          if (retryCount < 2) {
            console.log(`Server error (${response.status}). Will retry...`);
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve(safeApiCall(url, method, body, retryCount + 1));
              }, 1000 * (retryCount + 1)); // Increasing backoff
            });
          }
        }

        throw new Error(`API Error: ${response.status}`);
      }

      // Check if response is JSON by actually trying to parse it first
      // This is more reliable than checking content-type
      try {
        const clonedResponse = response.clone(); // Clone to avoid consuming the original
        const data = await clonedResponse.json();
        return data;
      } catch (jsonError) {
        console.error("Failed to parse response as JSON:", jsonError);

        // Try to get text to see what was returned
        const text = await response.text();
        console.error(
          "Response was not valid JSON:",
          text.substring(0, 150) + (text.length > 150 ? "..." : "")
        );

        // Check if HTML response (session timeout)
        if (text.includes("<!DOCTYPE") || text.includes("<html")) {
          console.warn(
            "Received HTML instead of JSON - likely session timeout"
          );
          handleSessionTimeout();
          throw new Error("Session expired");
        }

        // Try to convert to JSON as a fallback for malformed responses
        try {
          // In case the server sends JSON with wrong content-type
          const data = JSON.parse(text);
          console.log("Parsed text as JSON successfully:", data);
          return data;
        } catch (e) {
          // Truly not JSON
          throw new Error("Server returned non-JSON response");
        }
      }
    } catch (error) {
      console.error("API call failed:", error);

      // Enhanced retry logic
      const shouldRetry =
        retryCount < 2 &&
        (error.message.includes("NetworkError") ||
          error.message.includes("API Error: 5") ||
          error.message.includes("Failed to fetch") ||
          error.message.includes("NetworkError") ||
          error.message.includes("network") ||
          error.message.includes("timeout") ||
          error.name === "TypeError");

      if (shouldRetry) {
        const retryDelay = 1000 * Math.pow(2, retryCount); // Exponential backoff
        console.log(
          `Retrying API call (${retryCount + 1}/2) after ${retryDelay}ms...`
        );
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(safeApiCall(url, method, body, retryCount + 1));
          }, retryDelay);
        });
      }

      throw error;
    }
  }

  // Function to remove item from wishlist
  async function removeFromWishlist(productId) {
    try {
      // Server-side removal using URL parameters instead of JSON body
      const data = await safeApiCall(
        `/wishlist/remove?productId=${encodeURIComponent(productId)}`,
        "POST"
      );

      // Update counter and UI
      updateWishlistCounter(data.wishlistCount || 0);
      showToast("Success", "Item removed from wishlist", "success");

      // Reload mini wishlist
      loadMiniWishlistPreview();
    } catch (error) {
      console.error("Error removing from wishlist:", error);

      // Create toast with helpful retry button
      const toastMessage = `
        Failed to remove item from wishlist. 
        <button class="retry-btn" onclick="removeFromWishlist(${productId})">
          Retry
        </button>
      `;
      showToast("Error", toastMessage, "error", false);

      // Only refresh count from server if it wasn't a session timeout
      if (!error.message.includes("Session expired")) {
        fetchWishlistCountFromServer();
      }
    }
  }

  // No longer needed - all operations are server-side

  // No longer needed - we don't rely on cross-tab sync via localStorage

  // No longer needed - simplified approach uses server data  // Set up event listeners for wishlist updates
  function setupWishlistEventListeners() {
    // Listen for wishlist button clicks
    document.addEventListener("click", function (event) {
      const wishlistBtn = event.target.closest(
        ".wishlist-toggle, .product-wishlist-btn, .add-to-wishlist-btn, .btn-action, [data-wishlist-toggle]"
      );

      // Check if it's a wishlist button
      if (
        wishlistBtn &&
        (wishlistBtn.classList.contains("wishlist-toggle") ||
          wishlistBtn.classList.contains("product-wishlist-btn") ||
          wishlistBtn.classList.contains("add-to-wishlist-btn") ||
          wishlistBtn.hasAttribute("data-wishlist-toggle") ||
          (wishlistBtn.getAttribute("onclick") &&
            wishlistBtn.getAttribute("onclick").includes("wishlist")))
      ) {
        // Small delay to allow server to process
        setTimeout(() => {
          // Fetch fresh count from server
          fetchWishlistCountFromServer();
        }, 300);
      }
    });

    // Handle wishlist hover events to load mini preview
    const wishlistBtns = document.querySelectorAll(".wishlist-btn");
    wishlistBtns.forEach((btn) => {
      btn.addEventListener("mouseenter", function () {
        loadMiniWishlistPreview();
      });
    });
  }

  // Main initialization
  function initialize() {
    console.log("Initializing wishlist counter system");

    // First, try to get any cached count to show immediately
    try {
      const cachedCount = sessionStorage.getItem(WISHLIST_COUNT_KEY);
      if (cachedCount) {
        const count = parseInt(cachedCount);
        console.log(`Using cached wishlist count: ${count}`);
        updateWishlistCounter(count);
      }
    } catch (e) {
      console.error("Error reading cached count:", e);
    }

    // Set up all event listeners first
    setupWishlistEventListeners();

    // Then, fetch fresh count from server with retry logic
    let retryAttempt = 0;
    const maxRetries = 3;

    function fetchWithRetry() {
      fetchWishlistCountFromServer().catch((error) => {
        if (error.message.includes("Session expired")) {
          // Don't retry on session timeout
          return;
        }

        if (retryAttempt < maxRetries) {
          retryAttempt++;
          console.log(
            `Retrying wishlist count fetch (${retryAttempt}/${maxRetries})...`
          );

          // Exponential backoff
          setTimeout(fetchWithRetry, 1000 * Math.pow(2, retryAttempt));
        } else {
          console.warn("Max retries reached for wishlist count");

          // Fall back to DOM values as last resort
          const domCount = getCountFromDOM();
          if (domCount > 0) {
            updateWishlistCounter(domCount);
          }
        }
      });
    }

    // Start the fetch process
    fetchWithRetry();

    // Preload mini wishlist with slight delay to prioritize counter
    setTimeout(loadMiniWishlistPreview, 1500);

    // Set up periodic refresh of wishlist count (every 5 minutes)
    setInterval(() => {
      if (document.visibilityState === "visible") {
        console.log("Performing periodic wishlist count refresh");
        fetchWishlistCountFromServer().catch(() => {}); // Silent failure
      }
    }, 5 * 60 * 1000); // 5 minutes
  }

  // Run when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }

  // Run when tab becomes visible
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") {
      console.log("Tab became visible, refreshing wishlist count");
      fetchWishlistCountFromServer().catch((error) => {
        // Silent catch, just log
        console.log(
          "Error refreshing wishlist count on visibility change:",
          error.message
        );
      });
    }
  });

  // Make functions globally available
  window.removeFromWishlist = removeFromWishlist;
  window.updateWishlistCounter = updateWishlistCounter;
  window.fetchWishlistCountFromServer = fetchWishlistCountFromServer;

  // Add handler for network reconnection
  window.addEventListener("online", function () {
    console.log("Network connection restored, refreshing wishlist count");
    fetchWishlistCountFromServer().catch(() => {}); // Silent failure
  });

  // Log successful initialization
  console.log("Wishlist counter system initialized successfully");
})();
