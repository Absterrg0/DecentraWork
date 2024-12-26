// app/api/notifications/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Define a type for the notification
type Notification = {
  title: string;
  description: string;
  selectedType: string;
  style?: string; // Optional field
  backgroundColor: string;
  textColor: string;
  borderColor: string;
};

// Array to temporarily store notifications
let notifications: Notification[] = [];
const MAX_WAIT_TIME = 30000; // Maximum wait time for long polling (30 seconds)

export async function POST(req: NextRequest) {
  try {
    const body: Notification = await req.json(); // Type assertion for the body
    const { title, description, selectedType, style, backgroundColor, textColor, borderColor } = body;

    // Store the notification
    notifications.push({
      title,
      description,
      selectedType,
      style,
      backgroundColor,
      textColor,
      borderColor,
    });

    console.log('Received notification:', body);

    return NextResponse.json({
      msg: "Notification successful",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({
      msg: "Error while receiving the notification",
    });
  }
}

export async function GET() {
  return new Promise<NextResponse>((resolve) => {
    const timeout = setTimeout(() => {
      // Respond with an empty array if no notifications after MAX_WAIT_TIME
      resolve(NextResponse.json([]));
    }, MAX_WAIT_TIME);

    // Check for new notifications
    const checkForNotifications = () => {
      if (notifications.length > 0) {
        clearTimeout(timeout); // Clear the timeout if we have notifications
        const newNotifications = [...notifications]; // Copy current notifications
        notifications = []; // Clear the notifications array for future requests
        resolve(NextResponse.json(newNotifications)); // Respond with new notifications
      } else {
        setTimeout(checkForNotifications, 1000); // Check again after 1 second
      }
    };

    checkForNotifications();
  });
}
