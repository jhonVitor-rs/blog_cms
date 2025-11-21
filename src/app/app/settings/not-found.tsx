import { ArrowLeft, FileQuestion, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PostNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <FileQuestion className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Post não encontrado</CardTitle>
          <CardDescription>
            O post que você está procurando não existe ou foi removido.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Possíveis razões:</p>
          <ul className="list-disc list-inside text-left space-y-1">
            <li>O post foi deletado</li>
            <li>O link está incorreto</li>
            <li>Você não tem permissão para acessá-lo</li>
          </ul>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button variant="outline" asChild>
            <Link href="/app/posts">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Posts
            </Link>
          </Button>
          <Button asChild>
            <Link href="/app">
              <Home className="w-4 h-4 mr-2" />
              Ir para Início
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
