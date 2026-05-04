import { NextResponse } from "next/server";
import { PRODUCTS } from "@/mock/products";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}
