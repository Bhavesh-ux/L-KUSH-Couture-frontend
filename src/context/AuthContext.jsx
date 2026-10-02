import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const restoreSession = async () => {
    const storedOwner = authService.getCurrentOwner();

    if (storedOwner) {
      setOwner(storedOwner);
    }

    const restoredCustomer = await authService.restoreCustomerSession();

    if (restoredCustomer) {
      setCustomer(restoredCustomer);
    }

    setLoading(false);
  };

  restoreSession();
}, []);

  const loginCustomer = async (email, password, rememberMe) => {
    const result = await authService.loginCustomer(email, password, rememberMe);
    setCustomer(result.customer);
    return result;
  };

  const signupCustomer = async (customerData) => {
    const result = await authService.signupCustomer(customerData);
    setCustomer(result.customer);
    return result;
  };

  const logoutCustomer = () => {
    authService.logoutCustomer();
    setCustomer(null);
  };

  const updateProfile = async (data) => {
    const updated = await authService.updateCustomerProfile(data);
    setCustomer(updated);
    return updated;
  };

  // Owner authentication
  const loginOwner = async (email, password) => {
    const result = await authService.loginOwner(email, password);
    setOwner(result.owner);
    return result;
  };

  const logoutOwner = () => {
    authService.logoutOwner();
    setOwner(null);
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        owner,
        isAuthenticated: !!customer,
        isOwnerAuthenticated: !!owner,
        loading,
        loginCustomer,
        signupCustomer,
        logoutCustomer,
        updateProfile,
        loginOwner,
        logoutOwner
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
