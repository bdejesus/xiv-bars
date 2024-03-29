-- CreateTable
CREATE TABLE "Character" (
    "id" SERIAL NOT NULL,
    "characterId" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "portrait" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleTop" BOOLEAN NOT NULL DEFAULT false,
    "world" TEXT NOT NULL,
    "race" TEXT NOT NULL,
    "nameday" TEXT NOT NULL,
    "guardian" TEXT NOT NULL,
    "cityState" TEXT NOT NULL,
    "grandCompanyName" TEXT NOT NULL,
    "grandCompanyRank" TEXT NOT NULL,
    "freeCompany" TEXT NOT NULL,
    "activeClassJob" JSONB NOT NULL,
    "mainhand" JSONB NOT NULL,
    "offHand" JSONB NOT NULL,
    "head" JSONB NOT NULL,
    "body" JSONB NOT NULL,
    "hands" JSONB NOT NULL,
    "legs" JSONB NOT NULL,
    "feet" JSONB NOT NULL,
    "earrings" JSONB NOT NULL,
    "necklace" JSONB NOT NULL,
    "bracelets" JSONB NOT NULL,
    "ring1" JSONB NOT NULL,
    "ring2" JSONB NOT NULL,
    "soulstone" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);
