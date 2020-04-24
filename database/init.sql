DO $$ BEGIN
    CREATE TYPE "Role" AS ENUM ('USER', 'CATERER', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
CREATE TABLE IF NOT EXISTS "User" (
    "id" VARCHAR(25) PRIMARY KEY,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "Role" DEFAULT 'USER',
    "createdAt" timestamptz NOT NULL DEFAULT NOW(),
    "updatedAt" timestamptz NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS "Meal" (
    "id" VARCHAR(25) PRIMARY KEY,
    "userId" VARCHAR(255) NOT NULL REFERENCES "User" ON DELETE CASCADE,
    "title" VARCHAR(255) NOT NULL,
    "tags" _VARCHAR(255),
    "description" VARCHAR(255) NOT NULL,
    "imageUrl" VARCHAR(255) NOT NULL,
    "price" INT4 NOT NULL,
    "createdAt" timestamptz NOT NULL DEFAULT NOW(),
    "updatedAt" timestamptz NOT NULL DEFAULT NOW(),
    "deletedAt" timestamptz,
    CONSTRAINT "userTitle" UNIQUE("title", "userId"),
    CONSTRAINT "userTitle2" UNIQUE("title", "userId", "deletedAt")
);
CREATE TABLE IF NOT EXISTS "Menu" (
    "id" VARCHAR(25) PRIMARY KEY,
    "userId" VARCHAR(255) NOT NULL REFERENCES "User" ON DELETE CASCADE,
    "menuDate" date NOT NULL DEFAULT CURRENT_DATE,
    "createdAt" timestamptz NOT NULL DEFAULT NOW(),
    "updatedAt" timestamptz NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS "MealMenu" (
    "id" VARCHAR(25) PRIMARY KEY,
    "mealId" VARCHAR(255) NOT NULL REFERENCES "Meal" ON DELETE CASCADE,
    "menuId" VARCHAR(255) NOT NULL REFERENCES "Menu" ON DELETE CASCADE
);
DO $$ BEGIN
    CREATE TYPE "Status" AS ENUM ('PENDING', 'PROCESSING', 'DISPATCHED', 'FULFILLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
CREATE TABLE IF NOT EXISTS "Order" (
    "id" VARCHAR(25) PRIMARY KEY,
    "userId" VARCHAR(255) NOT NULL REFERENCES "User" ON DELETE CASCADE,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "createdAt" timestamptz NOT NULL DEFAULT NOW(),
    "updatedAt" timestamptz NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS "MealOrder" (
    "id" VARCHAR(25) PRIMARY KEY,
    "mealId" VARCHAR(255) NOT NULL REFERENCES "Meal" ON DELETE CASCADE,
    "orderId" VARCHAR(255) NOT NULL REFERENCES "Order" ON DELETE CASCADE,
    "quantity" INT4
);
CREATE TABLE IF NOT EXISTS "Address" (
    "id" VARCHAR(25) PRIMARY KEY,
    "userId" VARCHAR(255) NOT NULL REFERENCES "User" ON DELETE CASCADE,
    "street1" VARCHAR(255) NOT NULL,
    "street2" VARCHAR(255) NOT NULL,
    "lga" VARCHAR(255) NOT NULL,
    "areaCode" INT4 NOT NULL,
    "state" VARCHAR(255) NOT NULL,
    "defaultAddress" bool DEFAULT false,
    "createdAt" timestamptz NOT NULL DEFAULT NOW(),
    "updatedAt" timestamptz NOT NULL DEFAULT NOW()
);
CREATE OR REPLACE FUNCTION mealmenufunc()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
    DECLARE
   "menuUserId" VARCHAR(255);
   "mealUserId" VARCHAR(255);
    BEGIN
    SELECT "userId" INTO "menuUserId" FROM "Menu" WHERE id = NEW."menuId";
    SELECT "userId" INTO "mealUserId" FROM "Meal" WHERE id = NEW."mealId";
       IF ("menuUserId"<>"mealUserId")  THEN
            RAISE EXCEPTION 'userId fields on meal and menu do not match';
      END IF;
      RETURN NEW;
    END;
    $function$;
DROP TRIGGER IF EXISTS every_menu_meals
    ON "MealMenu";
CREATE TRIGGER every_menu_meals 
    BEFORE INSERT OR UPDATE OR DELETE
    ON "MealMenu" 
    FOR EACH ROW EXECUTE PROCEDURE mealmenufunc();