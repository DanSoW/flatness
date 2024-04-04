import { ITapeContent } from "src/store/reducers/user/TapeSlice";

export const getNextQueue = (items: ITapeContent[]) => {
  return items.length > 0 ? items[items.length - 1].queue_num + 1 : 1;
};
