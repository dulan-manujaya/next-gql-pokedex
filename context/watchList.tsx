import { createContext, useContext, useState } from "react";

const Context = createContext([]);

export const WatchListProvider = ({ children }) => {
  const [watchList, setWatchList] = useState([]);
  return (
    <Context.Provider value={[watchList, setWatchList]}>
      {children}
    </Context.Provider>
  );
};

export const useWatchListContext = () => {
  return useContext(Context);
};
