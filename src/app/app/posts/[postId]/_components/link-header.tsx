"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function LinkHeader({ postId }: { postId: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyUrl = async () => {
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/cms/posts/${postId}`;
    await navigator.clipboard.writeText(url);
    setIsCopied(true);
    toast.success("URL copiada com sucesso");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-muted rounded-lg p-3 border border-border">
        <code className="text-sm font-mono break-all text-muted-foreground">
          {postId}
        </code>
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={handleCopyUrl}
        className="shrink-0 transition-colors"
      >
        {isCopied ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
