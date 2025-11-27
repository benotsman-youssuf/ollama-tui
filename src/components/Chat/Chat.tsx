import { act, useEffect, useState } from "react";
import { useKeyboard } from "@opentui/react";

import ollama from "ollama";

interface Model {
  name: string;
  // Add any other properties your model objects have
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
        const data = await response.json()
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
    const response = await ollama.chat({
      model: activeModel,
      messages: [{ role: "user", content: message }],
    });

    setMessages((prev) => [
      ...prev,
      { sender: "ai", content: response.message.content },
    ]);
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
        alignItems: "center",
      }}
    >
      {/* Messages area */}
      <scrollbox
        style={{
          flexGrow: 1,
          flexDirection: "column",
          justifyContent: "flex-end",
          overflow: "hidden",
          backgroundColor: "#282a2e",
          width: "80%",
          padding: 1,
        }}
      >
        {messages.map((msg, i) => (
          <text
            key={i}
            style={{
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              margin: 0.5,


              maxWidth:"50%"
            }}
          >
            {msg.content}
          </text>
        ))}
      </scrollbox>

      <text>{activeModel}</text>

      {/* Input bar */}
      <box
        style={{
          flexDirection: "row",
        }}
      >
        <box
          style={{
            border: true,
            borderColor: "#282a2e",
            height: 3,
            width: "70%",
            marginTop: 1,
          }}
        >
          <input
            focused={!focused}
            value={value}
            onInput={setValue}
            onSubmit={handleSubmit}
          />
        </box>
        <select
          style={{ width: "10%" }}
          options={modelsList.map(model => ({ name: model.name }))}
          focused={focused}
          onSelect={(index, option) => {
            setActiveModel(option?.name || "")
            setFocused(!focused)
          }}

        />
      </box>
    </box>
  );
};

export default Chat;
