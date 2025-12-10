// dados usuarios, atividades e posts

export const users = [
  { id: "u1", name: "Breno Guerra", avatar: require("./assets/breno.jpeg") },
  { id: "u2", name: "Thony Durval", avatar: require("./assets/thony.jpeg") },
  { id: "u3", name: "Ryan Cavalcanti", avatar: require("./assets/ryan.jpeg") },
  { id: "u4", name: "Gustavo Evangelista", avatar: require("./assets/gustavo.jpeg") },
  { id: "u5", name: "Ricardo Neto", avatar: require("./assets/ricardo.jpeg") },
  { id: "u6", name: "Nicolas Melo", avatar: require("./assets/nicolas.jpeg") }
];

export const activities = [
  {
    id: "a1",
    title: "Corrida",
    tag: "Ar livre",
    image: "https://cdn.prod.website-files.com/652421babb6bdd7f92f721b7/652421babb6bdd7f92f722c1_beneficios-da-corrida.jpg"
  },
  {
    id: "a2",
    title: "Programar",
    tag: "Computador",
    image: "https://images.unsplash.com/photo-1505685296765-3a2736de412f?auto=format&fit=crop&w=800&q=60"
  },
  {
    id: "a3",
    title: "Yoga",
    tag: "Bem-estar",
    image: "https://media.guiame.com.br/archives/2014/08/07/192267864-.jpg"
  },
  {
    id: "a4",
    title: "Natação",
    tag: "Piscina",
    image: "https://www.santacasamaringa.com.br/uploads/noticias/noticias-15547289301798761057.jpg"
  },
  {
    id: "a5",
    title: "Ciclismo",
    tag: "Ao ar livre",
    image: "https://nutrata.com.br/wp-content/uploads/2024/03/Tudo-o-que-voce-precisa-saber-sobre-ciclismo.jpg.webp"
  }
];

export const posts = [
  { id: "p1", userId: "u1", text: "Fez corrida por 2 horas em Marechal Deodoro", likes: 12, comments: [{ id: "c1", text: "massa!" }], time: "Hoje às 09:20" },
  { id: "p2", userId: "u2", text: "Programou por 1h40", likes: 8, comments: [], time: "Hoje às 14:00" },
  { id: "p3", userId: "u3", text: "Fez natação por 50 minutos", likes: 5, comments: [], time: "Ontem às 18:42" },
  { id: "p4", userId: "u4", text: "Fez ciclismo por 50 minutos", likes: 20, comments: [], time: "Ontem às 21:15" },
  { id: "p5", userId: "u5", text: "Tocou guitarra por 1 hora", likes: 4, comments: [{ id: "c2", text: "Parabéns!" }], time: "Hoje às 17:54" },
  { id: "p6", userId: "u6", text: "Programou por 12 horas", likes: 87, comments: [], time: "Ontem às 8:42" }
];
