import React, { createContext, useContext} from 'react'

const AppContext = createContext();

export default AppContext
  
  // Create a custom hook to easily consume the context
  export const useAppContext = () => {
    return useContext(AppContext);
  };