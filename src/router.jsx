import { createBrowserRouter } from 'react-router-dom';
import Home from './components/Home';
import Uploads from './components/Uploads';
import Result from './components/Result';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    children: [
      {
        index: true,
        element: <Uploads />,
      },
      {
        path: '/result',
        element: <Result />,
      },
    ],
  },
], {
  basename: '/Violations/',
});
