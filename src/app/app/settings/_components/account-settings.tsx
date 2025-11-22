/** biome-ignore-all lint/a11y/noLabelWithoutControl: <explanation> */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
"use client";
import { Check, Copy, LogOut, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { logout } from "@/lib/auth";
import { getApiKey } from "@/services/api/gen-key";
import { generateUserKey } from "../actions";

export function AccountSettings() {
  const [key, setKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const fetchApiKey = async () => {
    setIsLoading(true);
    const apiKey = await getApiKey();
    setKey(apiKey);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchApiKey();
  }, []);

  const handleUpdateKey = async () => {
    setIsLoading(true);
    try {
      const { success, message, data } = await generateUserKey();
      if (success && data) {
        toast.success(message);
        setKey(data);
      } else {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyKey = async () => {
    try {
      await navigator.clipboard.writeText(key);
      setIsCopied(true);
      toast.success("Chave copiada para a área de transferência!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error("Erro ao copiar a chave");
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Você foi desconectado!");
  };

  return (
    <div className="w-full space-y-6">
      {/* Card: Chave da API */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações da Conta</CardTitle>
          <CardDescription>
            Gerenciar sua chave de API e configurações de sessão
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Seção de Chave da API */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Chave da API</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUpdateKey}
                disabled={isLoading}
                className="text-muted-foreground hover:text-foreground"
              >
                <RefreshCcw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                <span className="ml-2 hidden sm:inline">Gerar Nova</span>
              </Button>
            </div>

            {/* Exibir Chave */}
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-muted rounded-lg p-3 border border-border">
                <code className="text-sm font-mono break-all text-muted-foreground">
                  {key}
                </code>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyKey}
                className="shrink-0 transition-colors"
              >
                {isCopied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Aviso */}
            <p className="text-xs text-muted-foreground bg-amber-50 border border-amber-200 rounded-lg p-3">
              ⚠️ Mantenha sua chave de API segura. Nunca a compartilhe
              publicamente ou com pessoas não confiáveis.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full sm:w-auto">
                <LogOut className="h-4 w-4 mr-2" />
                Sair da Conta
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Fazer logout?</AlertDialogTitle>
                <AlertDialogDescription>
                  Você será desconectado da sua conta. Você pode fazer login
                  novamente a qualquer momento.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex gap-3">
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Sair
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>

      {/* Card: Informações de Segurança */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dicas de Segurança</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Regenere sua chave regularmente para maior segurança</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Nunca compartilhe sua chave de API por email ou chat</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Use variáveis de ambiente para armazenar sua chave</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span>
                Faça logout quando terminar sua sessão em computadores públicos
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
