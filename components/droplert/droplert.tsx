'use client';
import * as React from 'react';
import { MyAlert } from './MyAlert';
import { useEffect, useState } from 'react';
import { MyAlertDialog } from './MyAlertDialog';
import { MyToast } from './MyToast';

type Notification = {
  id:string
  title: string;
  description: string;
  selectedType: string;
  style?: string; // Optional field
  backgroundColor: string;
  textColor: string;
  borderColor: string;
};
const Droplert: React.FC = () => {
  const [alertQueue, setAlertQueue] = useState<
    {
      id: string; // Unique identifier for each alert
      title: string;
      description: string;
      selectedType: string;
      backgroundColor: string;
      textColor: string;
      borderColor: string;
    }[]
  >([]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/droplert/notify'); // Your long polling endpoint
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      
      if (data.length > 0) {
        setAlertQueue((prevQueue) => [
          ...prevQueue,
          ...data.map((notif: Notification) => ({
            id: notif.id || crypto.randomUUID(), // Generate a unique ID if not present
            title: notif.title,
            description: notif.description,
            selectedType: notif.selectedType,
            backgroundColor: notif.backgroundColor,
            textColor: notif.textColor,
            borderColor: notif.borderColor,
          })),
        ]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      // Immediately call fetchNotifications again to continue long polling
      fetchNotifications();
    }
  };

  useEffect(() => {
    fetchNotifications(); // Start long polling on component mount

    return () => {
      // Cleanup logic can be added here if needed
    };
  }, []);

  const handleCloseAlert = (id: string) => {
    console.log(`Closing alert with ID: ${id}`);
    setAlertQueue((prevQueue) => prevQueue.filter(alert => alert.id !== id));
  };

  return (
    <div>
      {alertQueue.map((alert) => (
        <div key={alert.id}>
          {alert.selectedType === 'ALERT' && (
            <MyAlert
              title={alert.title}
              description={alert.description}
              backgroundColor={alert.backgroundColor}
              textColor={alert.textColor}
              borderColor={alert.borderColor}
              onClose={() => handleCloseAlert(alert.id)}
            />
          )}
          {alert.selectedType === 'ALERT_DIALOG' && (
            <MyAlertDialog
              isOpen={true}
              title={alert.title}
              description={alert.description}
              backgroundColor={alert.backgroundColor}
              textColor={alert.textColor}
              borderColor={alert.borderColor}
              onClose={() => handleCloseAlert(alert.id)}
            />
          )}
          {alert.selectedType === 'TOAST' && (
            <MyToast
              isOpen={true}
              preview={false}
              title={alert.title}
              description={alert.description}
              backgroundColor={alert.backgroundColor}
              textColor={alert.textColor}
              borderColor={alert.borderColor}
              onClose={() => handleCloseAlert(alert.id)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Droplert;
