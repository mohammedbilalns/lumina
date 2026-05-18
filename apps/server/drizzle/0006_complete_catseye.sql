CREATE INDEX "article_reactions_user_id_reaction_idx" ON "article_reactions" USING btree ("user_id","reaction_type");--> statement-breakpoint
CREATE INDEX "articles_author_id_idx" ON "articles" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "articles_category_id_idx" ON "articles" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "articles_deleted_at_idx" ON "articles" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "user_preferences_user_id_idx" ON "user_preferences" USING btree ("user_id");