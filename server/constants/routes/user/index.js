import UserImagesRoute from "./images.js";
import UserVideosRoute from "./video.js";
import UserTextsRoute from "./texts.js";
import UserTablesRoute from "./tables.js";
import UserTapeRoute from "./tapes.js";
import UserScreensRoute from "./screens.js";

export const UserRouteBase = "/api/user";

const UserRoute = {
    ...UserImagesRoute,
    ...UserVideosRoute,
    ...UserTextsRoute,
    ...UserTablesRoute,
    ...UserTapeRoute,
    ...UserScreensRoute
};

export default UserRoute;