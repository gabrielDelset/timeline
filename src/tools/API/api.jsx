// MyReactNativeApp/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});


//bon ya pas 45 requettes ducoup on va pas faire 45 backend , juste 1

/******************************** CONNEXION ********************************************************** */
export const connect = async (id, mdp) => {
  try {
    const response = await api.put('/connexion/sendid', { id, mdp });
    console.log(response.data);
    return response.data; // On retourne les données de la réponse
  } catch (error) {
    console.log(2);
    console.error('Erreur API connexion:', error.response || error.message);
    throw error; // On relance l'erreur pour la gérer côté composant
  }
};

/******************************** Timeline ********************************************************** */

export const getTimeline = async (user, table) => {
  try {
    const response = await api.get('/timeline/getinfos', {
      params: { user, table }
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getJsonLinks = async (user, table) => {
  try {
    const response = await api.get('/timeline/getJsonLinks', {
      params: { user, table }
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const postarc = async (name,start,end, color, email, table) => {
  try {
    console.log("api",start)
    const response = await api.put('/timeline/postarc', { name, start ,color, end ,email, table});
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};



/************************************** MODIF ************************************************** */

export const modiftime = async (id,start,end, email) => {
  try {
    const response = await api.put('/timeline/modifTime', { id, start , end ,email});
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const modifname = async (id , name, email) => {
  try {
    console.log('api');
    console.log(id);
    console.log(name);
    console.log(email);


    const response = await api.put('/timeline/modifName', { id, name, email });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const modifcolor = async (id ,color, email) => {
  try {
    console.log('api');
    console.log(id);
    console.log(color);
    console.log(email);


    const response = await api.put('/timeline/modifColor', { id,color, email });
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
    const response = await api.get('/popup/getJson', {
      params: { table, column, id }
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/******************************** Caracter-tree entre autre ********************************************************** */

export const postcaracter = async (timeline_name, nom, photo, user, prenom, naissance, description) => {
  console.log(timeline_name,nom,)

  try {
    const formData = new FormData();
    formData.append("timeline_name", timeline_name);
    formData.append("nom", nom);
    formData.append("photo", photo); // Assurez-vous que `photo` est un File
    formData.append("user", JSON.stringify(user)); // Convertir le tableau en chaîne
    formData.append("prenom", prenom);
    formData.append("naissance", naissance);
    formData.append("description", description);

    console.log()

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



export const modifycaracter = async (id, timeline_name, nom, photo, user, prenom, naissance, description) => {
  try {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("timeline_name", timeline_name);
    formData.append("nom", nom);
    formData.append("photo", photo); // Assurez-vous que `photo` est un File
    formData.append("user", JSON.stringify(user)); // Convertir le tableau en chaîne
    formData.append("prenom", prenom);
    formData.append("naissance", naissance);
    formData.append("description", description);

    const response = await api.post('/personnes/modifyPersonne', formData, {
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

export const deletecaracter = async (id, timeline_name, user) => {
  console.log(id)
  console.log(timeline_name)
  console.log(user)
  try {
    const response = await api.post('/personnes/deletePersonne', {id,timeline_name,user});
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  } 
};


export const getListCaracter = async (email, table) => {
  try {
    const response = await api.get('/personnes/Getpersonnes', {
      params: { email, table }
    });
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



export const getLink = async (user, table) => {
  try {
    const response = await api.get('/personnes/getLink', {
      params: { user, table }
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const postlink = async (json, user,table) => {
  try {
    console.log(user);
    console.log(table)  
    const response = await api.put('/personnes/postLink',{ user, table});
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const DeleteLink = async (id, user,table) => {
  try {
    const response = await api.put('/personnes/deleteLink',{ id, user, table});
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const PushLInkdatabase = async (name, color,length,user,table) => {
  try {
    const response = await api.put('/personnes/postLink',{ name,color, length , user, table});
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const SaveTreeEdges = async (json,user,id) => {
  console.log(json);
    console.log(user);
    console.log(id);
  try {
    const response = await api.put('/personnes/savetree',{ json,user,id});
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const SaveTreeNodes = async (json,user,id) => {
    console.log(json);
    console.log(user);
    console.log(id);
  try {
    const response = await api.put('/personnes/savenode',{ json,user,id});
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};





