import Menu from "../pages/menu/index";

const layoutStyle = {
  margin: 20,
  padding: 20,
};

const Layout = (props) => (
  <div style={layoutStyle}>
    <Menu></Menu>
    {props.children}
  </div>
);

export default Layout;