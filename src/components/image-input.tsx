/** biome-ignore-all lint/complexity/useOptionalChain: <explanation> */
"use client";

import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import type { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { FormControl } from "./ui/form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type ImageInputProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>
> = {
  field: ControllerRenderProps<TFieldValues, TName>;
  className?: string;
  label?: string;
  placeholder?: string;
  url?: string;
  error?: string;
  handlePreviewUrl: (value: string) => void;
  clearPreviewUrl: () => void;
};

export function ImageInput<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>
>({
  field,
  className = "",
  label = "",
  placeholder = "Clique ou arraste um arquivo aqui",
  url = "",
  error,
  handlePreviewUrl,
  clearPreviewUrl,
}: ImageInputProps<TFieldValues, TName>) {
  const [dragActive, setDragActive] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handlePreview = (file: File) => {
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      handlePreviewUrl(url);
    }
  };

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Arquivo muito grande. Tamanho máximo 5MB");
      return;
    }

    const isValid = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
    ].includes(file.type);
    if (!isValid) {
      alert("Tipo de arquivo não aceito");
      return;
    }

    field.onChange(file);
    handlePreview(file);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    field.onChange(null);
    clearPreviewUrl();

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div className="space-y-2 p-4 w-full">
      {label && (
        <Label htmlFor={field.name} className="text-sm font-medium">
          {label}
        </Label>
      )}
      <FormControl>
        <div className="relative">
          {/** biome-ignore lint/a11y/useSemanticElements: <explanation> */}
          <div
            role="button"
            tabIndex={0}
            className={cn(
              "relative border-2 border-dashed p-2 rounded-lg text-center cursor-pointer transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              dragActive
                ? "border-primary bg-primary/10"
                : field.value
                ? "border-green-300 bg-green-50 border-solid"
                : error
                ? "border-red-300 bg-red-50"
                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
          >
            {url !== "" ? (
              <div>
                <div className="space-y-3">
                  <div
                    className={cn(
                      "relative m-auto w-[70%] h-48 overflow-hidden rounded-md",
                      className
                    )}
                  >
                    <Image
                      src={url}
                      alt="preview"
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveFile}
                  className="absolute top-3 right-3 text-red-600 hover:text-white hover:bg-red-600 rounded-full shadow-lg"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-2 m-6">
                <Upload className="size-8 mx-auto text-gray-400" />
                <p className="text-gray-600">{placeholder}</p>
                <p className="text-sm text-gray-500">Tamanho máximo: 5MB</p>
                <p className="text-xs text-gray-500">
                  Formatos aceitos: .png, .jpeg, .jpg, .webp
                </p>
              </div>
            )}
          </div>
          <Input
            ref={inputRef}
            type="file"
            accept={".png, .jpeg, .jpg, .webp"}
            onChange={handleInputChange}
            className="hidden"
            id={field.name}
          />
        </div>
      </FormControl>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
