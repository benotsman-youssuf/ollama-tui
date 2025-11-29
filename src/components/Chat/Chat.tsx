import { act, useEffect, useState } from "react";
import { useKeyboard } from "@opentui/react";
import ollama from "ollama";
import { theme } from "../../theme";

interface Model {
  name: string;
  description?: string; // Add any other properties your model objects have
}

const Chat = () => {
  const [messages, setMessages] = useState<
    { sender: "user" | "ai"; content: string }[]
  >([]);
  const [value, setValue] = useState("");
  const [modelsList, setModelsList] = useState<Model[]>([]);
  const [focused, setFocused] = useState(false);
  const [activeModel, setActiveModel] = useState("");
  const [loading, setLoading] = useState(false);

  useKeyboard((key) => {
    if (key.name === "tab") {
      setFocused(!focused);
    }
  });

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("http://localhost:11434/api/tags");
        const data = (await response.json()) as { models: Model[] };
        setModelsList(data.models);
        if (data.models.length > 0) {
          setActiveModel(data.models[0]?.name || "");
        }
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    };

    fetchModels();
  }, []);

  const history = messages.map((msg) => ({ content: msg.content }));

  const respondToMessage = async (message: string) => {
    setLoading(true);
    setMessages((prev) => [...prev, { sender: "ai", content: "" }]);
    const historyText = messages
      .map((msg) => `${msg.sender}: ${msg.content}`)
      .join("\n");
    const response = await ollama.chat({
      model: activeModel,
      messages: [
        {
          role: "user",
          content: `History:\n${historyText}\n\nUser's new message: ${message}`,
        },
      ],
      stream: true,
    });

    setLoading(false);
    for await (const part of response) {
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.sender === "ai") {
          return [
            ...prev.slice(0, -1),
            {
              ...lastMessage,
              content: lastMessage.content + part.message.content,
            },
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
        backgroundColor: theme.colors.background,
        padding: 1,
        gap: 1,
        alignItems: "center",
      }}
    >
      <text>Active Model: {activeModel} </text>
      
      
      {/* Messages area */}
      <scrollbox
        style={{
          flexGrow: 1,
          paddingLeft: 3,
          paddingRight: 3,
          paddingTop: 1,
          paddingBottom: 1,
          backgroundColor: theme.colors.backgroundPanel,
          width: "80%",
          maxHeight: "85%",
        }}
      >
        {
          messages.map((msg, i) => {
            const isUser = msg.sender === "user";
            const isLastMessage = i === messages.length - 1;
            const showLoading = !isUser && loading && isLastMessage;
            
            return (
              <text
                key={i}
                style={{
                  alignSelf: isUser ? "flex-end" : "flex-start",
                  margin: 0.5,
                  maxWidth: isUser ? "50%" : "100%",
                }}
              >
                {isUser ? '> ' : ''}{showLoading ? "..." : msg.content}
              </text>
            );
          })
        }
      </scrollbox>

      {/* Input bar */}
      <box
        style={{
          flexDirection: "column",
          width: "80%",
        }}
      >
        <select
        
          style={{
            width: "100%",
            height: 2,
          }}
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
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: 3,
            backgroundColor: "#1a1a1a",
            padding: 1,
          }}
        >
          <input
            style={{
              width: "100%",
              height: 2,
            }}
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

