import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient, Prisma } from "@prisma/client";
import nodemailer from "nodemailer";
import { nanoid } from "nanoid";

dotenv.config();

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

// ---------- helpers ----------
const transporter = nodemailer.createTransport({
  host: process.env.MT_HOST,
  port: Number(process.env.MT_PORT),
  auth: {
    user: process.env.MT_USER,
    pass: process.env.MT_PASS
  }
});

function simulateGateway(card: string): "APPROVED" | "DECLINED" | "FAILED" {
  const last = card.trim().slice(-1);
  if (last === "1") return "APPROVED";
  if (last === "2") return "DECLINED";
  return "FAILED";
}

// ---------- routes ----------
app.get("/api/products", async (_, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

app.post("/api/checkout", async (req: Request, res: Response) => {
  try {
    const {
      customer,
      cart,           // {productId, variant, quantity}
      payment         // {cardNumber, expiry, cvv}
    } = req.body;

    const gatewayStatus = simulateGateway(payment.cardNumber);
    const orderNumber = `ORD-${nanoid(8).toUpperCase()}`;

    const order = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const ids = cart.map((c: any) => c.productId);
      const products = await tx.product.findMany({
        where: { id: { in: ids } }
      });

      const items = [];

      for (const line of cart) {
        const p = products.find((product: any) => product.id === line.productId);
        if (!p || p.inventory < line.quantity) throw new Error("Out of stock");

        await tx.product.update({
          where: { id: p.id },
          data: { inventory: { decrement: line.quantity } }
        });

        items.push({
          productId: p.id,
          variant: line.variant,
          quantity: line.quantity,
          subtotal: p.price * line.quantity
        });
      }

      return await tx.order.create({
        data: {
          orderNumber,
          status: gatewayStatus,
          customerName: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          city: customer.city,
          state: customer.state,
          zip: customer.zip,
          cardLast4: payment.cardNumber.slice(-4),
          items: { create: items }
        },
        include: {
          items: {
            include: { product: true }
          }
        }
      });
    });

    const html = gatewayStatus === "APPROVED"
      ? `<h2>Thank you for your purchase!</h2><p>Your order <strong>${orderNumber}</strong> is confirmed.</p>`
      : `<h2>Payment ${gatewayStatus}</h2><p>Unfortunately we could not process your order ${orderNumber}.</p>`;

    await transporter.sendMail({
      from: '"eSalesOne" <no-reply@esalesone.io>',
      to: order.email,
      subject: gatewayStatus === "APPROVED"
        ? `Order ${orderNumber} confirmed`
        : `Order ${orderNumber} failed`,
      html
    });

    res.json({ orderNumber });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/order/:orderNumber", async (req: Request, res: Response) => {
  const { orderNumber } = req.params;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: {
        include: { product: true }
      }
    }
  });

  if (!order) {
    return res.status(404).json({ error: "Not found" });
  }

  res.json(order);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`⇢ Backend listening on ${PORT}`));
