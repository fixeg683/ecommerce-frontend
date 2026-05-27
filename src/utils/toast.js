import { toast } from 'react-hot-toast';

const BASE_OPTIONS = {
  duration: 5000,
  position: 'top-right',
};

export const showSuccess = (msg) =>
  toast.success(msg, {
    ...BASE_OPTIONS,
    icon: '✅',
  });

export const showError = (msg) =>
  toast.error(msg, {
    ...BASE_OPTIONS,
    duration: 6000,
    icon: '❌',
  });

export const showInfo = (msg) =>
  toast(msg, {
    ...BASE_OPTIONS,
    icon: 'ℹ️',
  });

export const showWarning = (msg) =>
  toast(msg, {
    ...BASE_OPTIONS,
    icon: '⚠️',
  });

export const showLoading = (msg) =>
  toast.loading(msg, {
    ...BASE_OPTIONS,
  });

export const dismissToast = (id) =>
  toast.dismiss(id);