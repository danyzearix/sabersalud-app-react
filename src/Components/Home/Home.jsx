import { useEffect, useMemo, useState } from "react";
import "./Home.css";

const Home = () => {
  // Detecta modo por defecto desde sistema o lo último guardado
  const systemPrefersDark =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const [isDark, setIsDark] = useState(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    if (saved === "dark") return true;
    if (saved === "light") return false;
    return systemPrefersDark;
  });

  useEffect(() => {
    // Aplica el tema en el contenedor raíz del documento
    const root = document.documentElement;
    root.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const cardData = useMemo(
    () => [
      {
        name: "Certificados SaberSalud",
        icon: "/certificado-sabersalud.png",
        href: "https://app.sabersalud.co/certificados",
      },
      {
        name: "Certificados Estética",
        icon: "/certificado-estetica.png",
        href: "https://app.sabersalud.co/certificados-estetica",
      },
      {
        name: "Certificados SaberSer",
        icon: "/certificado-saberser.png",
        href: "https://app.sabersalud.co/certificados-ser",
      },
      {
        name: "Lista de Clientes",
        icon: "/lista-clientes.png",
        href: "https://app.sabersalud.co/clientes",
      },
      {
        name: "Agregar Cliente",
        icon: "/agregar-cliente.png",
        href: "https://app.sabersalud.co/formulario-registro",
      },
      // Si ya tienes una ruta de reportes, déjala aquí. Si no, elimina esta card.
      {
        name: "Reportes",
        icon: "/reportes.png",
        href: "/reportes",
      },
    ],
    []
  );

  return (
    <div className="home">
      <header className="home__header">
        <h1 className="home__title">Bienvenido al aplicativo </h1>

        <button
          type="button"
          className="theme-toggle"
          aria-label={`Cambiar a modo ${isDark ? "claro" : "oscuro"}`}
          onClick={() => setIsDark((v) => !v)}
        >
          <span className="theme-toggle__thumb" />
          <span className="theme-toggle__label">{isDark ? "Oscuro" : "Claro"}</span>
        </button>
      </header>

      <main>
        <div className="cards">
          {cardData.map((card, index) => (
            <a
              key={index}
              className="card"
              href={card.href}
              target="_self"
              rel="noopener"
              aria-label={card.name}
            >
              <img
                src={card.icon}
                alt={card.name}
                className="card__icon"
                loading="lazy"
                width="64"
                height="64"
              />
              <p className="card__title">{card.name}</p>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
