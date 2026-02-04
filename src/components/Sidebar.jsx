import { NavLink } from "react-router-dom" ;
 
import "../index.css" ;
 

export default function Sidebar ( ) {
   
  const links = [
    { name: "Explorar", path: "/explorar" },
    { nome : "Favoritos" , caminho : "/favoritos" },
    { nome : "Passeios" , caminho : "/passeios" },
    { nome : "Ranking" , caminho : "/ranking" },
    { nome : "Modo Offline" , caminho : "/offline" },
  ];

  retornar (
    < aside className = "sidebar" > 
      <divclassName="logo"> 
        < img
          className = "logoImg"
          src = "/turista-logo.svg"
          alt = "Logotipo do TuristaApp"
          carregando = "preguiçoso"
        />

        <div>​​
          < div className = "logoTitle" > TuristaApp </ div > 
          <divclassName="logoSub">Explore o mundo</div> 
        </div>​​
      </div>​​

      <nenhum>​​
        {links.map((link) => (
          < NavLink
            chave = {link.name}
            para = {link.path}
            className = {({ isActive }) => 
              isActive ? "link da barra lateral ativo" : "link da barra lateral"
            }
          >
            {link.name}
          </ NavLink >
        ))}
      </ nenhum >
    </aside>​​
  );
}