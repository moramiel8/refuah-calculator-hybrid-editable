const MEGABYTE = 1024 * 1024;

export const MAX_UPLOAD_BYTES = 5 * MEGABYTE;
const DEFAULT_IMAGE_TYPE = "image/jpeg";

export function assertFileSize(file: File, maxBytes = MAX_UPLOAD_BYTES) {
  if (file.size > maxBytes) {
    throw new Error(`MAX_FILE_SIZE:${Math.round(maxBytes / MEGABYTE)}`);
  }
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("IMAGE_LOAD_FAILED"));
    image.src = src;
  });
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("FILE_READ_FAILED"));
    reader.readAsDataURL(file);
  });
}

export async function compressImageFile(
  file: File,
  {
    maxDimension = 1280,
    quality = 0.82,
    type = DEFAULT_IMAGE_TYPE,
  }: {
    maxDimension?: number;
    quality?: number;
    type?: string;
  } = {},
) {
  if (!file.type.startsWith("image/")) {
    return file;
  }

  const src = await readFileAsDataUrl(file);
  const image = await loadImage(src);

  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("CANVAS_CONTEXT_FAILED");
  }

  context.drawImage(image, 0, 0, width, height);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => {
      if (!result) {
        reject(new Error("IMAGE_COMPRESSION_FAILED"));
        return;
      }
      resolve(result);
    }, type, quality);
  });

  const extension = type === "image/png" ? "png" : "jpg";
  const fileName = file.name.replace(/\.[^/.]+$/, "") || "image";

  return new File([blob], `${fileName}.${extension}`, {
    type,
    lastModified: Date.now(),
  });
}
