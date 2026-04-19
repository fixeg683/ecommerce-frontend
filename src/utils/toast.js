import { toast } from 'react-toastify';

const BASE_OPTIONS = {
  position: 'top-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const showSuccess = (msg) =>
  toast.success(msg, { ...BASE_OPTIONS });

export const showError = (msg) =>
  toast.error(msg, { ...BASE_OPTIONS, autoClose: 5000 });

export const showInfo = (msg) =>
  toast.info(msg, { ...BASE_OPTIONS });

export const showWarning = (msg) =>
  toast.warning(msg, { ...BASE_OPTIONS });

export const showLoading = (msg) =>
  toast.loading(msg, { position: 'top-right' });

export const dismissToast = (id) =>
  toast.dismiss(id);