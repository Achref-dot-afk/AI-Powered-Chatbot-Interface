const en = require("../i18n/en.json");
const ar = require("../i18n/ar.json");

const translations = { en, ar };

/**
 * Get a localized message by key path, e.g. t("errors.missingConversationId", "en")
 */
function t(key, lang = "en") {
  const keys = key.split(".");
  let result = translations[lang] || translations["en"];

  for (const k of keys) {
    if (result && result[k] !== undefined) {
      result = result[k];
    } else {
      return key; // fallback to key if missing
    }
  }

  return result;
}

module.exports = { t };
