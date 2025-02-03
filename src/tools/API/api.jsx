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

export const getTimeline = async (user,table) => {
  try {
    console.log(user);
    console.log(table)  
    const response = await api.put('/timeline/getinfos',{ user, table});
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const postarc = async (name,start,end, email, table) => {
  try {
    console.log('api')
    console.log(name)
    console.log(start)
    console.log(end)
    console.log(email)
    console.log(table)
    
    const response = await api.put('/timeline/postarc', { name, start , end ,email, table});
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const postevenement = async (name,start, email, table) => {
  try {
    console.log('api')
    console.log(name)
    console.log(start)
    console.log(email)
    console.log(table)

    const response = await api.put('/timeline/postarc', { name, start, email , table});
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

/******************************** Description ********************************************************** */

export const insertJSon = async (table,column,id,json) => {
  try {
    const response = await api.put('/popup/insertJSon', {table,column,id,json});
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getJson = async (table,column,id) => {
  try {
    const response = await api.put('/popup/getJson', {table,column,id});
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/******************************** Caracter-tree entre autre ********************************************************** */

export const postcaracter = async (timeline_name, nom, photo, user, prenom, naissance, description) => {
  try {
    const formData = new FormData();
    formData.append("timeline_name", timeline_name);
    formData.append("nom", nom);
    formData.append("photo", photo); // Assurez-vous que `photo` est un File
    formData.append("user", JSON.stringify(user)); // Convertir le tableau en chaîne
    formData.append("prenom", prenom);
    formData.append("naissance", naissance);
    formData.append("description", description);

    const response = await api.post('/personnes/postPersonne', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'envoi des données :", error);
    throw error;
  }
};


export const getListCaracter = async ( email, table) => {
  try {
    console.log("backend")
    console.log(email)
    console.log(table)
    const response = await api.put('/personnes/Getpersonnes', {email,table});
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const getcaracterinfo = async (id) => {
  try {
    const response = await api.put('/personnes/getpersonneinfo', id,);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

