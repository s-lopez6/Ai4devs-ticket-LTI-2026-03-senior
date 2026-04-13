import React, { useCallback, useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";

// ─── Types ────────────────────────────────────────────────────────────────────

export type FilePickerProps = {
  /** Label shown above the drop zone. Defaults to "CV / Resume". */
  label?: string;
  /** Accepted MIME types or extensions passed to <input accept=...>. */
  accept?: string;
  /** Optional hint shown below the accepted formats text. */
  hint?: string;
};

type FilePickerState = {
  file: File | null;
  isDragOver: boolean;
};

// ─── SVG icons (inline — no @mui/icons-material dependency) ──────────────────

function UploadIcon({ isDragOver }: { isDragOver: boolean }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      sx={{
        width: 44,
        height: 44,
        color: isDragOver ? "primary.main" : "text.disabled",
        transition: "color 0.15s ease",
      }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
      />
    </Box>
  );
}

function FileIcon() {
  return (
    <Box
      component="svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      sx={{ width: 36, height: 36, color: "success.main", flexShrink: 0 }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
      />
    </Box>
  );
}

// ─── FilePicker ───────────────────────────────────────────────────────────────

/**
 * Standalone file-picker widget with drag-and-drop and keyboard support.
 *
 * UI only — no API call is made. The component manages its own state
 * (selected file, hover feedback) so it can be wired to an upload service
 * in a future iteration without structural changes.
 *
 * Accessibility:
 * - The drop zone carries role="button" with a descriptive aria-label.
 * - Keyboard users can activate it with Enter or Space.
 * - The hidden <input> is excluded from the tab order and the a11y tree.
 * - The "Remove" button has an explicit aria-label.
 * - All icons are aria-hidden.
 */
export function FilePicker({
  label = "CV / Resume",
  accept,
  hint,
}: FilePickerProps): JSX.Element {
  const [state, setState] = useState<FilePickerState>({
    file: null,
    isDragOver: false,
  });
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const selectFile = useCallback((file: File | undefined) => {
    if (file) setState((prev) => ({ ...prev, file }));
  }, []);

  const clearFile = useCallback(() => {
    setState({ file: null, isDragOver: false });
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const openBrowser = useCallback(() => {
    inputRef.current?.click();
  }, []);

  // ── Event handlers ─────────────────────────────────────────────────────────

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, isDragOver: true }));
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, isDragOver: false }));
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setState((prev) => ({ ...prev, isDragOver: false }));
      selectFile(e.dataTransfer.files[0]);
    },
    [selectFile],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      selectFile(e.target.files?.[0]);
    },
    [selectFile],
  );

  /** Allow keyboard activation when no file is selected. */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!state.file && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        openBrowser();
      }
    },
    [state.file, openBrowser],
  );

  // ── Computed styles ────────────────────────────────────────────────────────

  const hasFile = state.file !== null;

  const dropZoneHoverStyles = hasFile
    ? {}
    : {
        "&:hover": {
          borderColor: "primary.light",
          bgcolor: "rgba(167, 199, 231, 0.08)",
        },
      };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <Box>
      {/* Label */}
      <Typography
        component="p"
        variant="body2"
        sx={{ fontWeight: 500, color: "text.primary", mb: 0.75 }}
        id="file-picker-label"
      >
        {label}
      </Typography>

      {/* Drop zone */}
      <Box
        role="button"
        tabIndex={hasFile ? -1 : 0}
        aria-label={
          hasFile
            ? `${label}: ${state.file!.name} selected`
            : `${label} drop zone — drag a file here or press Enter to browse`
        }
        aria-describedby="file-picker-desc"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={hasFile ? undefined : openBrowser}
        onKeyDown={handleKeyDown}
        sx={{
          border: "2px dashed",
          borderColor: state.isDragOver
            ? "primary.main"
            : hasFile
              ? "success.main"
              : "divider",
          borderRadius: 2,
          p: { xs: 2.5, md: 3.5 },
          bgcolor: state.isDragOver
            ? "rgba(167, 199, 231, 0.15)"
            : hasFile
              ? "rgba(183, 228, 199, 0.15)"
              : "#FAFAFF",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1.5,
          cursor: hasFile ? "default" : "pointer",
          transition: "all 0.15s ease",
          outline: "none",
          "&:focus-visible": {
            outline: "3px solid",
            outlineColor: "primary.light",
            outlineOffset: "2px",
          },
          ...dropZoneHoverStyles,
        }}
      >
        {hasFile ? (
          /* ── File selected state ─────────────────────────────────────── */
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <FileIcon />

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "text.primary",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {state.file!.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {(state.file!.size / 1024).toFixed(1)} KB
              </Typography>
            </Box>

            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              aria-label={`Remove ${state.file!.name}`}
              sx={{ flexShrink: 0 }}
            >
              Remove
            </Button>
          </Box>
        ) : (
          /* ── Empty / waiting state ───────────────────────────────────── */
          <>
            <UploadIcon isDragOver={state.isDragOver} />

            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "text.primary" }}
              >
                Drag &amp; drop your file here
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                id="file-picker-desc"
                sx={{ display: "block", mt: 0.25 }}
              >
                or{" "}
                <Box
                  component="span"
                  sx={{
                    color: "primary.main",
                    fontWeight: 600,
                    textDecoration: "underline",
                  }}
                >
                  browse to upload
                </Box>
              </Typography>
            </Box>

            {accept && (
              <Typography variant="caption" color="text.disabled">
                Accepted: {accept}
              </Typography>
            )}

            {hint && (
              <Typography variant="caption" color="text.disabled">
                {hint}
              </Typography>
            )}
          </>
        )}
      </Box>

      {/* Hidden file input — excluded from tab order and a11y tree */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        style={{ display: "none" }}
        aria-hidden="true"
        tabIndex={-1}
      />
    </Box>
  );
}
