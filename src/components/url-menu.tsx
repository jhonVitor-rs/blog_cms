import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function UrlMenu({ url }: { url: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/cms/${url}`
      );
      setIsCopied(true);
      toast.success("Chave copiada para a área de transferência!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error("Erro ao copiar a chave");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button
          size={"icon"}
          className="rounded-full"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-50">
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleCopyUrl();
          }}
        >
          {isCopied ? "Copiada" : "Copiar URL"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
