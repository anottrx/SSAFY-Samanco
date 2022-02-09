import Router from 'next/router';

const forceReload = () => {
  console.log(Router);
  Router.reload(Router.pathname);
};
export default forceReload;
