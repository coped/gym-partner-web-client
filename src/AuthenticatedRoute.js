import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "context/auth";

export default function AuthenticatedRoute({ component: Component, ...rest }) {
  const { auth } = useAuth();
  return (
    <Route
      {...rest}
      render={(props) =>
        auth ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
}
