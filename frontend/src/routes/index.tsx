import { Route, Routes } from "react-router-dom"
import { Dashboard } from "../page/Dashboard"
import { Login } from "../page/Login"
import { Register } from "../page/Register"

export const RouteApp = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}