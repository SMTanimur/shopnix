'use client';

import React, { useRef } from 'react';
import { UploadCloud, X, Star } from 'lucide-react';
import type { ProductImage } from '@shopnix/types';
import { cn } from '@shopnix/utils';

export interface ImageUploaderProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  maxFiles?: number;
  className?: string;
}

export function ImageUploader({
  images,
  onChange,
  maxFiles = 8,
  className,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSimulatedUpload = (files: FileList | null) => {
    if (!files) return;

    const newImages: ProductImage[] = Array.from(files).map((file, idx) => ({
      url: URL.createObjectURL(file),
      alt_text: file.name.replace(/\.[^/.]+$/, ''),
      sort_order: images.length + idx,
      is_primary: images.length === 0 && idx === 0,
    }));

    onChange([...images, ...newImages].slice(0, maxFiles));
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    if (updated.length > 0 && !updated.some((img) => img.is_primary)) {
      updated[0]!.is_primary = true;
    }
    onChange(updated);
  };

  const handleSetPrimary = (index: number) => {
    const updated = images.map((img, i) => ({
      ...img,
      is_primary: i === index,
    }));
    onChange(updated);
  };

  return (
    <div className={cn('space-y-3', className)}>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => handleSimulatedUpload(e.target.files)}
      />

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleSimulatedUpload(e.dataTransfer.files);
        }}
        className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-lg bg-card/60 hover:bg-muted/40 transition-colors cursor-pointer text-center"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground mb-2">
          <UploadCloud className="h-5 w-5" />
        </div>
        <p className="text-sm font-medium text-foreground">
          Click or drag & drop to upload images
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          PNG, JPG, WEBP up to 5MB (Max {maxFiles} images)
        </p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="group relative aspect-square rounded-md overflow-hidden border border-border bg-muted/20"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt_text || 'Uploaded thumbnail'}
                className="w-full h-full object-cover"
              />

              {img.is_primary && (
                <div className="absolute top-1.5 left-1.5 bg-primary text-primary-foreground text-[10px] font-semibold px-1.5 py-0.5 rounded-xs shadow-xs">
                  Primary
                </div>
              )}

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!img.is_primary && (
                  <button
                    type="button"
                    title="Set as primary thumbnail"
                    onClick={() => handleSetPrimary(idx)}
                    className="p-1.5 bg-white/90 text-foreground hover:bg-white rounded-full transition-colors cursor-pointer"
                  >
                    <Star className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  title="Remove image"
                  onClick={() => handleRemove(idx)}
                  className="p-1.5 bg-rose-600 text-white hover:bg-rose-700 rounded-full transition-colors cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
