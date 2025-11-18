"use client ";

import { Notebook } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { NewPostForm } from "./new-post-form";

export function EmptyList() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant={"icon"}>
          <Notebook />
        </EmptyMedia>
        <EmptyTitle>Nenhuma postagem ainda</EmptyTitle>
        <EmptyDescription>
          Nenhum post encontrado, deseja criar um novo?
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <NewPostForm>Novo Post</NewPostForm>
      </EmptyContent>
    </Empty>
  );
}
