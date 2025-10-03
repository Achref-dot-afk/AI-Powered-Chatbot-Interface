import { toast } from "react-hot-toast";
import axios from "axios";

const updateLanguage = async (userId, newLanguage, token) => {
    try {
        const res = await axios.put(`/api/user/${userId}`, { language: newLanguage }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        toast.success(newLanguage === 'ar' ? 'تم تحديث اللغة بنجاح' : 'Language updated successfully');
        return true;
    } catch (err) {
        console.error("Error updating language:", err);
        toast.error(err.response?.data?.error || 'Failed to update language');
        return false;
    }
};

export { updateLanguage };