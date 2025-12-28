import { Routes, Route } from 'react-router-dom';
import { routes } from './routes/routes';
import OfflineNotification from './components/OfflineNotification';

function renderRoutes(routesArray: typeof routes) {
  return routesArray.map(({ path, element, children }) => (
    <Route key={path} path={path} element={element}>
      {children && renderRoutes(children)}
    </Route>
  ));
}

export default function App() {
  return (
    <>
      <OfflineNotification />
      <Routes>{renderRoutes(routes)}</Routes>
    </>
  );
}
