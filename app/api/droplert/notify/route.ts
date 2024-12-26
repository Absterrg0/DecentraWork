import { NextRequest, NextResponse } from "next/server";

type Notification = {
  title: string;
  description: string;
  selectedType: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  id?: string;
  timestamp?: number;
};

class NotificationManager {
  private static instance: NotificationManager;
  private notificationsQueue: Notification[] = [];
  private connections: Set<ReadableStreamDefaultController<Uint8Array>> = new Set();

  private constructor() {}

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  addNotification(notification: Notification) {
    const enrichedNotification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    
    console.log("Adding notification:", enrichedNotification); // Log notification details
    this.notificationsQueue.push(enrichedNotification);
    setImmediate(() => this.broadcastNotifications());
  }

  addConnection(controller: ReadableStreamDefaultController<Uint8Array>) {
    console.log("New connection added."); // Log connection addition
    this.connections.add(controller);
  }

  private broadcastNotifications() {
    while (this.notificationsQueue.length > 0) {
      const notification = this.notificationsQueue.shift();
      if (notification) {
        const encoder = new TextEncoder();
        const data = encoder.encode(`data: ${JSON.stringify(notification)}\n\n`);
        this.connections.forEach((controller) => {
          try {
            controller.enqueue(data);
          } catch (error) {
            console.error('Error sending notification:', error);
            // Log the error for debugging
          }
        });
      }
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, backgroundColor, selectedType, textColor, borderColor } = body;

    const requiredFields = { title, description, backgroundColor, selectedType, textColor, borderColor };
    const missingFields = Object.entries(requiredFields)
      .filter(([value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      console.warn("Validation failed:", missingFields); // Log validation failure
      return NextResponse.json(
        { error: "Validation failed", details: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    const validTypes = ["ALERT", "ALERT_DIALOG", "TOAST"];
    if (!validTypes.includes(selectedType)) {
      console.warn("Invalid selectedType:", selectedType); // Log invalid type
      return NextResponse.json(
        { error: "Invalid selectedType", details: `selectedType must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    NotificationManager.getInstance().addNotification({
      title,
      description,
      selectedType,
      backgroundColor,
      textColor,
      borderColor,
    });

    return NextResponse.json(
      { message: "Notification queued successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing notification:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error }, // Log only the message for security
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const notificationManager = NotificationManager.getInstance();
    
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        notificationManager.addConnection(controller);

        // Send initial heartbeat
        controller.enqueue(new TextEncoder().encode(`: heartbeat\n\n`));
        console.log("Heartbeat sent to client."); // Log heartbeat
      },
      cancel() {
        console.log("Connection cancelled."); // Log cancellation
        // No action needed here since we want to keep connections alive
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error setting up SSE stream:", error);
    return new Response(
      JSON.stringify({ error: "Failed to setup event stream" }),
      { status: 500 }
    );
  }
}
