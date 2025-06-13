-- CreateTable
CREATE TABLE "StrategyConfig" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "timeframe" TEXT NOT NULL,
    "plusDI" DOUBLE PRECISION NOT NULL,
    "minusDI" DOUBLE PRECISION NOT NULL,
    "adx" DOUBLE PRECISION NOT NULL,
    "takeProfit" DOUBLE PRECISION NOT NULL,
    "stopLoss" DOUBLE PRECISION NOT NULL,
    "leverage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StrategyConfig_pkey" PRIMARY KEY ("id")
);
