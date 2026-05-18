/**
 * Utility to compress images on the client side using HTML5 Canvas.
 * This helps bypass Vercel's 4.5MB serverless payload limit for file uploads.
 */
export const compressImage = (
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.7
): Promise<File> => {
  return new Promise((resolve, reject) => {
    // If the browser doesn't support FileReader or Canvas, skip compression
    if (typeof window === "undefined" || !window.FileReader || !window.HTMLCanvasElement) {
      resolve(file);
      return;
    }

    // Skip compression for non-image files
    if (!file.type.startsWith("image/")) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions preserving aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file); // fallback to original file if canvas is not supported
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Convert blob back to a File object with same name
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};
