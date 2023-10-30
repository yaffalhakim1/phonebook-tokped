import { useState, useEffect } from "react";

export default function useLocalStorage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  function getFavoritesFromStorage() {
    if (isClient) {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    }
    return [];
  }

  function addToFavoritesStorage(contactId: number) {
    if (isClient) {
      const currentFavorites = getFavoritesFromStorage();
      const updatedFav = [...currentFavorites, contactId];
      localStorage.setItem("favorites", JSON.stringify(updatedFav));
      window.location.reload();
    }
  }

  return {
    getFavoritesFromStorage,
    addToFavoritesStorage,
  };
}
