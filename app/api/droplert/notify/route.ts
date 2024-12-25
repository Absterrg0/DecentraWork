// app/api/droplert/receive/route.ts
import { NextRequest, NextResponse } from "next/server";

// A simple in-memory queue for notifications
const notificationsQueue: {
  title: string;
  description: string;
  selectedType:string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
}[] = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, backgroundColor, selectedType,textColor, borderColor } = body;

    // Validate the payload
    if (!title || !description || !backgroundColor|| !selectedType || !textColor || !borderColor) {
      return NextResponse.json(
        { msg: "Invalid data", error: "Required fields are missing" },
        { status: 400 }
      );
    }

    // Add the notification to the queue
    notificationsQueue.push({
      title,
      description,
      selectedType,
      backgroundColor,
      textColor,
      borderColor,
    });

    console.log("Notification added to queue:", {
      title,
      description,
    });

    return NextResponse.json({ msg: "Notification received" }, { status: 200 });
  } catch (error) {
    console.error("Error receiving notification:", error);
    return NextResponse.json(
      { msg: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const stream = new ReadableStream({
      start(controller) {
        console.log(notificationsQueue)
        const interval = setInterval(() => {
          while (notificationsQueue.length > 0) {
            const notification = notificationsQueue.shift();
            controller.enqueue(`data: ${JSON.stringify(notification)}\n\n`);
          }
        }, 1000);

        // Handle client disconnect
        controller.close = () => {
          clearInterval(interval);
          console.log("Stream closed by client");
        };
      },
      cancel() {
        console.log("Stream canceled by client");
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error setting up SSE stream:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
