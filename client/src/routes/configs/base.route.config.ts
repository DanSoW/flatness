import IRouteModel from "src/models/IRouteModel";
import Main from "src/containers/Main";
import TapeView from "src/containers/TapeView";

const baseRouteConfig: IRouteModel[] = [
    {
        // URL: /
        path: '/',
        element: Main
    },
    {
        // URL: /s/:id
        path: '/s/:id',
        element: TapeView
    }
];

export default baseRouteConfig;