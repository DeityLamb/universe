CREATE TABLE "project" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "project_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"fullName" varchar(255) NOT NULL,
	"owner_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"url" varchar(255) NOT NULL,
	"stars" integer NOT NULL,
	"forks" integer NOT NULL,
	"issues" integer NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "project_fullName_unique" UNIQUE("fullName")
);
--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "expires_at" SET DEFAULT now() + interval '7 day';--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_owner_id_account_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;