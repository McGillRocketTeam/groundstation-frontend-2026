import { useEffect, useState } from "react";
import mqtt from "mqtt";
import { Button } from "@/components/ui/button";
import { JSONTree } from "react-json-tree";
import type { IDockviewPanelProps } from "dockview-react";
import { MqttDebugCardConfiguration } from ".";

export function MqttDebugCard(
  _props: IDockviewPanelProps<typeof MqttDebugCardConfiguration.Type>,
) {
  const [treeData, setTreeData] = useState<Record<string, any>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);

  useEffect(() => {
    // WebSocket MQTT endpoint for Yamcs / Mosquitto broker
    const brokerUrl = "ws://test.mosquitto.org:8080/mqtt";

    const mqttClient = mqtt.connect(brokerUrl);

    mqttClient.on("connect", () => {
      console.log("✅ Connected to MQTT broker");
      setIsConnected(true);

      // Subscribe to all topics; use "yamcs-tm/#" if you only want telemetry
      mqttClient.subscribe("#", (err) => {
        if (err) console.error("Subscription error:", err);
      });
    });

    mqttClient.on("message", (topic, payload) => {
      let data: any;

      try {
        // Try to parse JSON messages
        data = JSON.parse(payload.toString());
      } catch {
        // Keep as string if not JSON
        data = payload.toString();
      }

      // Add metadata
      data = { value: data, meta: { topic, time: new Date().toISOString() } };

      // Build nested tree structure from topic path
      setTreeData((prev) => {
        const parts = topic.split("/");
        const newTree = { ...prev };
        let node = newTree;

        for (let i = 0; i < parts.length - 1; i++) {
          const part = parts[i];
          node[part] = node[part] || {};
          node = node[part];
        }

        node[parts[parts.length - 1]] = data;
        return newTree;
      });
    });

    mqttClient.on("error", (err) => {
      console.error("MQTT Error:", err);
    });

    setClient(mqttClient);

    return () => {
      mqttClient.end();
    };
  }, []);

  return (
    <div className="h-full w-full overflow-auto p-2">
      <div className="flex flex-row gap-2 mb-2">
        <Button
          onClick={() => {
            if (client && isConnected) client.end();
          }}
        >
          Disconnect
        </Button>

        <Button
          onClick={() => {
            if (!client || !isConnected) window.location.reload();
          }}
        >
          Reconnect
        </Button>
      </div>

      {!isConnected && <div>Connecting to MQTT broker...</div>}

      {isConnected && (
        <div className="font-mono text-sm">
          <JSONTree data={treeData} hideRoot theme="bright" />
        </div>
      )}
    </div>
  );
}
