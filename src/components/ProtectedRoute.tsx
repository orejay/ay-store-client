import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { setPrevPage } from "state";
import { useAppDispatch } from "store";

interface Props {
  children: React.ReactElement;
  allowedRoles?: string[];
}

interface UserData {
  role: string;
  token: string;
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const user: UserData | null = JSON.parse(
    localStorage.getItem("user") || "null"
  ) as UserData | null;

  if (!user?.token) {
    dispatch(setPrevPage(pathname));
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
