/**
 * Cart Counter Visibility Script
 * This script ensures cart counters are always visible
 */

// Execute immediately
(function () {
  // Force all counters to be visible
  const forceAllCountersVisible = function () {
    // Target both generic .count and specific .cart-counter classes
    const counters = document.querySelectorAll(".count, .cart-counter");

    if (counters.length === 0) {
      return;
    }

    counters.forEach((counter) => {
      // Apply visibility styling
      const styles = {
        display: "flex",
        visibility: "visible",
        opacity: "1",
        "z-index": "100",
        position: "absolute",
        "background-color": "var(--coffee-accent)",
        color: "white",
        "border-radius": "50%",
        "min-width": "20px",
        height: "20px",
        "align-items": "center",
        "justify-content": "center",
        "font-weight": "bold",
      };

      // Apply all styles
      Object.keys(styles).forEach((prop) => {
        counter.style.setProperty(prop, styles[prop]);
      });

      // Set specific position based on parent
      const parent = counter.closest(".cart-btn, .action-btn");
      if (parent) {
        // Check if in mobile navigation
        if (parent.closest(".mobile-bottom-navigation")) {
          counter.style.top = "-5px";
          counter.style.right = "-5px";
          counter.style.fontSize = "10px";
        } else {
          counter.style.top = "-8px";
          counter.style.right = "-8px";
          counter.style.fontSize = "12px";
        }
      }
    });
  };

  // Execute immediately
  forceAllCountersVisible();

  // Execute after slight delay to overcome race conditions
  setTimeout(forceAllCountersVisible, 100);
  setTimeout(forceAllCountersVisible, 500);

  // Set up mutation observer to watch for DOM changes
  const setupMutationObserver = function () {
    const observer = new MutationObserver(function () {
      forceAllCountersVisible();
    });

    // Observe the entire document for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });
  };

  // Set up observer when DOM is loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupMutationObserver);
  } else {
    setupMutationObserver();
  }

  // Handle window load event
  window.addEventListener("load", forceAllCountersVisible);

  // Handle visibility changes
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") {
      setTimeout(forceAllCountersVisible, 100);
    }
  });
})();
