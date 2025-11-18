/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
"use client";
import { GripVertical, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { createSwapy } from "swapy";
import { Button } from "@/components/ui/button";
import type { TArticle, TNewArticle } from "@/services/db/schemas";
import {
  createArticle,
  deleteArticle,
  updateArticle,
  updatedArticlesIndex,
} from "../actions";
import { Article } from "./article";

export function ArticlesList({
  articles,
  postId,
}: {
  articles: TArticle[];
  postId: string;
}) {
  const [articlesList, setArticlesList] = useState(articles);
  const [isCreating, setIsCreating] = useState(false);
  const articlesContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (articlesContainer.current) {
      const swapyArticles = createSwapy(articlesContainer.current, {
        animation: "dynamic",
      });

      swapyArticles.onSwapEnd(async (event) => {
        const newOrder = event.slotItemMap.asArray.map((item, index) => {
          const articleId = item.item.replace("article-", "") || "";
          return {
            id: articleId,
            index: index,
          };
        });

        const { success, message } = await updatedArticlesIndex(newOrder);
        if (!success) {
          toast.error(message);
          setArticlesList(articlesList);
        }
      });

      return () => {
        swapyArticles.destroy();
      };
    }
  }, [articlesList.length]);

  const handleCreateNew = () => {
    setIsCreating(true);
  };

  const handleSave = async (data: TArticle | TNewArticle) => {
    const isNew = !("id" in data && data.id);
    if (isNew) {
      const {
        success,
        message,
        data: newArticle,
      } = await createArticle(data as TNewArticle);
      if (success && newArticle) {
        toast.success(message);
        setArticlesList((prev) => [...prev, newArticle]);
        setIsCreating(false);
      } else {
        toast.error(message);
      }
    } else {
      const {
        success,
        message,
        data: article,
      } = await updateArticle(data as TArticle);
      if (success && article) {
        toast.success(message);
        setArticlesList((arts) =>
          arts.map((art) => (art.id === article.id ? article : art))
        );
      } else {
        toast.error(message);
      }
    }
  };

  const handleDelete = async (id: string) => {
    const { message, success } = await deleteArticle(id);
    if (success) {
      toast.success(message);
      setArticlesList((prev) => prev.filter((p) => p.id !== id));
    } else {
      toast.error(message);
    }
  };

  const handleCancelNew = () => {
    setIsCreating(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Artigos</h3>
        <Button onClick={handleCreateNew} disabled={isCreating}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Artigo
        </Button>
      </div>

      <div ref={articlesContainer} className="space-y-2">
        {articlesList.map((article) => (
          <div key={article.id} data-swapy-slot={`slot-${article.id}`}>
            <div
              data-swapy-item={`article-${article.id}`}
              className="flex gap-2 items-start"
            >
              <div
                data-swapy-handle
                className="cursor-grab active:cursor-grabbing pt-4"
              >
                <GripVertical className="h-5 w-5 text-gray-600 hover:text-gray-800" />
              </div>

              <div className="flex-1">
                <Article
                  article={article}
                  onSave={handleSave}
                  onDelete={handleDelete}
                />
              </div>
            </div>
          </div>
        ))}

        {isCreating && (
          <div className="mt-2">
            <Article
              onSave={handleSave}
              article={{
                index: articlesList.length,
                postId,
                title: null,
                text: "",
              }}
              onCancel={handleCancelNew}
              defaultOpen={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}
