const UserApiBase = "/user";

const UserApi = {
    IMAGES_ADD: `${UserApiBase}/images/add`,
    IMAGES_EDIT: `${UserApiBase}/images/edit`,
    IMAGES_DELETE: `${UserApiBase}/images/delete`,
    IMAGES_GET: `${UserApiBase}/images/get`,
    IMAGES_GET_ALL: `${UserApiBase}/images/get/all`,

    SCREENS_ADD: `${UserApiBase}/screens/add`,
    SCREENS_EDIT: `${UserApiBase}/screens/edit`,
    SCREENS_DELETE: `${UserApiBase}/screens/delete`,
    SCREENS_GET: `${UserApiBase}/screens/get`,
    SCREENS_GET_ALL: `${UserApiBase}/screens/get/all`,

    TABLES_ADD: `${UserApiBase}/tables/add`,
    TABLES_EDIT: `${UserApiBase}/tables/edit`,
    TABLES_DELETE: `${UserApiBase}/tables/delete`,
    TABLES_GET: `${UserApiBase}/tables/get`,
    TABLES_GET_ALL: `${UserApiBase}/tables/get/all`,

    TABLES_DATA_ADD: `${UserApiBase}/tables/data/add`,
    TABLES_DATA_CLEAR_ALL: `${UserApiBase}/tables/data/clear/all`,
    TABLES_DATA_EDIT: `${UserApiBase}/tables/data/edit`,

    TAPES_ADD: `${UserApiBase}/tapes/add`,
    TAPES_COPY: `${UserApiBase}/tapes/copy`,
    TAPES_EDIT: `${UserApiBase}/tapes/edit`,
    TAPES_DELETE: `${UserApiBase}/tapes/delete`,
    TAPES_DELETE_FROM_SCREEN: `${UserApiBase}/tapes/delete/from/screen`,
    TAPES_GET: `${UserApiBase}/tapes/get`,
    TAPES_GET_ALL: `${UserApiBase}/tapes/get/all`,
    TAPES_GET_ALL_BY_SCREEN: `${UserApiBase}/tapes/get/all/by/screen`,
    TAPES_SET_ACTIVE: `${UserApiBase}/tapes/set/active`,

    TEXTS_ADD: `${UserApiBase}/texts/add`,
    TEXTS_EDIT: `${UserApiBase}/texts/edit`,
    TEXTS_DELETE: `${UserApiBase}/texts/delete`,
    TEXTS_GET: `${UserApiBase}/texts/get`,
    TEXTS_GET_ALL: `${UserApiBase}/texts/get/all`,

    VIDEOS_ADD: `${UserApiBase}/videos/add`,
    VIDEOS_EDIT: `${UserApiBase}/videos/edit`,
    VIDEOS_DELETE: `${UserApiBase}/videos/delete`,
    VIDEOS_GET: `${UserApiBase}/videos/get`,
    VIDEOS_GET_ALL: `${UserApiBase}/videos/get/all`,
};

export default UserApi;
