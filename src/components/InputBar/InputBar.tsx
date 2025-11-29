interface Model {
  name: string;
  description?: string;
}

interface InputBarProps {
  value: string;
  onInput: (value: string) => void;
  onSubmit: (value: string) => void;
  modelsList: Model[];
  activeModel: string;
  onModelChange: (modelName: string) => void;
  focused: boolean;
  onFocusChange: (focused: boolean) => void;
}

export const InputBar = ({
  value,
  onInput,
  onSubmit,
  modelsList,
  activeModel,
  onModelChange,
  focused,
  onFocusChange,
}: InputBarProps) => {
  return (
    <box
      style={{
        flexDirection: "column",
        width: "80%",
      }}
    >
      <box style={{ width: "100%", flexDirection: "row", height: 2 }}>
        <select
          style={{
            width: "93%",
          }}
          options={modelsList.map((model: Model) => ({
            name: model.name,
            description: model.description || "",
          }))}
          focused={focused}
          onChange={(_, option) => {
            onModelChange(option?.name || "");
          }}
          onSelect={() => {
            onFocusChange(!focused);
          }}
        />
        <box
          style={{
            flexDirection: "column",
            width: "7%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#354455",
            height: '100%',
          }}
        >
          <text>{focused ? '↑↓' : '⇥'}</text>
          <text>
            {focused ? 'navigate' : 'select'}
          </text>
        </box>
      </box>
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
          onChange={onInput}
          onSubmit={onSubmit}
        />
      </box>
    </box>
  );
};

export default InputBar;
