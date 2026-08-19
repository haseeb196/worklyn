export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB, V1 default

export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/zip",
  "application/x-zip-compressed",
];

export const STORAGE_BUCKET = "project-files";
