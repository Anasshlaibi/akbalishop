export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
}

export const BRANDS: Brand[] = [
  {
    id: "sony",
    name: "Sony",
    logo: "/wp-content/uploads/AkabliShop-Sony.webp",
    description: "Leader des caméras cinéma Alpha & FX"
  },
  {
    id: "canon",
    name: "Canon",
    logo: "/wp-content/uploads/AkabliShop-Canon.webp",
    description: "Optiques et boîtiers professionnels EOS R"
  },
  {
    id: "nikon",
    name: "Nikon",
    logo: "/wp-content/uploads/electronics-store-83-980x988.jpg",
    description: "Systèmes hybrides plein format Série Z"
  },
  {
    id: "rode",
    name: "Røde",
    logo: "/wp-content/uploads/AkabliShop-Rode.webp",
    description: "Microphones et enregistreurs audio pro"
  },
  {
    id: "godox",
    name: "Godox",
    logo: "/wp-content/uploads/AkabliShop-Godox-100x32.webp",
    description: "Éclairage vidéo LED & flashs studio"
  },
  {
    id: "dji",
    name: "DJI",
    logo: "/wp-content/uploads/AkabliShop-DJI.webp",
    description: "Drones et stabilisateurs Ronin"
  },
  {
    id: "gopro",
    name: "GoPro",
    logo: "/wp-content/uploads/AkabliShop-GoPro.webp",
    description: "Caméras d'action haute définition"
  },
  {
    id: "kfconcept",
    name: "K&F Concept",
    logo: "/wp-content/uploads/AkabliShop-KFConcept.png",
    description: "Filtres optiques ND, trépieds & bagues d'adaptation"
  }
];
