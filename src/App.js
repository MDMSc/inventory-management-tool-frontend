import React, { useReducer } from "react";
import Reducer from "./reducer/Reducer";
import ParentContext from "./reducer/Context";
import Containers from "./containers/Containers";

const App = () => {
  const [state, dispatch] = useReducer(Reducer, {
    isLogged: false,
    isAdmin: false,
  });

  return (
    <ParentContext.Provider value={{ state, dispatch }}>
      <Containers />
    </ParentContext.Provider>
  );
};

export default App;
