import "../App.css";

import RouterProvider from "./providers/RouterProvider";
import Toast from "../shared/components/toast/Toast";

const App = () => (
  <div className="App">
    <Toast />
    <RouterProvider />
  </div>
);

export default App;
