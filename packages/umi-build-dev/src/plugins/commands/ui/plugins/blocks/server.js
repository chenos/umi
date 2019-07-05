import getRouteManager from '../../../getRouteManager';

export function routeExists(path, routes) {
  for (const route of routes) {
    if (route.routes && routeExists(path, route.routes)) {
      return true;
    }
    if (path === route.path) {
      return true;
    }
  }
  return false;
}

export default function(api) {
  function getRoutes() {
    const RoutesManager = getRouteManager(api.service);
    RoutesManager.fetchRoutes();
    return RoutesManager.routes;
  }

  function getBlocks() {
    // TODO: read from server
    return [
      'AccountCenter',
      'AccountSettings',
      'DashboardAnalysis',
      'DashboardMonitor',
      'DashboardWorkplace',
      'EditorFlow',
      'EditorKoni',
      'EditorMind',
      'Exception403',
      'Exception404',
      'Exception500',
      'FormAdvancedForm',
      'FormBasicForm',
      'FormStepForm',
      'ListBasicList',
      'ListCardList',
      'ListSearch',
      'ListSearchApplications',
      'ListSearchArticles',
      'ListSearchProjects',
      'ListTableList',
      'ProfileAdvanced',
      'ProfileBasic',
      'ResultFail',
      'ResultSuccess',
      'UserLogin',
      'UserRegister',
      'UserRegisterResult',
    ];
  }

  api.onUISocket(({ action: { type, payload }, send, log }) => {
    switch (type) {
      case 'blocks/fetch':
        send({
          type: `${type}/success`,
          payload: getBlocks(),
        });
        break;
      case 'blocks/add':
        log('Adding...');
        const { name } = payload;
        api.service
          .runCommand('block', {
            _: ['add', name, '--path', payload.path],
          })
          .then(() => {
            send({
              type: `${type}/success`,
            });
            log('Done');
          })
          .catch(e => {
            log('Failed');
          });
        break;
      case 'blocks/checkExists':
        const { path } = payload;
        const routes = getRoutes();
        send({
          type: `${type}/success`,
          payload: routeExists(path, routes),
        });
        break;
      default:
        send({
          type: `${type}/failure`,
          payload: `unhandled type: ${type}`,
        });
        break;
    }
  });
}
