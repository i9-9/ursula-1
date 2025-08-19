export interface Project {
  id: string;
  slug: string;
  title: string;
  artist: string;
  year: string;
  thumbnail: string;
  fullImage: string;
  contentType: 'video' | 'image';
  description: string;
  vimeoId?: string;
  youtubeUrl?: string;
}

export const projects: Project[] = [
  {
    id: 'tres-pecados-despues',
    slug: 'tres-pecados-despues',
    title: 'TRES PECADOS DESPUES',
    artist: 'Milo J',
    year: '2024',
    thumbnail: '/videos_grid/1 Milo J - Tres Pecados Despues.mp4',
    fullImage: '/videos_grid/1 Milo J - Tres Pecados Despues.mp4',
    contentType: 'video',
    description: 'Videoclip para Milo J - Tres Pecados Después.',
    vimeoId: '1004201478'
  },
  {
    id: 'ali-oli',
    slug: 'ali-oli',
    title: 'ALI OLI',
    artist: 'Milo J',
    year: '2024',
    thumbnail: '/videos_grid/2 Milo J - Ali Oli.mp4',
    fullImage: '/videos_grid/2 Milo J - Ali Oli.mp4',
    contentType: 'video',
    description: 'Videoclip para Milo J - Ali Oli.',
    vimeoId: '1004203470'
  },
  {
    id: 'sola',
    slug: 'sola',
    title: 'SOLA',
    artist: 'Chita',
    year: '2024',
    thumbnail: '/videos_grid/3 - Chita - Sola.mp4',
    fullImage: '/videos_grid/3 - Chita - Sola.mp4',
    contentType: 'video',
    description: 'Videoclip para Chita - Sola.',
    youtubeUrl: 'https://youtu.be/BNrKaLuLjFw'
  },
  {
    id: 'sos',
    slug: 'sos',
    title: 'S.O.S',
    artist: 'Taichu ft Lali',
    year: '2024',
    thumbnail: '/videos_grid/4 - Taichu ft Lali - S.O.S.mp4',
    fullImage: '/videos_grid/4 - Taichu ft Lali - S.O.S.mp4',
    contentType: 'video',
    description: 'Videoclip para Taichu ft Lali - S.O.S.',
    vimeoId: '954548653'
  },
  {
    id: 'cirugia',
    slug: 'cirugia',
    title: 'CIRUGÍA',
    artist: 'Dillom',
    year: '2024',
    thumbnail: '/videos_grid/5 - Dillom - Cirugia.mp4',
    fullImage: '/videos_grid/5 - Dillom - Cirugia.mp4',
    contentType: 'video',
    description: 'Videoclip para Dillom - Cirugía.',
    vimeoId: '1056379987'
  },
  {
    id: 'bonafont-mx',
    slug: 'bonafont-mx',
    title: 'BONAFONT MX',
    artist: 'Dir. Carmen Rivoira - Prod. Mamahungara',
    year: '2024',
    thumbnail: '/videos_grid/6 - Dir. Carmen Rivoira - Prod. Mamahungara - Bonafont MX.mp4',
    fullImage: '/videos_grid/6 - Dir. Carmen Rivoira - Prod. Mamahungara - Bonafont MX.mp4',
    contentType: 'video',
    description: 'Comercial para Bonafont MX.',
    vimeoId: '917605551'
  }
];
