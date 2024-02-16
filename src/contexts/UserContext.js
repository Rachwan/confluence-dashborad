import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [checkUser, setCheckUser] = useState(true);
  const [userUpdated, setUserUpdated] = useState(false);

  useEffect(() => {
    if (!user || userUpdated) {
      fetchUserData();
    }
  }, [user, userUpdated]);

  const fetchUserData = async () => {
    try {
      setCheckUser(true);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_END}/logged-in-user`
      );
      setUser(response.data.user);
      console.log("Fetched user data:", response.data.user);
      setUserUpdated(false);
    } catch (err) {
      setUser(null);
    } finally {
      setCheckUser(false);
    }
  };

  const logout = async () => {
    await axios.post(`${process.env.REACT_APP_PATH}/logout`);
    setUser(null);
  };

  if (!user) {
    return <div>Loading image will here...</div>;
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        logout,
        fetchUserData,
        checkUser,
        setUserUpdated,
      }}>
      {children}
    </UserContext.Provider>
  );
};
