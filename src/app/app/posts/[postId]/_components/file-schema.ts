import { z } from 'zod'

export const imageFileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "A imagem deve ter no máximo 5MB",
  })
  .refine(
    (file) =>
      ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(
        file.type
      ),
    {
      message: "Apenas arquivos JPG, PNG ou WebP são permitidos",
    }
  );
