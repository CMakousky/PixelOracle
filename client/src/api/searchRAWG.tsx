import { RawgData } from "../interfaces/RawgData";
import auth from "../utils/auth";

const searchAllGames = async (): Promise<RawgData> => {
    try {
      const response = await fetch('/api/RAWG/allGames', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.getToken()}`
        }
      });
      const data = await response.json();
      if(!response.ok) {
        throw new Error('invalid RAWG API response, check network tab!');
      }
  
      return data;
    } catch (err) {
      console.log('Error from data retrieval:', err);
      return Promise.reject({});
    }  
  };
  
  const searchGamesByName = async (title: string | null): Promise<RawgData[]> => {
    try {
      const response = await fetch(`/api/RAWG/gamesByName/${title}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.getToken()}`
        }
      });
      const data = await response.json();
      if(!response.ok) {
        throw new Error('invalid RAWG API response, check network tab!');
      }

      return data.results;
    } catch (err) {
      console.log('Error from data retrieval:', err);
      return Promise.reject('No matches for that search criteria');
    }
  };

  const gameInfo = async (id: string | null): Promise<RawgData> => {
    try {
      const response = await fetch(`/api/RAWG/gameInfo/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.getToken()}`
        }
      });
      const data = await response.json();
      if(!response.ok) {
        throw new Error('invalid RAWG API response, check network tab!');
      }

      return data;
    } catch (err) {
      console.log('Error from data retrieval:', err);
      return Promise.reject('No matches for that search criteria');
    }
  };

  const gameInfoSlug = async (slug: string | null): Promise<RawgData> => {
    try {
      const response = await fetch(`/api/RAWG/gameInfoSlug/${slug}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.getToken()}`
        }
      });
      const data = await response.json();
      if(!response.ok) {
        throw new Error('invalid RAWG API response, check network tab!');
      }

      return data;
    } catch (err) {
      console.log('Error from data retrieval:', err);
      return Promise.reject('No matches for that search criteria');
    }
  };

export { searchAllGames, searchGamesByName, gameInfo, gameInfoSlug };