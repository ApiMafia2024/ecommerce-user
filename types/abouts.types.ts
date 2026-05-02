export interface AboutImage {
  original: string;
}

export interface About {
  id: number;
  title: string;
  description: string;
  images: AboutImage[];
}

