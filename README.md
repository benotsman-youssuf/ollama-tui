# TUI Chat App

A simple terminal-based chat application built with React and Bun, utilizing Ollama for local language model interactions.

## Setup

1. **Clone the repository (if you haven't already).**

2. **Install dependencies**:

    ```bash
    bun install
    ```

3.  **Install Ollama and ensure the server is running**

    This project uses [Ollama](https://ollama.com/) to run language models locally. Follow the instructions on the Ollama website to download and install it for your operating system.

4.  **Run a language model with Ollama:**

    After installing Ollama, you'll need to pull a model. For example, to use the `llama2` model:

    ```bash
    ollama run llama2
    ```

    Ensure your Ollama server is running before starting the TUI Chat App.

## Running the Application

To start the development server:

```bash
bun run dev
```

The application should now be running in your terminal.

## Usage

-   Type your messages in the input bar at the bottom.
-   Press `Tab` to switch focus between the input bar and the model selection dropdown.
-   Use arrow keys to navigate the model selection dropdown and `Enter` to select a model.
-   Press `CTRL + S` to open the sidebar for chat history.
