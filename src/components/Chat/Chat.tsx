import { act, useEffect, useState } from "react";
import { useKeyboard } from "@opentui/react";

import ollama from "ollama";

interface Model {
  name: string;
  description?: string; // Add any other properties your model objects have
}

const Chat = () => {
  const [messages, setMessages] = useState<
    { sender: "user" | "ai"; content: string }[]
  >([]);
  const [value, setValue] = useState("");
  const [modelsList, setModelsList] = useState([]);
  const [focused, setFocused] = useState(false);
  const [activeModel, setActiveModel] = useState("");

  useKeyboard((key) => {
    if (key.name === "tab") {
      setFocused(!focused);
    }
  });

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("http://localhost:11434/api/tags");
        const data = await response.json();
        setModelsList(data.models);
        if (data.models.length > 0) {
          setActiveModel(data.models[0].name);
        }
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    };

    fetchModels();
  }, []);

  const respondToMessage = async (message: string) => {
    setMessages((prev) => [...prev, { sender: "ai", content: "" }]);
    const response = await ollama.chat({
      model: activeModel,
      messages: [{ role: "user", content: message }],
      stream: true,
    });

    for await (const part of response) {
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.sender === "ai") {
          return [
            ...prev.slice(0, -1),
            { ...lastMessage, content: lastMessage.content + part.message.content },
          ];
        }
        return prev;
      });
    }
  };

  const handleSubmit = (text: string) => {
    if (!text.trim()) return;

    // Add user's message
    setMessages((prev) => [...prev, { sender: "user", content: text }]);
    setValue("");

    // Ask AI
    respondToMessage(text);
  };

  return (
    <box
      style={{
        flexDirection: "column",
        height: "100%",
        width: "100%",
        backgroundColor: "black",
        padding: 1,
        gap: 1,
        alignItems: "center",
      }}
    >
      {/* Messages area */}
      <scrollbox
        style={{
          flexGrow: 1,
          paddingLeft: 3,
          paddingRight: 3,
          paddingTop: 1,
          paddingBottom: 1,

          backgroundColor: "#282a2e",
          width: "80%",
          maxHeight: "100%",
        }}
      >
        {messages.map((msg, i) => (
          <text
            key={i}
            style={{
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              margin: 0.5,

              maxWidth: "50%",
            }}
          >
            {msg.content}
          </text>
        ))}
      </scrollbox>
      <text>Active Model: {activeModel}</text>

      {/* Input bar */}
      <box
        style={{
          flexDirection: "column",
          width: "80%",
        }}
      >
        <select
          style={{ width: "80%", height: 2 , backgroundColor: "black"}}
          options={modelsList.map((model: Model) => ({
            name: model.name,
            description: model.description || "",
          }))}
          focused={focused}
          onChange={(index, option) => {
            setActiveModel(option?.name || "");
          }}
          onSelect={() => {
            setFocused(!focused);
          }}
        />

        <box
          style={{
            border: true,
            borderColor: "#282a2e",
            height: 3,
            width: "100%",
          }}
        >
          <input
            focused={!focused}
            value={value}
            onInput={setValue}
            onSubmit={handleSubmit}
          />
        </box>
      </box>
    </box>
  );
};

export default Chat;
