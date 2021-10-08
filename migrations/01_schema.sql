DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS property_reviews CASCADE;

CREATE TABLE "properties"(
    "id" INTEGER NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnail_photo_url" VARCHAR(255) NOT NULL,
    "cover_photo_url" VARCHAR(255) NOT NULL,
    "cost_per_night" INTEGER NOT NULL,
    "parking_spaces" INTEGER NOT NULL,
    "number_of_bathrooms" INTEGER NOT NULL,
    "number_of_bedrooms" INTEGER NOT NULL,
    "country" VARCHAR(255) NOT NULL,
    "street" VARCHAR(255) NOT NULL,
    "city" VARCHAR(255) NOT NULL,
    "province" VARCHAR(255) NOT NULL,
    "post_code" VARCHAR(255) NOT NULL,
    "active" BOOLEAN NOT NULL
);
ALTER TABLE
    "properties" ADD PRIMARY KEY("id");
CREATE TABLE "reservations"(
    "id" INTEGER NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "property_id" INTEGER NOT NULL,
    "guest_id" INTEGER NOT NULL
);
ALTER TABLE
    "reservations" ADD PRIMARY KEY("id");
CREATE TABLE "property_reviews"(
    "id" INTEGER NOT NULL,
    "guest_id" INTEGER NOT NULL,
    "property_id" INTEGER NOT NULL,
    "reservation_id" INTEGER NOT NULL,
    "rating" SMALLINT NOT NULL,
    "message" TEXT NOT NULL
);
ALTER TABLE
    "property_reviews" ADD PRIMARY KEY("id");
CREATE TABLE "users"(
    "id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "users" ADD PRIMARY KEY("id");
ALTER TABLE
    "property_reviews" ADD CONSTRAINT "property_reviews_reservation_id_foreign" FOREIGN KEY("reservation_id") REFERENCES "reservations"("id");
ALTER TABLE
    "property_reviews" ADD CONSTRAINT "property_reviews_property_id_foreign" FOREIGN KEY("property_id") REFERENCES "properties"("id");
ALTER TABLE
    "reservations" ADD CONSTRAINT "reservations_property_id_foreign" FOREIGN KEY("property_id") REFERENCES "properties"("id");
ALTER TABLE
    "reservations" ADD CONSTRAINT "reservations_guest_id_foreign" FOREIGN KEY("guest_id") REFERENCES "users"("id");
ALTER TABLE
    "property_reviews" ADD CONSTRAINT "property_reviews_guest_id_foreign" FOREIGN KEY("guest_id") REFERENCES "users"("id");
ALTER TABLE
    "properties" ADD CONSTRAINT "properties_owner_id_foreign" FOREIGN KEY("owner_id") REFERENCES "users"("id");