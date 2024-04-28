import React, { createContext, useContext, useEffect, useState } from 'react';
import supabase from '../../client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to generate a random username
  function generateRandomUsername() {
    const prefix = "guest-";
    const randomPart = Math.random().toString(36).substring(2, 10); // generates random string
    return prefix + randomPart;
  }

  // Function to get the guest user ID from the cookie
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  // Function to check if the user is signed in and assign a guest username if not
  async function checkUserStatusAndAssignUsername() {
    const {data} = await supabase.auth.getSession();
    if (data.session != null) {
      setUser(data.session.user);
    } else {
      // Check if the guest cookie doesn't already exist
      let guestUsername = getCookie('guestUserId');
      if (!guestUsername) {
        guestUsername = generateRandomUsername();
        // Set the cookie to expire in 365 days
        document.cookie = `guestUserId=${guestUsername}; max-age=${60 * 60 * 24 * 365}; path=/`;
      }
      // Set the guest username as the user
      setUser({ username: guestUsername });
    }
  }


  useEffect(() => {
    setLoading(true);
    checkUserStatusAndAssignUsername();
    setLoading(false);

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      checkUserStatusAndAssignUsername();
    });

    return () => {
      if (listener?.unsubscribe) {
        listener.unsubscribe();
      }
    };
  }, []);

  // ... include sign in and sign out functions here

  const value = {
    signUp: (email, password) => supabase.auth.signUp({ email, password }),
    signIn: (email, password) => supabase.auth.signIn({ email, password }),
    signOut: () => supabase.auth.signOut(),
    user,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// useAuth hook for easy access to auth context
export const useAuth = () => {
  return useContext(AuthContext);
};