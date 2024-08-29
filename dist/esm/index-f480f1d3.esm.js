import React, { createContext, useReducer, useContext } from 'react';
import { MarkdownContent, Header } from '@backstage/core-components';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import axios from 'axios';
import { Button, Slider, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ":root {\n    --text-primary: #2E77D0;\n}\n\n.get-started {\n    background-color: #f1f1f1;\n    width: 20%;\n    min-width: 250px;\n    padding: 5px 20px 5px 20px;\n    height: 100%;\n}\n\n.system-prompt {\n    height: 75%;\n    width: 30%; \n    min-width: 300px;\n    max-width: 400px;\n}\n.system-prompt textarea {\n    resize: none;\n    width: 100%;\n    height: 76VH;\n    background-color: rgb(255, 255, 255);\n    font-size: larger;\n    padding: 15px;\n}\n.system-prompt h2 {\n    padding-left: 10px;\n}\n\n.chat-pannel {\n    display: flex;\n    flex-direction: column;\n    width: 60%;\n    min-width: 500px;\n    margin: 70px 30px 0px 30px;\n    height: 85vh;\n}\n.user-input{\n    display: flex;\n    flex-direction: row;\n    margin-bottom: 2rem;\n}\n\n.chat-pannel button {\n    width: fit-content;\n    /* margin: 5px 5px 0px 0px; */\n}\n\n.chat-pannel textarea {\n    width: 100%;\n    height: 50px; \n    resize: none; \n    padding: 10px; \n    font-size: 14px; \n    border: 1px solid #ccc; \n    border-radius: 4px; \n    overflow: hidden;\n    box-sizing: border-box; \n    margin-right: 1rem;\n}\n\n.messages {\n    width:100%;\n    height: 67vh;\n    overflow: auto;\n}\n\n.chat-message {\n    display: inline-block;\n    width: 100%;\n}\n  \n.chat-message > div {\n    resize: none;\n    min-height: 20px;\n    width: 100%;\n    box-sizing: border-box;\n    border: 1px solid #ccc;\n    padding: 10px;\n    overflow: hidden;\n    white-space: pre-wrap;\n    word-wrap: break-word;\n    overflow-wrap: break-word;\n    outline: none;\n    background-color: rgb(255, 255, 255);\n  }\n\n.settings {\n    background-color: #f1f1f1;\n    width: 30%;\n    min-width: 200px;\n    max-width: 300px;\n    margin-top: 20px;\n    padding: 30px;\n    height: 100%;\n    padding: 5px 20px 5px 20px;\n}\n\n.settings-module-label{\n    font-size: 1.2rem !important;\n    font-weight:700 !important;\n}\n\n.settings-module-select input{\n    margin-top: 80px;\n}\n.chatgpt-playground{\n    position: relative;\n    display: flex;\n    flex-direction: row;\n    justify-content: space-between;\n    min-width: 800px;\n    width: 100%;\n    height: 50vh;\n    padding: 0 10px;\n}\n\n.button-pannel {\n    display: flex;\n    flex-direction: row;\n    justify-content: flex-start;\n    width: fit-content;\n    align-items: center;\n}\n\n.button-pannel button {\n    margin-right: 10px;\n}\n\n.error {\n    z-index: 1;\n    width: 100%;\n    background-color: rgb(172, 74, 74);\n    color: white;\n    text-align: center;\n    padding: 10px;\n    font-size: 1.5em;\n    opacity: 1;\n    transition: transform 1s ease-in-out, opacity 1s, max-height 1s 0s;\n    transform: translateY(-100%);\n    max-height: 100px;\n}\n\n.error.show {\n    transform: translateY(0);\n    opacity: 1;\n}\n  \n.error.hide {\n    transform: translateY(-100%);\n    opacity: 0;\n    max-height: 0;\n}\n  \n.loading:after {\n    content: \" \";\n    display: inline-block;\n    width: 24px;\n    height: 24px;\n    border-radius: 50%;\n    border: 2px solid var(--text-primary);\n    border-color: var(--text-primary) transparent var(--text-primary) transparent;\n    animation: lds-dual-ring 1.2s linear infinite;\n}\n@keyframes lds-dual-ring {\n    0% {\n        transform: rotate(0deg);\n    }\n    100% {\n        transform: rotate(360deg);\n    }\n}  \n\n\n\n\n  ";
styleInject(css_248z);

const getChatGptCompletion = (baseUrl, model, messages, temperature, maxTokens) => {
  return axios.get(`${baseUrl}/api/chatgpt/completions`, {
    params: {
      model,
      messages,
      temperature,
      maxTokens
    }
  });
};

const initialState = {
  model: "gpt-3.5-turbo",
  temperature: 0.8,
  maxTokens: 256,
  userMessage: "",
  systemPrompt: "",
  isChatStarted: false,
  messages: [{ "role": "system", "content": "" }]
};
const UPDATE_TEMPERATURE = "UPDATE_TEMPERATURE";
const UPDATE_MAX_TOKENS = "UPDATE_MAX_TOKENS";
const UPDATE_USER_MESSAGE = "UPDATE_USER_MESSAGE";
const UPDATE_MESSAGE_CHAT = "UPDATE_MESSAGE_CHAT";
const RESET_MESSAGE_CHAT = "RESET_MESSAGE_CHAT";
const UPDATE_SYSTEM_PROMPT = "UPDATE_SYSTEM_PROMPT";
const playgroundReducer = (state, action) => {
  switch (action.type) {
    case UPDATE_TEMPERATURE:
      return {
        ...state,
        temperature: action.payload.temperature
      };
    case UPDATE_MAX_TOKENS:
      return {
        ...state,
        maxTokens: action.payload.maxTokens
      };
    case UPDATE_USER_MESSAGE:
      return {
        ...state,
        userMessage: action.payload.userMessage
      };
    case UPDATE_MESSAGE_CHAT:
      return {
        ...state,
        messages: [...state.messages, ...action.payload.newMessages],
        isChatStarted: true
      };
    case RESET_MESSAGE_CHAT:
      return {
        ...state,
        messages: [],
        isChatStarted: false
      };
    case UPDATE_SYSTEM_PROMPT:
      const systemMessage = { "role": "system", "content": action.payload.systemPrompt };
      const newState = {
        ...state,
        systemPrompt: action.payload.systemPrompt
      };
      newState.messages[0] = systemMessage;
      return newState;
    default:
      return { ...state };
  }
};
const PlaygroundContext = createContext({
  state: initialState,
  dispatch: () => null
});
const PlaygroundProvider = ({ children }) => {
  const [state, dispatch] = useReducer(playgroundReducer, initialState);
  return /* @__PURE__ */ React.createElement(PlaygroundContext.Provider, { value: { state, dispatch } }, children);
};

const ChatPannel = ({ onSubmit, resetForm, loading, isSuccess }) => {
  var _a;
  const { state, dispatch } = useContext(PlaygroundContext);
  const PLACEHOLDER = "Add message...";
  const handleChange = (event) => {
    dispatch({ type: UPDATE_USER_MESSAGE, payload: { userMessage: event.target.value } });
  };
  const onSubmitHandler = () => {
    onSubmit();
    dispatch({ type: UPDATE_USER_MESSAGE, payload: { userMessage: "" } });
  };
  return /* @__PURE__ */ React.createElement("div", { className: "chat-pannel" }, /* @__PURE__ */ React.createElement("div", { className: "chat-pannel-input" }, /* @__PURE__ */ React.createElement("div", { className: "user-input" }, /* @__PURE__ */ React.createElement(
    "textarea",
    {
      onChange: (e) => handleChange(e),
      value: state.userMessage,
      placeholder: PLACEHOLDER
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "button-pannel" }, /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: "outlined",
      color: "primary",
      disabled: isSuccess || loading,
      onClick: () => onSubmitHandler()
    },
    !loading && "Submit",
    !!loading && /* @__PURE__ */ React.createElement("div", { className: "loading" })
  ), /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: "outlined",
      color: "primary",
      onClick: () => resetForm()
    },
    "Reset"
  )))), /* @__PURE__ */ React.createElement("div", { className: "messages" }, ((_a = state.messages) == null ? void 0 : _a.length) > 0 && state.isChatStarted && state.messages.map((message) => {
    return /* @__PURE__ */ React.createElement(Message, { key: message.content, role: message.role, content: message.content });
  })));
};
const Message = ({ role, content }) => {
  return /* @__PURE__ */ React.createElement("div", { className: "chat-message" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      contentEditable: false,
      role: "textbox",
      tabIndex: 0,
      "aria-multiline": true
    },
    /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("b", null, role.charAt(0).toUpperCase() + role.slice(1)), " :", /* @__PURE__ */ React.createElement(MarkdownContent, { content }))
  ));
};

const SettingsPanel = () => {
  const { state, dispatch } = useContext(PlaygroundContext);
  return /* @__PURE__ */ React.createElement("div", { className: "settings" }, /* @__PURE__ */ React.createElement("h2", null, "Settings"), /* @__PURE__ */ React.createElement(ModuleSetting, null), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("b", null, "Temperature: ", state.temperature)), /* @__PURE__ */ React.createElement(Slider, { "aria-label": "Volume", value: state.temperature * 100, onChange: (_, value) => dispatch({ type: UPDATE_TEMPERATURE, payload: { temperature: value / 100 } }) }), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("b", null, "Max Tokens: ", state.maxTokens)), /* @__PURE__ */ React.createElement(Slider, { "aria-label": "Max Tokens", value: state.maxTokens / 40, onChange: (_, value) => dispatch({ type: UPDATE_MAX_TOKENS, payload: { maxTokens: value * 40 } }) }));
};
const ModuleSetting = () => {
  return /* @__PURE__ */ React.createElement(FormControl, { disabled: true }, /* @__PURE__ */ React.createElement(InputLabel, { className: "settings-module-label", id: "setting-module-label" }, "Model"), /* @__PURE__ */ React.createElement(
    Select,
    {
      labelId: "settings-module-label",
      id: "settings-module",
      value: "default",
      label: "Age"
    },
    /* @__PURE__ */ React.createElement(MenuItem, { value: "default" }, /* @__PURE__ */ React.createElement("em", null, "gpt-3.5-turbo"))
  ));
};

const SystemPrompt = () => {
  const { state, dispatch } = useContext(PlaygroundContext);
  const PLACEHOLDER = "Act as a Spring expert assistant";
  const handleChange = (event) => {
    dispatch({ type: UPDATE_SYSTEM_PROMPT, payload: { systemPrompt: event.target.value } });
  };
  return /* @__PURE__ */ React.createElement("div", { className: "system-prompt" }, /* @__PURE__ */ React.createElement("h2", null, "System Prompt"), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      onChange: (e) => handleChange(e),
      placeholder: PLACEHOLDER,
      disabled: state.isChatStarted
    }
  ));
};

const ChatGptPlayground = ({ showErrorMessage }) => {
  const config = useApi(configApiRef);
  const baseUrl = config.getString("backend.baseUrl");
  const { state, dispatch } = React.useContext(PlaygroundContext);
  const [loading, setLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const onSubmit = async () => {
    setLoading(true);
    const userMessge = { role: "user", content: state.userMessage };
    const messageHistory = [...state.messages, userMessge];
    getChatGptCompletion(baseUrl, state.model, messageHistory, state.temperature, state.maxTokens).then((response) => {
      var _a;
      const systemContent = (_a = response.data) == null ? void 0 : _a.completion[0].message.content;
      const assistantMessage = { role: "Assistant", content: systemContent };
      dispatch({ type: UPDATE_MESSAGE_CHAT, payload: { newMessages: [userMessge, assistantMessage] } });
      setLoading(false);
      setIsSuccess(true);
    }).catch((e) => {
      setLoading(false);
      setIsSuccess(false);
      showErrorMessage();
    });
  };
  const resetPage = () => {
    setLoading(false);
    setIsSuccess(false);
    dispatch({ type: RESET_MESSAGE_CHAT });
  };
  return /* @__PURE__ */ React.createElement("div", { className: "chatgpt-playground" }, /* @__PURE__ */ React.createElement(SystemPrompt, null), /* @__PURE__ */ React.createElement(
    ChatPannel,
    {
      onSubmit,
      loading,
      isSuccess,
      resetForm: () => resetPage()
    }
  ), /* @__PURE__ */ React.createElement(SettingsPanel, null));
};

const ChatGPTPage = () => {
  const [error, setError] = React.useState(false);
  const showErrorMessage = () => {
    setError(true);
    setTimeout(() => setError(false), 2e3);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "chatgpt-page" }, /* @__PURE__ */ React.createElement(Header, { title: "ChatGPT Playground", subtitle: "Build anything from just a quick description" }), /* @__PURE__ */ React.createElement("div", { className: `error ${error ? "show" : "hide"}` }, "An error occurred. Please try again."), /* @__PURE__ */ React.createElement(PlaygroundProvider, null, /* @__PURE__ */ React.createElement(ChatGptPlayground, { showErrorMessage })));
};

export { ChatGPTPage };
//# sourceMappingURL=index-f480f1d3.esm.js.map
