function generarContrasena(longitud = 6) {
  const caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
  let contrasena = "";

  for (let i = 0; i < longitud; i++) {
    const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
    contrasena += caracteres[indiceAleatorio];
  }

  return contrasena;
}

export default generarContrasena;
