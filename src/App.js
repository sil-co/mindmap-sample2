
import React, {useState, useEffect, useCallback} from 'react';
import {} from './App.css';

import Header from './ui-components/Header';
import LeftMenu from './ui-components/LeftMenu';
import Breadcrumbs from './ui-components/Breadcrumbs';
import Content from './ui-components/Content';
import router from './ui-components/router';
import routes from './ui-components/routes';

import AppContext from './contexts/AppContext';

// hooks記法
const App = () => {

  router.init(routes);
  const route = router.getRoute();

  const [component, setComponent] = useState(route.component);
  const [breadcrumbs, setBreadcrumbs] = useState(route.breadcrumbs);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  router.subscribe(onRouteChange);

  const toggleMenu = useCallback(() => {
    console.log('[App] toggleMenu');
    setIsMenuVisible(!isMenuVisible);
  }, [isMenuVisible]);

  const hideMenu = useCallback(() => {
    console.log('[App] hideMenu');
    setIsMenuVisible(false);
  }, [])

  const [_isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    console.log('[App] useEffect setIsMounted');
    setIsMounted(true);
  }, []);

  function onRouteChange() {
    console.log('[App] onRouteChange');
    const route = router.getRoute();
    if (_isMounted) {
      setComponent(route.component);
      setBreadcrumbs(route.breadcrumbs);
    }
  };

    return (
      <AppContext.Provider value={'value from App.js'}>
        <div>
          <Header onMenuClick={toggleMenu} />
          <LeftMenu isMenuVisible={isMenuVisible} onMouseLeave={hideMenu} />
          <Breadcrumbs list={breadcrumbs} />
          <Content component={component} />
        </div>
      </AppContext.Provider>
    );
}

export default App;

// class記法
// class App extends React.Component {
//   constructor(props) {
//     super(props);
//     router.init(routes);
//     const route = router.getRoute();
//     this.state = {
//       component: route.component,
//       breadcrumbs: route.breadcrumbs,
//       isMenuVisible: false,
//     };
//     router.subscribe(this.onRouteChange);
//   }

//   toggleMenu = () => {
//     const isMenuVisible = !this.state.isMenuVisible;
//     this.setState({isMenuVisible});
//   };

//   hideMenu = () => {
//     this.setState({isMenuVisible: false});
//   };

//   _isMounted = false;

//   componentDidMount() {
//     this._isMounted = true;
//   }

//   onRouteChange = () => {
//     const route = router.getRoute();
//     if (this._isMounted) {
//       this.setState({
//         component: route.component,
//         breadcrumbs: route.breadcrumbs,
//       });
//     }
//   };

//   render() {
//     return (
//       <div>
//         <Header onMenuClick={this.toggleMenu} />
//         <LeftMenu isMenuVisible={this.state.isMenuVisible} onMouseLeave={this.hideMenu} />
//         <Breadcrumbs list={this.state.breadcrumbs} />
//         <Content component={this.state.component} />
//       </div>
//     );
//   }
// }

// export default App;
