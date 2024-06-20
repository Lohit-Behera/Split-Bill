import { ThemeProvider } from "./components/theme-provider";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "./Layout";
import HomePage from "./Pages/HomePage";
import PaymentPage from "./Pages/PaymentPage";
import PaymentDetails from "./Pages/PaymentDetails";
import GroupPage from "./Pages/GroupPage";
import GroupDetails from "./Pages/GroupDetails";
import PageNotFoundPage from "./Pages/PageNotFoundPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="*" element={<PageNotFoundPage />} />
      <Route index element={<HomePage />} />
      <Route path="payment/:id" element={<PaymentPage />} />
      <Route path="payment/details/:id" element={<PaymentDetails />} />
      <Route path="group" element={<GroupPage />} />
      <Route path="group/:id" element={<GroupDetails />} />
    </Route>
  )
);

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router}></RouterProvider>
      <ToastContainer
        stacked
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme={"colored"}
        transition={Slide}
      />
    </ThemeProvider>
  );
}

export default App;
