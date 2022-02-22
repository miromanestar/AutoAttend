-- Seeder data
CREATE TYPE "public"."roles" AS ENUM (
  'global_admin',
  'admin',
  'instructor',
  'student'
);

CREATE TABLE "public"."Event" (
  "id" int PRIMARY KEY,
  "name" varchar,
  "time" datetime,
  "host" varchar,
  "owner" id
);

CREATE TABLE "public"."Participant" (
  "id" int PRIMARY KEY,
  "event_id" int,
  "present" boolean DEFAULT false,
  "updated_at" datetime DEFAULT null
);

CREATE TABLE "public"."Identification" (
  "id" int PRIMARY KEY,
  "event_id" int,
  "user_id" int,
  "name" varchar,
  "confidence" float
);

CREATE TABLE "public"."User" (
  "id" int PRIMARY KEY,
  "name" varchar,
  "email" varchar,
  "role" roles
);

ALTER TABLE "public"."Event" ADD FOREIGN KEY ("owner") REFERENCES "public"."User" ("id");

ALTER TABLE "public"."Participant" ADD FOREIGN KEY ("id") REFERENCES "public"."User" ("id");

ALTER TABLE "public"."Participant" ADD FOREIGN KEY ("event_id") REFERENCES "public"."Event" ("id");

ALTER TABLE "public"."Event" ADD FOREIGN KEY ("id") REFERENCES "Identification" ("event_id");

ALTER TABLE "public"."Identification" ADD FOREIGN KEY ("user_id") REFERENCES "public"."User" ("id");