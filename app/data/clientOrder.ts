// Orden específico solicitado por el cliente
// CATEGORIA,LINK,ARTISTA,NOMBRE_DEL_TEMA,AÑO,PRODUCTION_COMPANY

export interface ClientOrderItem {
  category: 'MUSIC VIDEOS' | 'COMMERCIAL' | 'SET DESIGN' | 'FILM';
  link: string;
  artist: string;
  projectName: string;
  year: string;
  productionCompany: string;
  order: number;
}

export const clientOrderData: ClientOrderItem[] = [
  // MUSIC VIDEOS
  { category: 'MUSIC VIDEOS', link: 'https://vimeo.com/307361595?share=copy', artist: 'ALOE', projectName: 'CUANDO SERA', year: '2021', productionCompany: 'PANTERA', order: 1 },
  { category: 'MUSIC VIDEOS', link: 'https://vimeo.com/358550924?share=copy', artist: 'CONOCIENDO RUSIA', projectName: 'COSAS PARA DECIRTE', year: '2021', productionCompany: 'PANTERA', order: 2 },
  { category: 'MUSIC VIDEOS', link: 'https://vimeo.com/755400480?share=copy', artist: 'DUKI & DE LA GHETTO & QUEVEDO', projectName: 'SI QUIEREN FRONTEAR', year: '2022', productionCompany: 'ANESTESIA', order: 3 },
  { category: 'MUSIC VIDEOS', link: 'https://vimeo.com/822866131?share=copy', artist: 'DUKI', projectName: 'ANTES DE PERDERTE', year: '2022', productionCompany: 'ANESTESIA', order: 4 },
  { category: 'MUSIC VIDEOS', link: 'https://vimeo.com/763820558?share=copy', artist: 'DILLOM', projectName: 'PELOTUDA', year: '2022', productionCompany: 'BOHEMIAN GROOVE CORP', order: 5 },
  { category: 'MUSIC VIDEOS', link: 'https://vimeo.com/465368190?share=copy', artist: 'LOUTA', projectName: 'NO ME ESTAS HACIENDO UN FAVOR', year: '2022', productionCompany: 'JAIME JAMES', order: 6 },
  { category: 'MUSIC VIDEOS', link: 'https://vimeo.com/843940271?share=copy', artist: 'MARIA BECERRA', projectName: 'OJALA', year: '2022', productionCompany: 'ASALTO', order: 7 },
  { category: 'MUSIC VIDEOS', link: 'https://vimeo.com/849201595?share=copy', artist: 'MARIA BECERRA & PRINCE ROYCE', projectName: 'TE ESPERO', year: '2022', productionCompany: 'ASALTO', order: 8 },
  { category: 'MUSIC VIDEOS', link: 'https://vimeo.com/845088941?share=copy', artist: 'MARIA BECERRA', projectName: 'AUTOMATICO', year: '2022', productionCompany: 'ASALTO', order: 9 },
  { category: 'MUSIC VIDEOS', link: 'https://vimeo.com/846342325?share=copy', artist: 'MARIA BECERRA', projectName: 'CORAZON VACIO', year: '2023', productionCompany: 'ASALTO', order: 10 },
  { category: 'MUSIC VIDEOS', link: 'https://vimeo.com/920687890?share=copy', artist: 'MARIA BECERRA', projectName: 'PRIMER AVISO', year: '2024', productionCompany: 'ASALTO', order: 11 },
  { category: 'MUSIC VIDEOS', link: 'https://vimeo.com/949347671?share=copy', artist: 'MARIA BECERRA', projectName: 'IMAN', year: '2024', productionCompany: 'ASALTO', order: 12 },
  { category: 'MUSIC VIDEOS', link: 'https://vimeo.com/949273720?share=copy', artist: 'JULIETA VENEGAS', projectName: 'EN TU ORILLA', year: '2022', productionCompany: 'LA CASA DE AL LADO', order: 13 },
  { category: 'MUSIC VIDEOS', link: 'https://vimeo.com/697182102?share=copy', artist: 'JULIETA VENEGAS', projectName: 'MISMO AMOR', year: '2022', productionCompany: 'LA CASA DE AL LADO', order: 14 },
  { category: 'MUSIC VIDEOS', link: 'https://vimeo.com/948835251?share=copy', artist: 'CONOCIENDO RUSIA & NATALIA LAFOURCADE', projectName: 'CINCO HORAS MENOS', year: '2024', productionCompany: 'MAMAHUNGARA', order: 15 },
  { category: 'MUSIC VIDEOS', link: 'https://vimeo.com/998984993?share=copy', artist: 'SWAGGERBOYS & DILLOM', projectName: 'EL MOROCHO EL RUBIO Y EL COLO', year: '2024', productionCompany: 'THE MOVEMENT / LANDIA', order: 16 },
  { category: 'MUSIC VIDEOS', link: 'https://youtu.be/BNrKaLuLjFw?si=krPdVfmkPt3a6lLn', artist: 'CHITA', projectName: 'SOLA', year: '2024', productionCompany: 'THE MOVEMENT / LANDIA', order: 17 },
  { category: 'MUSIC VIDEOS', link: 'https://vimeo.com/954556710?share=copy', artist: 'SARAMALACARA', projectName: 'MAS FELIZ', year: '2024', productionCompany: 'CASTADIVA', order: 18 },
  { category: 'MUSIC VIDEOS', link: 'https://vimeo.com/954548653?share=copy', artist: 'TAICHU FT. LALI', projectName: 'S.O.S', year: '2024', productionCompany: 'CASTADIVA', order: 19 },
  { category: 'MUSIC VIDEOS', link: 'https://vimeo.com/976712517?share=copy', artist: 'DILLOM', projectName: 'BUENOS TIEMPOS', year: '2024', productionCompany: 'POSTER', order: 20 },
  { category: 'MUSIC VIDEOS', link: 'https://vimeo.com/1056379987?share=copy', artist: 'DILLOM', projectName: 'CIRUGIA', year: '2024', productionCompany: 'POSTER', order: 21 },
  { category: 'MUSIC VIDEOS', link: 'https://vimeo.com/1004203470', artist: 'MILO J', projectName: 'ALI OLI', year: '2024', productionCompany: 'ARENA COLLECTIVE', order: 22 },
  { category: 'MUSIC VIDEOS', link: 'https://vimeo.com/1004201478', artist: 'MILO J', projectName: 'TRES PECADOS DESPUES', year: '2024', productionCompany: 'ARENA COLLECTIVE', order: 23 },
  { category: 'MUSIC VIDEOS', link: 'https://vimeo.com/1088054650?share=copy', artist: 'BLAIR', projectName: 'BAR SCORPIOS', year: '2025', productionCompany: 'POSTER', order: 24 },
  { category: 'MUSIC VIDEOS', link: 'https://vimeo.com/1068952865?share=copy', artist: 'SEBASTIAN YATRA', projectName: 'LA PELIROJA', year: '2025', productionCompany: 'THE MOVEMENT / LANDIA', order: 25 },
  { category: 'MUSIC VIDEOS', link: 'https://vimeo.com/1085539087?share=copy', artist: 'SEBASTIAN YATRA', projectName: 'TEMPLO DE PICEAS', year: '2025', productionCompany: 'THE MOVEMENT / LANDIA', order: 26 },
  
  // COMMERCIAL
  { category: 'COMMERCIAL', link: 'https://vimeo.com/847094947?share=copy', artist: 'CERVEZA QUILMES', projectName: 'SON OTROS TIEMPOS', year: '2024', productionCompany: 'THE MOVEMENT / LANDIA', order: 27 },
  { category: 'COMMERCIAL', link: 'https://vimeo.com/1030870124?share=copy', artist: 'BETWARRIOR', projectName: 'DEPORTE&CASINO', year: '2024', productionCompany: 'MAMAHUNGARA', order: 28 },
  { category: 'COMMERCIAL', link: 'https://vimeo.com/1065521594?share=copy', artist: 'HILERET', projectName: 'ES NATURAL QUE DISFRUTES', year: '2023', productionCompany: 'REINO BUENOS AIRES', order: 29 },
  { category: 'COMMERCIAL', link: 'https://vimeo.com/947537502?share=copy', artist: 'PERSONAL', projectName: 'PERSONAL FLOW', year: '2024', productionCompany: 'POSTER', order: 30 },
  { category: 'COMMERCIAL', link: 'https://vimeo.com/908650373?share=copy', artist: 'SPOTIFY', projectName: 'MARIA BECERRA', year: '2024', productionCompany: 'THE MOVEMENT / LANDIA', order: 31 },
  { category: 'COMMERCIAL', link: 'https://vimeo.com/850948866?share=copy', artist: 'MERCADOLIBRE', projectName: 'BZP X NEW ERA', year: '2023', productionCompany: 'THE MOVEMENT / LANDIA', order: 32 },
  { category: 'COMMERCIAL', link: 'https://vimeo.com/993548626?share=copy', artist: 'MACMA', projectName: 'BREAST CANCER CAMPAIGN', year: '2024', productionCompany: 'POSTER', order: 33 },
  { category: 'COMMERCIAL', link: 'https://vimeo.com/1053519947?share=copy', artist: 'SPOTIFY', projectName: 'SPOTIFY SINGLES ARGENTINA', year: '2024', productionCompany: 'POSTER', order: 34 },
  { category: 'COMMERCIAL', link: 'https://vimeo.com/1007473774?share=copy', artist: 'LOLLAPALOZA', projectName: '10 AÑOS - PUNK', year: '', productionCompany: '', order: 35 },
  { category: 'COMMERCIAL', link: 'https://vimeo.com/1007472921?share=copy', artist: 'LOLLAPALOZA', projectName: '10 AÑOS - VERBORRAGIA', year: '', productionCompany: '', order: 36 },
  { category: 'COMMERCIAL', link: 'https://vimeo.com/917605551?share=copy', artist: 'BONAFONT MEXICO', projectName: 'KILOMETROS QUE NOS MUEVEN', year: '2024', productionCompany: 'MAMA HUNGARA', order: 37 },
  
  // SET DESIGN
  { category: 'SET DESIGN', link: '', artist: 'RIESE', projectName: 'EDITORIAL', year: '2024', productionCompany: '', order: 38 },
  { category: 'SET DESIGN', link: '', artist: 'PUMA', projectName: 'FASHION WEEK', year: '2024', productionCompany: '', order: 39 },
  { category: 'SET DESIGN', link: '', artist: 'LUNA ALVAREZ CASTILLO', projectName: 'LOCAL', year: '2024', productionCompany: '', order: 40 },
  { category: 'SET DESIGN', link: '', artist: 'JAZMIN CHEBAR', projectName: 'ACCESORIOS INVIERNO', year: '2024', productionCompany: '', order: 41 },
  { category: 'SET DESIGN', link: '', artist: 'MARIA BECERRA', projectName: 'LOLLAPALOZA SHOW', year: '2023', productionCompany: '', order: 42 },
  
  // FILM
  { category: 'FILM', link: 'https://vimeo.com/1074655468?share=copy', artist: 'SOFIA PONCINI', projectName: 'EL PLANETARIO', year: '2025', productionCompany: 'REBOLUCION', order: 43 },
];

// Función helper para obtener el orden de un proyecto específico
export const getProjectOrder = (artist: string, projectName: string): number => {
  const item = clientOrderData.find(item => 
    item.artist.toLowerCase() === artist.toLowerCase() && 
    item.projectName.toLowerCase() === projectName.toLowerCase()
  );
  return item?.order || 999; // Si no se encuentra, va al final
};

// Función para obtener categorías en el orden correcto
export const getCategoriesInOrder = (): string[] => {
  const categories = ['MUSIC VIDEOS', 'COMMERCIAL', 'SET DESIGN', 'FILM'];
  return categories;
};

// Función para ordenar items según el orden del cliente
export const sortByClientOrder = <T extends { project?: string; artist?: string; title?: string }>(items: T[]): T[] => {
  return items.sort((a, b) => {
    const artistA = a.artist || '';
    const artistB = b.artist || '';
    const projectA = a.project || a.title || '';
    const projectB = b.project || b.title || '';
    
    const orderA = getProjectOrder(artistA, projectA);
    const orderB = getProjectOrder(artistB, projectB);
    
    return orderA - orderB;
  });
}; 