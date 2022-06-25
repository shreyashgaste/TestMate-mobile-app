import AuthcontextProvider from "./components/Context";
import Main from "./Main";
import React from 'react';

export default function App() {
  return (
    <AuthcontextProvider>
      <Main/>
    </AuthcontextProvider>
  );
}

