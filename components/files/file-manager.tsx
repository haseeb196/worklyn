"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Upload, FileText, Trash2, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { MAX_FILE_SIZE_BYTES } from "@/lib/config/files";
import {
  uploadFileAction,
  deleteFileAction,
  getSignedFileUrl,
} from "@/lib/actions/files";

type FileRow = {
  id: string;
  name: string;
  file_size: number;
  mime_type: string;
  storage_path: string;
  created_at: string;
};

export function FileManager({
  projectId,
  initialFiles,
}: {
  projectId: string;
  initialFiles: FileRow[];
}) {
  const [files, setFiles] = useState(initialFiles);
  const [uploading, startUpload] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(
        `File exceeds the ${MAX_FILE_SIZE_BYTES / (1024 * 1024)} MB limit`,
      );
      return;
    }

    const formData = new FormData();
    formData.set("file", file);

    startUpload(async () => {
      const result = await uploadFileAction(projectId, formData);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success("File uploaded");
        setFiles((prev) => [
          {
            id: crypto.randomUUID(),
            name: file.name,
            file_size: file.size,
            mime_type: file.type,
            storage_path: "",
            created_at: new Date().toISOString(),
          },
          ...prev,
        ]);
      }
    });
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleDelete(fileId: string) {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    startUpload(async () => {
      const result = await deleteFileAction(fileId, projectId);
      if (result && "error" in result) toast.error(result.error);
    });
  }

  async function handleDownload(storagePath: string) {
    const result = await getSignedFileUrl(storagePath);
    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    window.open(result.url, "_blank");
  }

  return (
    <div className="space-y-4">
      <div>
        <input
          ref={inputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload-input"
        />
        <label htmlFor="file-upload-input">
          <Button
            type="button"
            variant="secondary"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
            {uploading ? "Uploading…" : "Upload File"}
          </Button>
        </label>
        <p className="mt-1 text-xs text-secondary">
          PDF, PNG, JPG, WEBP, DOCX, XLSX, ZIP — up to{" "}
          {MAX_FILE_SIZE_BYTES / (1024 * 1024)} MB
        </p>
      </div>

      {files.length === 0 ? (
        <Card className="p-8 text-center text-sm text-secondary">
          No files uploaded yet.
        </Card>
      ) : (
        <Card className="divide-y divide-slate-100">
          {files.map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between px-5 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <FileText className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate text-sm text-slate-900">
                  {f.name}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-xs text-secondary">
                  {(f.file_size / 1024).toFixed(0)} KB
                </span>
                {f.storage_path && (
                  <button
                    onClick={() => handleDownload(f.storage_path)}
                    aria-label="Download"
                    className="text-outline hover:text-primary"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                )}
                <ConfirmDialog
                  trigger={
                    <button
                      aria-label="Delete"
                      className="text-outline hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  }
                  title="Delete this file?"
                  description="This permanently removes the file from storage."
                  onConfirm={() => handleDelete(f.id)}
                />
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
