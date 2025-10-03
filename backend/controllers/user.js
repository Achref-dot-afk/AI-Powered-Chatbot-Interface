const db = require("../config/db.js");
const { t } = require("../utils/i18n.js");
const validLanguages = ["en", "ar"];

module.exports = {
    updateLanguage: async (req, res) => {
        try {
            const userId = req.user.id;
            const { language } = req.body;
            const lang = language;
            if (!validLanguages.includes(language)) {
                return res.status(400).json({ error: t("errors.invalidLanguage", lang) });
            }
            db.run(
                `UPDATE users SET language = ? WHERE id = ?`,
                [language, userId],
                function (err) {
                    if (err) {
                        return res.status(500).json({ error: t("errors.dbError", lang) });
                    }
                    return res.status(200).json({ message: t("user.languageUpdated", lang) });
                }
            );
        } catch (err) {
            return res.status(500).json({ error: "Server error", details: err.message });
        }
    },
}