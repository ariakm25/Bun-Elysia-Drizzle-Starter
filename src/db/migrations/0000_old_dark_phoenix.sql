DO $$ BEGIN
 CREATE TYPE "public"."userStatusEnum" AS ENUM('pending', 'active', 'inactive', 'suspended');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Permission" (
	"id" serial PRIMARY KEY NOT NULL,
	"subject" text NOT NULL,
	"action" text NOT NULL,
	"description" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "RoleToPermission" (
	"roleId" integer NOT NULL,
	"permissionId" integer NOT NULL,
	"conditions" text,
	"fields" text,
	CONSTRAINT "RoleToPermission_permissionId_roleId_pk" PRIMARY KEY("permissionId","roleId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Role" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAtt" timestamp DEFAULT now(),
	CONSTRAINT "Role_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserToRole" (
	"userId" varchar(255) NOT NULL,
	"roleId" integer NOT NULL,
	CONSTRAINT "UserToRole_userId_roleId_pk" PRIMARY KEY("userId","roleId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "User" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerifiedAt" timestamp,
	"password" text NOT NULL,
	"image" text,
	"status" "userStatusEnum" DEFAULT 'pending',
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "User_id_unique" UNIQUE("id"),
	CONSTRAINT "User_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "RoleToPermission" ADD CONSTRAINT "RoleToPermission_roleId_Role_id_fk" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "RoleToPermission" ADD CONSTRAINT "RoleToPermission_permissionId_Permission_id_fk" FOREIGN KEY ("permissionId") REFERENCES "public"."Permission"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserToRole" ADD CONSTRAINT "UserToRole_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserToRole" ADD CONSTRAINT "UserToRole_roleId_Role_id_fk" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "roleNameIdx" ON "Role" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "userEmailIdx" ON "User" USING btree ("email");