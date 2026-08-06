import crypto from 'crypto';
import path from 'path';

/**
 * Returns a safe filename.
 */
const sanitizeFileName = (originalName: string): string => {
  const extension = path.extname(originalName);

  const name = path.basename(originalName, extension);

  const sanitizeName = name
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return `${crypto.randomUUID()}-${sanitizeName}${extension}`;
};

export default sanitizeFileName;
