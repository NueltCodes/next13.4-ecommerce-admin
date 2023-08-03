import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { orderId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.orderId) {
      return new NextResponse("Order ID is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Finding  the order to be deleted first
    const order = await prismadb.order.findFirst({
      where: {
        id: params.orderId,
        storeId: params.storeId,
      },
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    // Delete the Order and its associated OrderItems in a single transaction
    const deletedOrder = await prismadb.$transaction([
      prismadb.orderItem.deleteMany({
        where: {
          orderId: params.orderId,
        },
      }),
      prismadb.order.delete({
        where: {
          id: params.orderId,
        },
      }),
    ]);

    return new NextResponse(JSON.stringify(deletedOrder), { status: 200 });
  } catch (error) {
    console.log("[ORDER_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
