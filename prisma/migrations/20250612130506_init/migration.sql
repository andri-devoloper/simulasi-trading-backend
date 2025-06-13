-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "price_entry" DOUBLE PRECISION NOT NULL,
    "tp_price" DOUBLE PRECISION NOT NULL,
    "sl_price" DOUBLE PRECISION NOT NULL,
    "leverage" TEXT NOT NULL,
    "timeframe" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
