import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { router } from './router.jsx';
import store from './redux/store';
import { loadFromLocalStorage } from './redux/uploadsSlice';
import './App.css';

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Load data from localStorage on app mount
    const savedState = localStorage.getItem('uploads');
    if (savedState) {
      try {
        dispatch(loadFromLocalStorage(JSON.parse(savedState)));
      } catch (error) {
        console.error('Error loading state from localStorage:', error);
      }
    }
  }, [dispatch]);

  return <RouterProvider router={router} />;
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
