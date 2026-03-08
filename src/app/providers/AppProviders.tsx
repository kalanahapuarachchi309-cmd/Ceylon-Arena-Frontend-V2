import type { PropsWithChildren } from "react";
import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "../../context/AuthContext";

const AppProviders = ({ children }: PropsWithChildren) => (
  <BrowserRouter>
    <AuthProvider>{children}</AuthProvider>
  </BrowserRouter>
);

export default AppProviders;

