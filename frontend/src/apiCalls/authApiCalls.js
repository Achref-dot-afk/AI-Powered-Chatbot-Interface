import { toast } from "react-hot-toast";
import axios from "axios";

const registerUser = async (user) => {
  const lang = user.language || "en";

  // Show loading toast
  const toastId = toast.loading(
    lang === "ar"
      ? "جارٍ تسجيل المستخدم، يرجى الانتظار..."
      : "Registering user, please wait..."
  );

  try {
    const res = await axios.post("/api/auth/signup", user, {
      headers: { "Content-Type": "application/json" },
    });
    toast.dismiss(toastId);
    toast.success(
      lang === "ar"
        ? `تم تسجيل المستخدم ${res.data.user.email} بنجاح!`
        : `User ${res.data.user.email} registered successfully!`
    );

    console.log("Registration response:", res.data);
    return true;
  } catch (err) {
    toast.dismiss(toastId);
    toast.error(err.response?.data?.error);
    return false;
  }
};

const loginUser= async (user) => {
        try{
            const res=await axios.post(`/api/auth/signin`,user);
            localStorage.setItem("user",JSON.stringify(res.data))
            toast.success("Logged in successfully",{autoClose:1200});
            return true;
        }catch(err){
            toast.error(err.response.data.error,{autoClose:1200});
            return false;
        }
    }

const logout = () => {
  localStorage.removeItem("user");
  toast.success("Logged out successfully", { autoClose: 1200 });
  window.location.href = "/";
};


export {registerUser, loginUser, logout};
