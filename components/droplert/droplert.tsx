'use client';
import * as React from 'react';
import { MyAlert } from './MyAlert';
import { useEffect, useState, useRef } from 'react';
import { MyAlertDialog } from './MyAlertDialog';
import { MyToast } from './MyToast';

const Droplert: React.FC = () => {
  const [alertQueue, setAlertQueue] = useState<
    {
      id: string; // Added unique identifier for each alert
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
      const eventSource = new EventSource('/api/droplert/notify');
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data) {
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
          }
        } catch (error) {
          console.error('Error parsing SSE data:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE error:', error);
        eventSource.close();

        // Attempt reconnection after 5 seconds
        setTimeout(() => {
          if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
            initEventSource();
          }
        }, 5000);
      };
    };

    initEventSource();

    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  const handleCloseAlert = (id: string) => {
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
