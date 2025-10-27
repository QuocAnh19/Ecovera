import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppRoutes from "./Routes/AppRoutes";

import "./App.scss";

export default function App() {
  return (
    <div className="app">
      <AppRoutes />
    </div>
  );
}
