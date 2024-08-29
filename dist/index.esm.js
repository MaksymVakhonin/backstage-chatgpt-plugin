import { createRouteRef, createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

const rootRouteRef = createRouteRef({
  id: "chatgpt-frontend"
});

const chatgptFrontendPlugin = createPlugin({
  id: "chatgpt-frontend",
  routes: {
    root: rootRouteRef
  }
});
const ChatGPTFrontendPage = chatgptFrontendPlugin.provide(
  createRoutableExtension({
    name: "ChatGPTFrontendPage",
    component: () => import('./esm/index-f480f1d3.esm.js').then((m) => m.ChatGPTPage),
    mountPoint: rootRouteRef
  })
);

export { ChatGPTFrontendPage, chatgptFrontendPlugin };
//# sourceMappingURL=index.esm.js.map
