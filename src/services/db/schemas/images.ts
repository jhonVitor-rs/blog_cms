import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { articles } from "./articles";
import { users } from "./user";

export const images = pgTable("images", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  url: text("url").notNull(),
  index: integer("index").notNull(),
  articleId: text("article_id").references(() => articles.id, {
    onDelete: "cascade"
  }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const imagesRelations = relations(images, ({ one }) => ({
  article: one(articles, {
    fields: [images.articleId],
    references: [articles.id],
  }),
  user: one(users, {
    fields: [images.userId],
    references: [users.id],
  }),
}));

export type TImage = typeof images.$inferSelect;
export type TNewImage = typeof images.$inferInsert;
