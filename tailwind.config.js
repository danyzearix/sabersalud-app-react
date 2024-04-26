/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {colors: {
      'soft-pink': '#F7E8EB',  // Puedes nombrar este color como prefieras
    }},
  },
  plugins: [],
  content: [
    "./src/**/*.{js,jsx}", // Asegúrate de que la ruta cubre tus archivos de componentes.
    "./public/index.html", // Incluye también tus archivos HTML si es necesario.
  ],
}

