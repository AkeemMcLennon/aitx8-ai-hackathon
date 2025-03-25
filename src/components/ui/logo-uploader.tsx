'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface LogoUploaderProps {
  onLogoUpload: (file: File) => void;
}

export function LogoUploader({ onLogoUpload }: LogoUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onLogoUpload(acceptedFiles[0]);
      }
    },
    [onLogoUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
      }`}
    >
      <input {...getInputProps()} />
      <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
      <p className="text-sm text-muted-foreground mb-1">
        {isDragActive
          ? 'Drop your logo here'
          : 'Drag & drop your logo here, or click to select'}
      </p>
      <p className="text-xs text-muted-foreground/75">
        Supports PNG and JPG (transparent PNGs recommended)
      </p>
    </div>
  );
} 