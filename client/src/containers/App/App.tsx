import { FC, useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import useRoutes from "src/routes/routes";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Стили
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import { getRoles } from "src/store/actions/AuthAction";

const App: FC<any> = () => {
  const authSelector = useAppSelector((s) => s.authReducer);
  const dispatch = useAppDispatch();

  // @ts-ignore
  const routes = useRoutes();

  useEffect(() => {
    if (authSelector.access_token) {
      dispatch(getRoles());
    }
  }, [authSelector.access_token]);

  return (
    <>
      <BrowserRouter>
        {routes}
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </BrowserRouter>
    </>
  );
};

export default App;
