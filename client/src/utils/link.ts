import Api from "src/constants/api";

export function linkFormatted(link: string, baseUrl: string = Api.WEB_APP) {
  return `${baseUrl}c/${link}`;
};
