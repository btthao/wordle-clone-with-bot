import React, { createContext, useContext, useReducer } from "react";
import { initialState, reducer } from "./reducer";

export const StateContext = createContext<any>(null);


export const ContextProvider:({ children }: {
    children: JSX.Element;
}) => JSX.Element = ({ children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

export const useStateContext = () => useContext(StateContext);