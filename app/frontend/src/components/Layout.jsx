
Action: file_editor create /app/frontend/src/components/Layout.jsx --file-text "import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Toaster } from 'sonner';

export default function Layout({ children }) {
  return (
    <div className=\"min-h-screen flex flex-col bg-mr-bg\">
      <Header />
      <main className=\"flex-1\">{children}</main>
      <Footer />
      <Toaster position=\"top-right\" theme=\"light\" richColors closeButton />
    </div>
  );
}
"
Observation: Create successful: /app/frontend/src/components/Layout.jsx