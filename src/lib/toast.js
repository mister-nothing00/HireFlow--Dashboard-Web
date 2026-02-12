import toast from "react-hot-toast";

// Utility per mostrare notifiche toast in modo centralizzato, con stili personalizzati per successi ed errori
export const showToast = {
  success: (message) => {
    toast.success(message, {
      style: {
        background: "#10b981",
        color: "#fff",
      },
    });
  },

  error: (message) => {
    toast.error(message, {
      style: {
        background: "#ef4444",
        color: "#fff",
      },
    });
  },

  loading: (message) => {
    return toast.loading(message);
  },

  promise: (promise, messages) => {
    return toast.promise(promise, {
      loading: messages.loading || "Caricamento...",
      success: messages.success || "Completato!",
      error: messages.error || "Errore!",
    });
  },

  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },
};
