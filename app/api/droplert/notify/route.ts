// app/api/droplert/notify/route.ts
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
  private connections: 
  Set<ReadableStreamController<Uint8Array>> = new Set();
  
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
    this.notificationsQueue.push(enrichedNotification);
    this.broadcastNotifications();
  }
  addConnection(controller: ReadableStreamController<Uint8Array>) {
    this.connections.add(controller);
  }
  removeConnection(controller: ReadableStreamController<Uint8Array>) {
    this.connections.delete(controller);
  }

  private broadcastNotifications() {
    while (this.notificationsQueue.length > 0) {
      const notification = this.notificationsQueue.shift();
      if (notification) {
        this.connections.forEach((controller) => {
          try {
            const encoder = new TextEncoder();
            const data = encoder.encode(`data: ${JSON.stringify(notification)}\n\n`);
            controller.enqueue(data);
          } catch (error) {
            console.error('Error sending notification:', error);
            this.removeConnection(controller);
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

    const requiredFields = {
      title,
      description,
      backgroundColor,
      selectedType,
      textColor,
      borderColor,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const validTypes = ["ALERT", "ALERT_DIALOG", "TOAST"];
    if (!validTypes.includes(selectedType)) {
      return NextResponse.json(
        {
          error: "Invalid selectedType",
          details: `selectedType must be one of: ${validTypes.join(", ")}`,
        },
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
      { error: "Internal server error", details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const notificationManager = NotificationManager.getInstance();
    const encoder = new TextEncoder();
    
    const stream = new ReadableStream({
      start(controller) {
        notificationManager.addConnection(controller);

        // Send initial heartbeat
        controller.enqueue(encoder.encode(`: heartbeat\n\n`));

        // Setup heartbeat interval
        const heartbeatInterval = setInterval(() => {
          try {
            controller.enqueue(encoder.encode(`: heartbeat\n\n`));
          } catch (error) {
            console.error('Heartbeat error:', error);
            clearInterval(heartbeatInterval);
            notificationManager.removeConnection(controller);
          }
        }, 10000);

        // Handle cleanup
        const originalClose = controller.close;
        controller.close = () => {
          clearInterval(heartbeatInterval);
          notificationManager.removeConnection(controller);
          originalClose.call(controller);
        };
      },
      cancel() {
        //@ts-expect-error IDK
        notificationManager.removeConnection(this);
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