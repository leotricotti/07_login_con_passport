// Redireecionar a la página de registro
const moveToSignup = () => {
  window.location.href = "/signup";
};

// Redireecionar a la página de recuperar contraseña
const moveToForgot = () => {
  window.location.href = "/forgot";
};

// Redireecionar a la pagina de login con github
const moveToGithub = () => {
  window.location.href = "/api/sessions/github";
};

//Capturar datos del formulario de registro y los envía al servidor
async function postLogin(username, password) {
  try {
    const response = await fetch("/api/sessions/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error("Error al enviar la solicitud");
    }

    const result = await response.json();

    if (!result) {
      throw new Error("Respuesta vacía del servidor");
    }

    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

//Función que al agregar un producto al carrito y el producto ya existe en el carrito, aumenta la cantidad del producto en 1
const createCart = async () => {
  if (localStorage.getItem("cartId")) {
    return;
  }
  const response = await fetch("/api/carts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      products: [],
    }),
  });
  const result = await response.json();
};

//Comprobar si el usuario está logueado
const checkUser = async () => {
  const response = await fetch("/api/sessions/check", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  try {
    if (!response.ok) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Algo salió mal! Vuelve a intentarlo",
        showConfirmButton: true,
        confirmButtonText: "Aceptar",
      });
    } else {
      window.location.href = "/api/products?page=1";
      localStorage.setItem("currentPage", 1);
      createCart();
    }
  } catch (error) {
    console.error(error);
  }
};

//Capturar datos del formulario de login y los envía al servidor
const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-button");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  postLogin(username, password);
  checkUser();
});
