import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { routes } from './routes/routes';
import OfflineNotification from './components/OfflineNotification';
import AppLoader from './components/ui/AppLoader';
import { useAppDispatch } from './store/hooks';
import { listenToAuth } from './store/features/sessions/sessionSlice';

function renderRoutes(routesArray: typeof routes) {
  return routesArray.map(({ path, element, children }) => (
    <Route key={path} path={path} element={element}>
      {children && renderRoutes(children)}
    </Route>
  ));
}

export default function App() {
  const dispatch=useAppDispatch()
  const [isAppLoading, setIsAppLoading] = useState(true);


useEffect(()=>{
  dispatch(listenToAuth())
},[])

  useEffect(() => {
    // Hapa ndipo unaweza kuweka logic ya kukagua Login au kupakia data
    // Kwa sasa, tunaweka timer ya sekunde 2 ili kuonyesha loader nzuri
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Ikiwa mfumo bado unapakia (Launching)
  if (isAppLoading) {
    return <AppLoader />;
  }

  // Mfumo ukishapakia kabisa
  return (
    <>
      <OfflineNotification />
      <Routes>
        {renderRoutes(routes)}
      </Routes>
    </>
  );
}
