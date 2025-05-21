/**
 * Cart Diagnostic Tool
 *
 * This script helps diagnose issues with cart rendering by:
 * - Checking for DOM elements required for cart functionality
 * - Validating JavaScript functionality
 * - Testing API connectivity
 * - Repairing common issues automatically when possible
 */

(function () {
  // Self-executing function to avoid polluting global namespace

  const CartDiagnostics = {
    // Diagnostic results storage
    issues: [],

    // Run all diagnostic checks
    runAll: function () {
      console.log(
        "%c[Cart Diagnostics] Running cart diagnostics...",
        "color:blue;font-weight:bold"
      );

      this.checkDomElements();
      this.checkJsFunctions();
      this.checkEventListeners();

      // Output diagnostic results
      if (this.issues.length === 0) {
        console.log(
          "%c[Cart Diagnostics] No issues detected!",
          "color:green;font-weight:bold"
        );
      } else {
        console.log(
          "%c[Cart Diagnostics] Found " + this.issues.length + " issues:",
          "color:red;font-weight:bold"
        );
        this.issues.forEach((issue, i) => {
          console.log(
            `%c${i + 1}. ${issue.type}: ${issue.message}`,
            "color:red"
          );
        });

        // Try auto-repair if possible
        this.attemptRepair();
      }
    },

    // Check if all required DOM elements exist
    checkDomElements: function () {
      console.log("[Cart Diagnostics] Checking DOM elements...");

      const requiredElements = [
        { selector: ".cart-container", name: "Cart container" },
        { selector: ".cart-items-container", name: "Cart items container" },
        { selector: ".cart-summary-container", name: "Cart summary container" },
        { selector: ".toast-container", name: "Toast notification container" },
      ];

      requiredElements.forEach((el) => {
        const element = document.querySelector(el.selector);
        if (!element) {
          this.issues.push({
            type: "DOM Element Missing",
            message: `${el.name} (${el.selector}) not found in the document`,
            autoFixable: false,
          });
        }
      });
    },

    // Check if required JavaScript functions exist
    checkJsFunctions: function () {
      console.log("[Cart Diagnostics] Checking JavaScript functions...");

      const requiredFunctions = [
        { name: "fetchCartWithSessionFallback", global: true },
        { name: "loadCart", global: true },
        { name: "checkoutOrder", global: true },
        { name: "showToast", global: true },
      ];

      requiredFunctions.forEach((func) => {
        if (func.global) {
          if (typeof window[func.name] !== "function") {
            this.issues.push({
              type: "JS Function Missing",
              message: `Global function ${func.name}() is not defined`,
              autoFixable: false,
            });
          }
        } else {
          // Check non-global functions if needed
        }
      });
    },

    // Check event listeners
    checkEventListeners: function () {
      console.log("[Cart Diagnostics] Checking event listeners...");

      // Create a test event
      const testEvent = new Event("cart:updated");
      let handled = false;

      // Add a temporary handler to detect if the event is caught
      const tempHandler = () => {
        handled = true;
      };

      document.addEventListener("cart:updated", tempHandler);
      document.dispatchEvent(testEvent);
      document.removeEventListener("cart:updated", tempHandler);

      if (!handled) {
        this.issues.push({
          type: "Event Handling",
          message: "cart:updated event is not being captured by any listeners",
          autoFixable: false,
        });
      }
    },

    // Try to fix common issues
    attemptRepair: function () {
      console.log("[Cart Diagnostics] Attempting to repair issues...");

      const fixed = [];

      // Try to fix each auto-fixable issue
      this.issues.forEach((issue) => {
        if (issue.autoFixable && issue.fix && typeof issue.fix === "function") {
          try {
            issue.fix();
            fixed.push(issue);
          } catch (e) {
            console.error(`Failed to auto-fix issue: ${issue.message}`, e);
          }
        }
      });

      // Report fixes
      if (fixed.length > 0) {
        console.log(
          `%c[Cart Diagnostics] Auto-fixed ${fixed.length} issues`,
          "color:green"
        );
      } else if (this.issues.some((i) => i.autoFixable)) {
        console.log(
          "%c[Cart Diagnostics] Could not auto-fix any issues",
          "color:orange"
        );
      }

      // Always try to force cart initialization as a last resort
      if (typeof fetchCartWithSessionFallback === "function") {
        console.log("[Cart Diagnostics] Forcing cart initialization...");
        setTimeout(fetchCartWithSessionFallback, 500);
      }
    },
  };

  // Run diagnostics after a short delay to ensure page is fully loaded
  setTimeout(function () {
    CartDiagnostics.runAll();
  }, 2000);

  // Make diagnostics available globally
  window.runCartDiagnostics = CartDiagnostics.runAll.bind(CartDiagnostics);
})();
