import Router from 'next/router';

const forceReload = () => {
  Router.reload(window.location.pathname);
};
export default forceReload;
