export interface HeroSliderInfoType {
  url: string;
  caption: string;
  backgroundColor: string;
  link_uri: string;
  link_title: string;
}

export interface HeroSliderProps {
  slides: HeroSliderInfoType[];
  mobile: boolean;
}
