-- CreateTable
CREATE TABLE "parties" (
    "id" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vote_sessions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),

    CONSTRAINT "vote_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vote_preferences" (
    "id" TEXT NOT NULL,
    "voteSessionId" TEXT NOT NULL,
    "partyId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,

    CONSTRAINT "vote_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "parties_active_order_idx" ON "parties"("active", "order");

-- CreateIndex
CREATE INDEX "vote_sessions_submittedAt_idx" ON "vote_sessions"("submittedAt");

-- CreateIndex
CREATE INDEX "vote_preferences_partyId_rank_idx" ON "vote_preferences"("partyId", "rank");

-- CreateIndex
CREATE UNIQUE INDEX "vote_preferences_voteSessionId_rank_key" ON "vote_preferences"("voteSessionId", "rank");

-- AddForeignKey
ALTER TABLE "vote_preferences" ADD CONSTRAINT "vote_preferences_voteSessionId_fkey" FOREIGN KEY ("voteSessionId") REFERENCES "vote_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote_preferences" ADD CONSTRAINT "vote_preferences_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "parties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
