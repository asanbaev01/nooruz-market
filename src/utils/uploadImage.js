/* Файлды base64'ке которуу (backend'siz) */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/* Файлдын өлчөмүн текшерүү */
export const validateImage = (file, maxSizeMB = 2) => {
  if (!file) return { valid: false, error: 'Файл тандалган жок' };

  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Бул файл сүрөт эмес' };
  }

  const maxSize = maxSizeMB * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: `Файл өтө чоң (макс: ${maxSizeMB}MB)` };
  }

  return { valid: true };
};