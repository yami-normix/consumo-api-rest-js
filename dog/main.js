
const api = axios.create({
  baseURL: "https://api.thedogapi.com/v1"
});
api.defaults.headers['X-API-KEY'] = "3e41c918-6ff0-4288-ac4b-c1c52d6f8ced"
const API_URL_RANDOM = 'https://api.thedogapi.com/v1/images/search?limit=2';
const API_URL_FAVOTITES = 'https://api.thedogapi.com/v1/favourites?api_key=3e41c918-6ff0-4288-ac4b-c1c52d6f8ced';
const API_URL_FAVOTITES_DELETE = (id) => `https://api.thedogapi.com/v1/favourites/${id}?api_key=3e41c918-6ff0-4288-ac4b-c1c52d6f8ced`;
const API_URL_UPLOAD = 'https://api.thedogapi.com/v1/images/upload';

const spanError = document.getElementById('error')

async function loadRandomDogs() {
  const res = await fetch(API_URL_RANDOM);
  const data = await res.json();
  console.log('Random')
  console.log(data)

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error: " + res.status;
  } else {
    const img1 = document.getElementById('img1');
    const img2 = document.getElementById('img2');
    const btn1 = document.getElementById('btn1');
    const btn2 = document.getElementById('btn2');
    
    img1.src = data[0].url;
    img2.src = data[1].url;

    btn1.onclick = () => saveFavouriteDog(data[0].id);
    btn2.onclick = () => saveFavouriteDog(data[1].id);
  }
}

async function loadFavouriteDogs() {
  const res = await fetch(API_URL_FAVOTITES);
  const data = await res.json();
  console.log('Favoritos')
  console.log(data)

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error: " + res.status + data.message;
  } else {
    const section = document.getElementById('favoriteDogs')
    section.innerHTML = "";
    const h2 = document.createElement("h2");
    const h2Text = document.createTextNode("Perros favoritos");
    h2.appendChild(h2Text);
    section.appendChild(h2);

    data.forEach(perrito => {
      const article = document.createElement('article');
      const img = document.createElement('img');
      const btn = document.createElement('button');
      const btnText = document.createTextNode('Sacar al perrito de favoritos');

      img.src = perrito.image.url;
      img.width = 150;
      btn.appendChild(btnText);
      btn.onclick = () => deleteFavouriteDog(perrito.id);
      article.appendChild(img);
      article.appendChild(btn);
      section.appendChild(article);
    });
  }
}

async function saveFavouriteDog(id) {
  const res = await fetch(API_URL_FAVOTITES, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image_id: id
    }),
  });
  const data = await res.json();

  console.log('Save')
  console.log(res)

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error: " + res.status + data.message;
  }else{
      console.log("Perrito guardado en favoritos");
      loadFavouriteDogs();
  }
}

async function deleteFavouriteDog(id) {
    const res = await fetch(API_URL_FAVOTITES_DELETE(id), {
        method: 'DELETE',
  
      });
      const data = await res.json();

      if (res.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
      }else {
          console.log("Perrito eliminado de favoritos");
          loadFavouriteDogs();
      }
}

async function uploadDogPhoto() {
  const form = document.getElementById('uploadingForm');
  const formData = new FormData(form);

  //file pertenece al name del primer input dentro del form. Y este pasa a ser la llave
  console.log(formData.get('file'))


  const res = await fetch(API_URL_UPLOAD, {
    method: "POST",
    headers: {
      //"Content-Type": "multipart/form-data",
     "X-API-KEY": "3e41c918-6ff0-4288-ac4b-c1c52d6f8ced",

    },
    body: formData,
  })
  const data = await res.json();
  if (res.status !== 201) {
    spanError.innerHTML = `Hubo un error al subir el perrito: ${res.status} ${data.message}`
}else {
    console.log('Foto de Perrito subida')
    console.log("Perrito subido correctamente")
    console.log({data})
    console.log(data.url)
    console.log(loadFavouriteDogs)
    saveFavouriteDog(data.id)
}

}

loadRandomDogs();
loadFavouriteDogs();
