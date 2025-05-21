/**
 * Debug Utilities for the Coffee Shop e-commerce platform
 * This file provides utility functions for debugging in the browser.
 */
class DebugUtils {
  constructor(options = {}) {
    this.enabled = options.enabled !== undefined ? options.enabled : true;
    this.serverLogging =
      options.serverLogging !== undefined ? options.serverLogging : true;
    this.prefix = options.prefix || "CoffeeShop";
    this.levelColors = {
      error:
        "background: #f44336; color: white; padding: 2px 4px; border-radius: 2px;",
      warn: "background: #ff9800; color: white; padding: 2px 4px; border-radius: 2px;",
      info: "background: #2196f3; color: white; padding: 2px 4px; border-radius: 2px;",
      debug:
        "background: #4caf50; color: white; padding: 2px 4px; border-radius: 2px;",
    };

    // Initialize
    this.checkDebugStatus();
  }

  /**
   * Check if debug mode is enabled on the server
   */
  async checkDebugStatus() {
    try {
      const response = await fetch("/api/debug/status");
      if (response.ok) {
        const data = await response.json();
        this.serverEnabled = data.debugEnabled;

        this.info("Debug initialized", {
          clientDebug: this.enabled,
          serverDebug: this.serverEnabled,
        });
      }
    } catch (error) {
      this.serverEnabled = false;
      this.error("Failed to check debug status", error);
    }
  }

  /**
   * Log a message to the console
   * @param {string} level - Log level (error, warn, info, debug)
   * @param {string} message - Message to log
   * @param {any} data - Optional data to log
   * @param {boolean} serverLog - Whether to also log to the server
   */
  log(level, message, data = null, serverLog = this.serverLogging) {
    if (!this.enabled) return;

    // Client-side console logging
    const style = this.levelColors[level] || "";
    if (data) {
      console[level](`%c${this.prefix}`, style, message, data);
    } else {
      console[level](`%c${this.prefix}`, style, message);
    }

    // Server-side logging (if enabled and server debugging is active)
    if (serverLog && this.serverEnabled) {
      this.sendLogToServer(level, message, data);
    }
  }

  /**
   * Send a log to the server
   * @param {string} level - Log level
   * @param {string} message - Message to log
   * @param {any} data - Data to log
   */
  async sendLogToServer(level, message, data) {
    try {
      await fetch("/api/debug/log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // CSRF protection removed
        },
        body: JSON.stringify({ level, message, data }),
      });
    } catch (error) {
      console.error("Failed to send log to server", error);
    }
  }

  /**
   * Log an error message
   * @param {string} message - Message to log
   * @param {any} data - Optional data to log
   */
  error(message, data = null) {
    this.log("error", message, data);
  }

  /**
   * Log a warning message
   * @param {string} message - Message to log
   * @param {any} data - Optional data to log
   */
  warn(message, data = null) {
    this.log("warn", message, data);
  }

  /**
   * Log an info message
   * @param {string} message - Message to log
   * @param {any} data - Optional data to log
   */
  info(message, data = null) {
    this.log("info", message, data);
  }

  /**
   * Log a debug message
   * @param {string} message - Message to log
   * @param {any} data - Optional data to log
   */
  debug(message, data = null) {
    this.log("debug", message, data);
  }

  /**
   * Get session debug information
   * @returns {Promise<object>} Session debug information
   */
  async getSessionDebug() {
    if (!this.enabled || !this.serverEnabled) return null;

    try {
      const response = await fetch("/api/debug/session");
      if (response.ok) {
        const data = await response.json();
        this.debug("Session debug info", data);
        return data;
      }
    } catch (error) {
      this.error("Failed to get session debug info", error);
    }

    return null;
  }
}

// Create global debug utils instance
const debugUtils = new DebugUtils({
  enabled: true,
  serverLogging: true,
  prefix: "☕ CoffeeShop",
});

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = { debugUtils };
}
