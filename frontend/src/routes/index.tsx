import { Route, Routes } from "react-router-dom"
import { Dashboard } from "../page/Dashboard"
import { Login } from "../page/Login"
import { Register } from "../page/Register"
import { Schedules } from "../page/Schedules"
import { PrivateRoute } from "./PrivateRoutes"

export const RouteApp = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/schedules" element={<PrivateRoute><Schedules /></PrivateRoute>} />
    </Routes>
  )
}