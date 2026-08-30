---
title: "AI Reference"
description: "## [ AIExtension ](#aiextension)"
topics:
  - "Recursos avancados"
keywords:
  - "AI Reference"
  - "AIExtension"
  - "useCreateBlockNote"
  - "chatProvider"
  - "transport"
  - "streamToolsProvider"
source_scope:
  - "https://www.blocknotejs.org/docs/features/ai/reference"
---

# [AI Reference](#ai-reference)

## [`AIExtension`](#aiextension)

Use `AIExtension` to create a new AI Extension that can be registered to an editor when calling `useCreateBlockNote`.

```tsx
// Usage:
useCreateBlockNote({
  // Register the AI extension
  extensions: [AIExtension(options)],
  // other editor options
});

type AIExtensionOptions = AIRequestHelpers & {
  /**
   * The name and color of the agent cursor when the AI is writing
   * @default { name: "AI", color: "#8bc6ff" }
   */
  agentCursor?: { name: string; color: string };
};

type AIRequestHelpers = {
  /**
   * Transport used by the AI SDK to send requests to your backend/LLM.
   * Implement to customize backend URLs or use a different transport (e.g. websockets).
   */
  transport?: ChatTransport<UIMessage>;

  /**
   * Use the ChatProvider to customize how the AI SDK Chat instance is created.
   * For example, when you want to reuse an existing Chat instance used in the rest of your application.
   *
   * @note you cannot use both `chatProvider` and `transport` together.
   */
  chatProvider?: () => Chat<UIMessage>;

  /**
   * Customize which stream tools are available to the LLM.
   */
  streamToolsProvider?: StreamToolsProvider<any, any>;
  // Provide `streamToolsProvider` in AIExtension(options) or override per call via InvokeAIOptions.
  // If omitted, defaults to using `aiDocumentFormats.html.getStreamToolsProvider()`.

  /**
   * Extra options (headers/body/metadata) forwarded to the AI SDK request.
   */
  chatRequestOptions?: ChatRequestOptions;

  /**
   * Build the serializable document state that will be forwarded to the backend.
   *
   * @default aiDocumentFormats.html.defaultDocumentStateBuilder
   */
  documentStateBuilder?: DocumentStateBuilder<any>;
};
```

## [`AIExtension` extension instance](#aiextension-extension-instance)

The `AIExtension` extension instance returned by `editor.getExtension(AIExtension)` exposes state and methods to interact with BlockNote's AI features.

```tsx
type AIExtensionInstance = {
  /**
   * Execute a call to an LLM and apply the result to the editor
   */
  invokeAI(opts: InvokeAIOptions): Promise<void>;

  /**
   * Returns a read-only Tanstack Store with the state of the AI Menu
   */
  get store(): Store<{
    aiMenuState:
      | ({
          /**
           * The ID of the block that the AI menu is opened at.
           * This changes as the AI is making changes to the document
           */
          blockId: string;
        } & (
          | {
              status: "error";
              error: any;
            }
          | {
              status:
                | "user-input"
                | "thinking"
                | "ai-writing"
                | "user-reviewing";
            }
        ))
      | "closed";
  }>;

  /**
   * Returns a Tanstack Store with the global configuration of the AI Extension.
   * These options are used by default across all LLM calls when calling {@link invokeAI}
   */
  readonly options: Store<AIRequestHelpers>;

  /** Open the AI menu at a specific block */
  openAIMenuAtBlock(blockID: string): void;
  /** Close the AI menu */
  closeAIMenu(): void;
  /** Accept the changes made by the LLM */
  acceptChanges(): void;
  /** Reject the changes made by the LLM */
  rejectChanges(): void;
  /** Retry the previous LLM call (only valid when status is "error") */
  retry(): Promise<void>;
  /** Abort the current LLM request */
  abort(reason?: any): Promise<void>;
  /** Advanced: manually update the status shown by the AI menu */
  setAIResponseStatus(
    status:
      | "user-input"
      | "thinking"
      | "ai-writing"
      | "user-reviewing"
      | { status: "error"; error: any },
  ): void;
};
```

### [`InvokeAI`](#invokeai)

Requests to an LLM are made by calling `invokeAI` on the `AIExtension` instance. This takes an `InvokeAIOptions` object as an argument.

```tsx
type InvokeAIOptions = {
  /** The user prompt */
  userPrompt: string;

  /** Whether to use the editor selection for the LLM call (default: true) */
  useSelection?: boolean;

  /**
   * If the user's cursor is in an empty paragraph, automatically delete it when the AI starts writing.
   * Used when typing `/ai` in an empty block. (default: true)
   */
  deleteEmptyCursorBlock?: boolean;
} & AIRequestHelpers; // Optionally override helpers per request
```

Because `InvokeAIOptions` extends `AIRequestHelpers`, you can override these options on a per-call basis without changing the global extension configuration.

## [`getStreamToolsProvider`](#getstreamtoolsprovider)

When an LLM is called, it needs to interpret the document and invoke operations to modify it. Use a format's `getStreamToolsProvider` to obtain the tools the LLM may call while editing. In most cases, use `aiDocumentFormats.html.getStreamToolsProvider(...)`.

```tsx
/** Return a provider for the stream tools available to the LLM */
type getStreamToolsProvider = (
  // Whether to add artificial delays between document edits
  // or apply them immediately as they're streamed in from the LLM without delays
  // (default: true)
  withDelays: boolean,
  // The stream tools to use, there are separate tools for adding, updating and deleting blocks
  // (default: { add: true, update: true, delete: true })
  defaultStreamTools?: {
    add?: boolean;
    update?: boolean;
    delete?: boolean;
  },
) => StreamToolsProvider;
```

## [Document state builders (advanced)](#document-state-builders-advanced)

When BlockNote AI sends a request it also forwards a serialized snapshot of the editor. LLMs use this document state to understand document, cursor position and active selection. The `DocumentStateBuilder` type defines how that snapshot is produced:

```tsx
type DocumentStateBuilder<T> = (
  aiRequest: Omit<AIRequest, "documentState">,
) => Promise<
  | {
      selection: false;
      blocks: BlocksWithCursor<T>[];
      isEmptyDocument: boolean;
    }
  | {
      selection: true;
      selectedBlocks: { id: string; block: T }[];
      blocks: { block: T }[];
      isEmptyDocument: boolean;
    }
>;
```

By default, `aiDocumentFormats.html.defaultDocumentStateBuilder` is used.

## [`AIRequest` (advanced)](#airequest-advanced)

`buildAIRequest` returns everything BlockNote AI needs to execute an AI call:

```tsx
type AIRequest = {
  editor: BlockNoteEditor;
  selectedBlocks?: Block[];
  emptyCursorBlockToDelete?: string;
  streamTools: StreamTool<any>[];
  documentState: DocumentState<any>;
  onStart: () => void;
};
```

## [`sendMessageWithAIRequest` (advanced)](#sendmessagewithairequest-advanced)

Use `sendMessageWithAIRequest` when you need to manually call the LLM without updating the state of the BlockNote AI menu.
For example, you could use this when you want to submit LLM requests from a different context (e.g.: a chat window).
`sendMessageWithAIRequest` is similar to `chat.sendMessages`, but it attaches the `documentState` to the outgoing message metadata, configures tool streaming, and forwards tool definitions (JSON Schemas) to your backend.

```tsx
async function sendMessageWithAIRequest(
  chat: Chat<UIMessage>,
  aiRequest: AIRequest,
  message?: Parameters<Chat<UIMessage>["sendMessage"]>[0],
  options?: Parameters<Chat<UIMessage>["sendMessage"]>[1],
): Promise<Result<void>>;
```

## [`buildAIRequest` (advanced)](#buildairequest-advanced)

Use `buildAIRequest` to assemble an `AIRequest` from editor state if you are bypassing `invokeAI` and call `sendMessageWithAIRequest` directly.

```tsx
async function buildAIRequest(opts: {
  editor: BlockNoteEditor;
  useSelection?: boolean;
  deleteEmptyCursorBlock?: boolean;
  streamToolsProvider?: StreamToolsProvider<any, any>;
  documentStateBuilder?: DocumentStateBuilder<any>;
  onBlockUpdated?: (blockId: string) => void;
  onStart?: () => void;
}): Promise<AIRequest>;
```
[

Custom AI Commands

Customize the AI menu items (commands) in your BlockNote rich text editor](/docs/features/ai/custom-commands)[

Built-in Blocks

BlockNote supports a variety of built-in block and inline content types that are included in the editor by default.](/docs/features/blocks)
