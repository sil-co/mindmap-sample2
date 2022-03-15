
const router = {
  init: (routes) => {
    router.routes = routes; // 例  {home: {…}, map: {…}, help: {…}}
    [router.home, router.homeRoute] = Object.entries(routes)[0]; // 0番目なのでhomeのkeyとvalueが返ってくる
    window.onpopstate = (e) => {
      console.log('[router init] onpopstate');
    }
    router.set();
    console.log(`[router] init, router.home: ${router.home}`);
  },

  setRoute: (route, param) => {
    console.log('[router] setRoute');
    let url = window.location.origin + '/' + route;
    if (param) {
      url += '/' + param;
    }
    window.history.pushState('', '', url);
    router.onChange();
  },

  getRoute: () => {
    console.log('[router] getRoute', router.route);
    return router.route;
  },

  getParams: () => {
    console.log('[router] getParams');
    return router.params;
  },

  set: () => {
    console.log('[router] set');
    const path = window.location.pathname; // 例 /map/1
    const routeName = path.split('/')[1]; // 例 ["map", "1"]
    router.route = router.routes[routeName] || router.homeRoute;
    router.params = path.split('/').slice(2);
  },

  callbacks: [],

  onChange: () => {
    router.set();
    router.callbacks.forEach(callback => callback());
    console.log('[router] onChange');
  },

  subscribe: (cb) => {
    router.callbacks.push(cb); // cb: ƒ onRouteChange()
    console.log('[router] subscribe');
  },
};

export default router;
