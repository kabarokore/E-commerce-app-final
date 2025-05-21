/**
 * Modal System for The Daily Grind E-commerce Website
 * Production Version: 1.0.0
 *
 * This script handles all modal functionality including opening, closing,
 * and loading product content within modals.
 * Now uses centralized configuration from app-config.js
 */

(function () {
  // Wait for DOM to be ready before initializing
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    // Get configuration values
    const config = window.APP_CONFIG
      ? window.APP_CONFIG.modal
      : {
          zIndex: { overlay: 999999, content: 1000000 },
          styles: {
            overlayBackground: "rgba(0, 0, 0, 0.5)",
            contentMargin: "5% auto",
          },
          features: {
            enableAnimation: true,
            enableKeyboardNavigation: true,
            closeOnBackgroundClick: true,
          },
        };

    // Browser compatibility check
    const browserCompatible = checkBrowserCompatibility();
    if (!browserCompatible) {
      // Use fallback modal functionality for older browsers
      applyFallbackStyling();
    }

    // Get reference to all modals
    const modals = document.querySelectorAll(".modal");

    // Apply consistent modal styling to ensure proper display
    modals.forEach((modal) => {
      try {
        // Ensure modals have proper styling for visibility
        modal.style.cssText = `
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          z-index: ${config.zIndex.overlay} !important;
          background-color: ${config.styles.overlayBackground} !important;
          display: none;
        `;

        // Fix the modal content
        const modalContent = modal.querySelector(".modal-content");
        if (modalContent) {
          modalContent.style.cssText = `
            position: relative !important;
            z-index: ${config.zIndex.content} !important;
            margin: ${config.styles.contentMargin} !important;
          `;
        }

        // Fix close buttons
        const closeButtons = modal.querySelectorAll(".close-modal");
        closeButtons.forEach((button) => {
          button.style.cssText = `
            position: absolute !important;
            top: 15px !important;
            right: 20px !important;
            font-size: 28px !important;
            cursor: pointer !important;
          `;

          // Ensure click handler works properly
          button.onclick = function (e) {
            e.preventDefault();
            e.stopPropagation();
            closeModal(modal.id);
            return false;
          };
        });
      } catch (err) {
        // Apply minimal fallback styling if error occurs
        applyFallbackStyling(modal);
      }
    });

    // Define openCategoryModal function
    window.openCategoryModal = function (category) {
      try {
        // Prevent default behavior and propagation
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }

        const modalId = `${category}-modal`;
        const modal = document.getElementById(modalId);

        if (!modal) {
          return false;
        }

        // Close any open modals first
        document.querySelectorAll(".modal").forEach((m) => {
          m.style.display = "none";
        });

        // Show this modal with proper styling
        modal.style.display = "block";
        document.body.style.overflow = "hidden"; // Prevent scrolling

        // Add event listeners for closing
        setupModalCloseHandlers(modal);

        // Load products for this category
        if (window.loadProductsForCategory) {
          window.loadProductsForCategory(category, modal);
        }
      } catch (err) {
        // Silently handle errors in production
      }

      return false;
    };

    // Define closeModal function
    window.closeModal = function (modalId) {
      try {
        const modal =
          typeof modalId === "string"
            ? document.getElementById(modalId)
            : modalId;

        if (!modal) {
          return;
        }

        // Hide modal
        modal.style.display = "none";

        // Re-enable scrolling
        document.body.style.overflow = "auto";
      } catch (err) {
        // Fallback: try to hide all modals on error
        document.querySelectorAll(".modal").forEach((m) => {
          m.style.display = "none";
        });
        document.body.style.overflow = "auto";
      }
    };

    // Setup consistent close handlers
    function setupModalCloseHandlers(modal) {
      try {
        // Close when clicking outside
        window.onclick = function (event) {
          if (event.target === modal) {
            closeModal(modal);
          }
        };

        // Close when pressing Escape
        document.onkeydown = function (event) {
          if (event.key === "Escape" || event.keyCode === 27) {
            closeModal(modal);
          }
        };
      } catch (err) {
        // Silently handle errors in production
      }
    }

    // Fix all category buttons to use our enhanced function
    const categoryButtons = document.querySelectorAll(".category-btn");
    categoryButtons.forEach((button) => {
      try {
        // Extract the category from the onclick attribute
        const onclickAttr = button.getAttribute("onclick");
        if (onclickAttr) {
          const match = /openCategoryModal\(['"]([^'"]+)['"]\)/.exec(
            onclickAttr
          );
          if (match && match[1]) {
            const category = match[1];

            // Replace with our enhanced function
            button.onclick = function (e) {
              e.preventDefault();
              e.stopPropagation();
              openCategoryModal(category);
              return false;
            };

            // Also add an href attribute if missing
            if (
              !button.getAttribute("href") ||
              button.getAttribute("href") === "#"
            ) {
              button.setAttribute("href", "javascript:void(0);");
            }
          }
        }
      } catch (err) {
        // Silently handle errors in production
      }
    });

    // Helper function to create a product card
    window.createProductCard = function (product) {
      try {
        return `
          <div class="modal-product">
            <img src="${product.image}" alt="${product.name}">
            <h3 class="modal-product-title">${product.name}</h3>
            <div class="modal-product-price">
              <span class="price">${product.price}</span>
              ${product.oldPrice ? `<del>${product.oldPrice}</del>` : ""}
            </div>
            <div class="modal-product-actions">
              <button class="modal-product-btn" data-cart-action="add" data-product-id="${
                product.id
              }">Add to Cart</button>
              <button class="modal-product-btn wishlist" onclick="addToWishlist(${
                product.id
              })">♡</button>
            </div>
          </div>
        `;
      } catch (err) {
        return `<div class="modal-product">Error loading product</div>`;
      }
    };

    // Fallback product loading function
    window.loadProductsForCategory = function (category, modal) {
      try {
        const productsContainer = modal.querySelector(".modal-products");
        if (!productsContainer) return;

        // Sample products by category
        const productsByCategory = {
          "coffee-beans": [
            {
              id: 101,
              name: "Ethiopian Yirgacheffe Light Roast",
              price: "$18.99",
              oldPrice: "$22.99",
              image:
                "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?q=80&w=1374&auto=format&fit=crop",
            },
            {
              id: 102,
              name: "Colombian Supremo Medium Roast",
              price: "$16.99",
              image:
                "https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=1372&auto=format&fit=crop",
            },
            {
              id: 103,
              name: "Sumatra Dark Roast",
              price: "$17.99",
              oldPrice: "$20.99",
              image:
                "https://images.unsplash.com/photo-1610889556528-9a770e32642f?q=80&w=1480&auto=format&fit=crop",
            },
          ],
          "brewing-equipment": [
            {
              id: 201,
              name: "French Press Coffee Maker (34oz)",
              price: "$28.99",
              oldPrice: "$36.00",
              image:
                "https://images.unsplash.com/photo-1708127368781-cd5f069a90a5?w=400&auto=format&fit=crop",
            },
            {
              id: 202,
              name: "Pour-Over Coffee Dripper",
              price: "$24.99",
              image:
                "https://images.unsplash.com/photo-1572119752777-8a333c0f71c8?q=80&w=1374&auto=format&fit=crop",
            },
            {
              id: 203,
              name: "Professional Espresso Machine",
              price: "$349.99",
              oldPrice: "$399.99",
              image:
                "https://images.unsplash.com/photo-1516586182423-6be57e032b32?q=80&w=1376&auto=format&fit=crop",
            },
          ],
          "mugs-tumblers": [
            {
              id: 301,
              name: "Ceramic Mug Set (4-piece)",
              price: "$24.99",
              oldPrice: "$32.00",
              image:
                "https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=1470&auto=format&fit=crop",
            },
            {
              id: 302,
              name: "Double-Wall Insulated Tumbler",
              price: "$19.99",
              image:
                "https://images.unsplash.com/photo-1577937927133-66c7487a6def?q=80&w=1374&auto=format&fit=crop",
            },
            {
              id: 303,
              name: "Travel Coffee Mug",
              price: "$22.99",
              oldPrice: "$26.99",
              image:
                "https://images.unsplash.com/photo-1621263764928-df1444c5e859?q=80&w=1374&auto=format&fit=crop",
            },
          ],
          "subscription-boxes": [
            {
              id: 401,
              name: "Monthly Coffee Explorer Box",
              price: "$29.99",
              oldPrice: "$35.00",
              image:
                "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=1471&auto=format&fit=crop",
            },
            {
              id: 402,
              name: "Coffee & Snacks Subscription",
              price: "$39.99",
              image:
                "https://images.unsplash.com/photo-1516231415037-55ab6d3bddd4?q=80&w=1376&auto=format&fit=crop",
            },
            {
              id: 403,
              name: "Premium Barista Selection Box",
              price: "$49.99",
              oldPrice: "$59.99",
              image:
                "https://images.unsplash.com/photo-1621265853434-8847d308bc3e?q=80&w=1374&auto=format&fit=crop",
            },
          ],
        };

        // Get products for the selected category
        const products = productsByCategory[category] || [];

        // Show loading animation
        productsContainer.innerHTML =
          '<div class="modal-loading"><div class="spinner"></div></div>';

        // Simulate loading delay
        setTimeout(() => {
          let productsHTML = "";
          if (products.length) {
            products.forEach((product) => {
              productsHTML += createProductCard(product);
            });
          } else {
            productsHTML =
              '<p class="no-products">No products found in this category.</p>';
          }
          productsContainer.innerHTML = productsHTML;
        }, 500);
      } catch (err) {
        // Display error message in container
        try {
          const productsContainer = modal.querySelector(".modal-products");
          if (productsContainer) {
            productsContainer.innerHTML = `
              <div class="modal-error">
                <p>Sorry, we couldn't load the products at this time.</p>
                <button onclick="window.loadProductsForCategory('${category}', document.getElementById('${category}-modal'))">
                  Try Again
                </button>
              </div>
            `;
          }
        } catch (innerErr) {
          // Silently handle nested errors
        }
      }
    };

    // Check browser compatibility
    function checkBrowserCompatibility() {
      try {
        // Check for CSS Grid support (basic modern browser capability check)
        const gridSupport =
          window.CSS &&
          window.CSS.supports &&
          (window.CSS.supports("display", "grid") ||
            window.CSS.supports("display", "-ms-grid"));

        // Check for ES6 features
        const es6Support = (function () {
          try {
            new Function("(a = 0) => a");
            return true;
          } catch (e) {
            return false;
          }
        })();

        return gridSupport && es6Support;
      } catch (err) {
        return false;
      }
    }

    // Apply fallback styling for older browsers
    function applyFallbackStyling(modal) {
      try {
        if (modal) {
          // Basic styling with maximum compatibility for specific modal
          modal.style.position = "fixed";
          modal.style.top = "0";
          modal.style.left = "0";
          modal.style.width = "100%";
          modal.style.height = "100%";
          modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
          modal.style.display = "none";
          modal.style.zIndex = "9999";

          const content = modal.querySelector(".modal-content");
          if (content) {
            content.style.position = "relative";
            content.style.backgroundColor = "#fff";
            content.style.width = "80%";
            content.style.maxWidth = "900px";
            content.style.margin = "50px auto";
            content.style.padding = "20px";
          }

          const closeBtn = modal.querySelector(".close-modal");
          if (closeBtn) {
            closeBtn.style.position = "absolute";
            closeBtn.style.right = "10px";
            closeBtn.style.top = "10px";
            closeBtn.style.fontSize = "24px";
            closeBtn.style.cursor = "pointer";

            // Use old-style event handler for maximum compatibility
            closeBtn.onclick = function () {
              modal.style.display = "none";
              document.body.style.overflow = "auto";
              return false;
            };
          }
        } else {
          // Apply to all modals if no specific modal provided
          document.querySelectorAll(".modal").forEach((m) => {
            applyFallbackStyling(m);
          });
        }
      } catch (err) {
        // Silently handle errors in production
      }
    }
  });
})();
