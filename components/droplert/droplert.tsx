'use client';
import * as React from 'react';
import { MyAlert } from './MyAlert';
import { useEffect, useState, useRef } from 'react';
import { MyAlertDialog } from './MyAlertDialog';
import { MyToast } from './MyToast';

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
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const initEventSource = () => {
      console.log('Initializing EventSource...');
      const eventSource = new EventSource('/api/droplert/notify');
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        console.log('Received message from SSE:', event.data);
        try {
          const data = JSON.parse(event.data);
          if (data) {
            console.log('Parsed notification data:', data);
            // Add a unique ID for each notification
            setAlertQueue((prevQueue) => [
              ...prevQueue,
              {
                id: data.id || crypto.randomUUID(), // Use provided ID or generate one
                title: data.title,
                description: data.description,
                selectedType: data.selectedType,
                backgroundColor: data.backgroundColor,
                textColor: data.textColor,
                borderColor: data.borderColor,
              },
            ]);
            console.log('Updated alert queue:', [...alertQueue, data]);
          }
        } catch (error) {
          console.error('Error parsing SSE data:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE error:', error);
        eventSource.close();
        
        // Attempt reconnection after 5 seconds
        console.log('Attempting to reconnect in 5 seconds...');
        setTimeout(() => {
          if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
            console.log('Reconnecting to EventSource...');
            initEventSource();
          }
        }, 5000);
      };
    };

    initEventSource();

    return () => {
      console.log('Cleaning up EventSource...');
      eventSourceRef.current?.close();
    };
  }, []);

  const handleCloseAlert = (id: string) => {
    console.log(`Closing alert with ID: ${id}`);
    setAlertQueue((prevQueue) => {
      const newQueue = prevQueue.filter(alert => alert.id !== id);
      console.log('Updated alert queue after closing:', newQueue);
      return newQueue;
    });
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
