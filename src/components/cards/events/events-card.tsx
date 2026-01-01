import { useEffect, useState } from "react";

// shape of events from the yamcs backend
interface YamcsEvent {
  severity: string;
  createdBy: string;
  source: string;
  generationTime: string;
  receptionTime: string;
  seqNumber: number;
  message: string;
}

export function EventsCard() {
  const [events, setEvents] = useState<YamcsEvent[]>([]);

  // getting initial events from yamcs backend
  useEffect(() => {
    fetch("http://localhost:8090/api/archive/mqtt-frames/events?limit=50")
      .then((response) => response.json())
      .then((data) => {
        console.log(data.events);
        setEvents(data.events);
      })
      .catch((error) => console.error("Error fetching initial events", error));
  }, []);

  // NEEDS WORK. NOT WORKING AS IS.
  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:8090/api/websocket");

    // called when the connection opens
    websocket.onopen = () => {
      // subscribing to the events stream
      websocket.send(
        JSON.stringify({
          type: "subscribe",
          resource: "events",
          instance: "mqtt-frames",
          processor: "realtime",
        }),
      );
    };

    // update events list each time a new event is retrieved from the backend
    websocket.onmessage = (e) => {
      // turn data into JSON object
      const result = JSON.parse(e.data);

      // update events list
      if (result.events) setEvents((prev) => [...result.events, ...prev]);
    };

    websocket.onerror = (err) => {
      console.error("Websocket error", err);
    };

    return;
    /*
        () => {
            websocket.close();
        };*/
  }, []);

  return (
    <ul>
      {events.length === 0 && "Waiting for events..."}
      {events.map((e, i) => (
        <li key={i}>{e.severity}</li>
      ))}
    </ul>
  );
}
