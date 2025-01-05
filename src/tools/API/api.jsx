// MyReactNativeApp/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.26:3000',
});


//bon ya pas 45 requettes ducoup on va pas faire 45 backend , juste 1

/******************************** CONNEXION ********************************************************** */
export const connect = async (id, mdp) => {
  try {
    const response = await api.put('/connexion/sendid', { id, mdp });
    console.log(response.data);
    console.log(1)
    return response.data; // On retourne les données de la réponse
  } catch (error) {
    console.log(2);
    console.error('Erreur API connexion:', error.response || error.message);
    throw error; // On relance l'erreur pour la gérer côté composant
  }
};

/******************************** Timeline ********************************************************** */

export const getTimeline = async () => {
  try {
    const response = await api.get('/timeline/getinfos');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const postarc = async (name,start,end) => {
  try {
    const response = await api.put('/timeline/postarc', { name, start , end });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const postevenement = async (name,start) => {
  try {
    const response = await api.put('/timeline/postarc', { name, start});
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/******************************** Popup ********************************************************** */


export const deletEevent = async (id) => {
  try {
    const response = await api.put('/timeline/deleteEvent', {id});
    console.log(id)
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
