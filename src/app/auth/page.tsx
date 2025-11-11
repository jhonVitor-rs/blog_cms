import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Login } from "./_components/login";
import { Register } from "./_components/register";

export default function AuthPage() {
  return (
    <main className="min-h-screen w-full px-2 py-4 bg-muted">
      <Tabs
        className="w-full max-w-sm m-auto my-4 sm:my-8"
        defaultValue="login"
      >
        <Card>
          <CardHeader className="flex flex-col items-center">
            <CardTitle>Blog CMS</CardTitle>
            <CardDescription>Acesse sua conta ou crie uma nova</CardDescription>
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Registrar</TabsTrigger>
            </TabsList>
          </CardHeader>
          <TabsContent value="login">
            <Login />
          </TabsContent>
          <TabsContent value="register">
            <Register />
          </TabsContent>
        </Card>
      </Tabs>
    </main>
  );
}
