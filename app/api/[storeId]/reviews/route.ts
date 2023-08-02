import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/prismadb";

// Create a review for a product
// Usage in your POST route

export async function createReview(
  rating: number,
  comment: string,
  productId: string,
  userId: string
) {
  try {
    const newReview = await prisma.review.create({
      data: {
        rating,
        comment,
        productId,
        userId,
      },
    });

    return newReview;
  } catch (error) {
    throw new Error("Failed to create review");
  }
}

export async function updateAverageRatings(productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        review: true,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const totalRatings = product.review.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating = totalRatings / product.review.length;

    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        ratings: averageRating,
      },
    });
  } catch (error) {
    throw new Error("Failed to update average ratings");
  }
}

export async function POST(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const body = await request.json();
    const { rating, comment, productId } = body;

    if (!rating || !comment || !productId) {
      return new NextResponse("Invalid data", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const review = await createReview(rating, comment, productId, userId);

    await updateAverageRatings(productId);

    return new NextResponse(JSON.stringify(review), { status: 201 });
  } catch (error) {
    console.error("[POST Review]", error); // Use a proper logging library for production

    return new NextResponse("Internal error", { status: 500 });
  }
}
