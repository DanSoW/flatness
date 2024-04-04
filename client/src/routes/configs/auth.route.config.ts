import IRouteModel from "src/models/IRouteModel";
import SignIn from "src/containers/Auth/SignIn";
import SignUp from "src/containers/Auth/SignUp";
import TapeView from "src/containers/TapeView";

const authRouteConfig: IRouteModel[] = [
    {
        // URL: /auth/sign-in
        path: '/auth/sign-in',
        element: SignIn
    },
    {
        // URL: /auth/sign-up'
        path: '/auth/sign-up',
        element: SignUp
    },
];

export default authRouteConfig;