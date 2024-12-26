'use client';
import * as React from 'react';
import { MyAlert } from './MyAlert';
import { useEffect, useState, useRef } from 'react';
import { MyAlertDialog } from './MyAlertDialog';
import { MyToast } from './MyToast';

const Droplert: React.FC = () => {
  const [alertQueue, setAlertQueue] = useState<
    {
      title: string;
      description: string;
      selectedType: string;
      backgroundColor: string;
      textColor: string;
      borderColor: string;
    }[]
  >([]);
  const [currentAlert, setCurrentAlert] = useState<typeof alertQueue[0] | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const initEventSource = () => {
      const eventSource = new EventSource('/api/droplert/notify');
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data) {
            setAlertQueue((prevQueue) => [
              ...prevQueue,
              {
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

  useEffect(() => {
    if (!currentAlert && alertQueue.length > 0) {
      // Display the next alert in the queue
      setCurrentAlert(alertQueue[0]);
      setAlertQueue((prevQueue) => prevQueue.slice(1));
    }
  }, [currentAlert, alertQueue]);

  const handleCloseAlert = () => {
    setCurrentAlert(null);
  };

  return (
    <div>
      {currentAlert?.selectedType === 'ALERT' && (
        <MyAlert
          title={currentAlert.title}
          description={currentAlert.description}
          backgroundColor={currentAlert.backgroundColor}
          textColor={currentAlert.textColor}
          borderColor={currentAlert.borderColor}
          onClose={handleCloseAlert}
        />
      )}
      {currentAlert?.selectedType === 'ALERT_DIALOG' && (
        <MyAlertDialog
          isOpen={true}
          title={currentAlert.title}
          description={currentAlert.description}
          backgroundColor={currentAlert.backgroundColor}
          textColor={currentAlert.textColor}
          borderColor={currentAlert.borderColor}
          onClose={handleCloseAlert}
        />
      )}
      {currentAlert?.selectedType === 'TOAST' && (
        <MyToast
          isOpen={true}
          preview={false}
          title={currentAlert.title}
          description={currentAlert.description}
          backgroundColor={currentAlert.backgroundColor}
          textColor={currentAlert.textColor}
          borderColor={currentAlert.borderColor}
          onClose={handleCloseAlert}
        />
      )}
    </div>
  );
};

export default Droplert;