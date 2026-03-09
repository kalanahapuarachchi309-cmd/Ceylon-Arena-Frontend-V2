import type { PropsWithChildren } from "react";
import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "../../context/AuthContext";
import { CustomToastProvider } from "../../shared/providers/CustomToastProvider";

const AppProviders = ({ children }: PropsWithChildren) => (
  <BrowserRouter>
    <CustomToastProvider>
      <AuthProvider>{children}</AuthProvider>
    </CustomToastProvider>
  </BrowserRouter>
);

export default AppProviders;
