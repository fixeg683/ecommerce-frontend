const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop';

const BACKEND_URL = (import.meta.env.VITE_API_URL || 'https://backend-ecommerce-3-2hqt.onrender.com/api').replace(/\/+$/, '');

export const getProductImageFallback = () => PLACEHOLDER_IMAGE;

export const resolveProductImage = (product) => {
  if (!product || typeof product !== 'object') {
    return null;
  }

  const imageField =
    product.image ||
    product.img ||
    product.image_url ||
    product.imageUrl ||
    product.cover ||
    product.cover_image;

  if (!imageField || typeof imageField !== 'string') {
    return null;
  }

  const trimmedValue = imageField.trim();
  if (!trimmedValue) {
    return null;
  }

  if (/^https?:\/\//i.test(trimmedValue)) {
    return trimmedValue;
  }

  const normalizedPath = trimmedValue.startsWith('/') ? trimmedValue : `/${trimmedValue}`;
  return `${BACKEND_URL}${normalizedPath}`;
};
