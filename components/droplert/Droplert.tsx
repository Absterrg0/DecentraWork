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
      selectedType:string;
      backgroundColor: string;
      textColor: string;
      borderColor: string;
    }[]
  >([]);
  const [currentAlert, setCurrentAlert] = useState<typeof alertQueue[0] | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Initialize the EventSource
    eventSourceRef.current = new EventSource('/api/droplert/notify');

    // Handle incoming messages
    eventSourceRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setAlertQueue((prevQueue) => [
          ...prevQueue,
          {
            title: data.title,
            description: data.description,
            selectedType:data.selectedType,
            backgroundColor: data.backgroundColor,
            textColor: data.textColor,
            borderColor: data.borderColor,
          },
        ]);
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    // Handle errors (e.g., network issues) and optionally attempt reconnection
    eventSourceRef.current.onerror = (error) => {
      console.error('SSE error:', error);
      eventSourceRef.current?.close();
      setTimeout(() => {
        eventSourceRef.current = new EventSource('/api/droplert/notify');
      }, 5000); // Attempt reconnection after 5 seconds
    };

    return () => {
      eventSourceRef.current?.close(); // Clean up on component unmount
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
      {currentAlert?.selectedType==='alert' && (
                <MyAlert
                  title={currentAlert.title}
                  description={currentAlert.description}
                  backgroundColor={currentAlert.backgroundColor}
                  textColor={currentAlert.textColor}
                  borderColor={currentAlert.borderColor}
                  onClose={handleCloseAlert}
                />
      )}
      {currentAlert?.selectedType==='alert-dialog' && (
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
      {currentAlert?.selectedType==='toast' && (
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
