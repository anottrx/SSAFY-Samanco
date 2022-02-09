import MyInfoMenu from '../../pages/myinfo/myinfoMenu';

const MyInfolayoutStyle = {
  margin: 20,
  padding: 20,
};

const MyInfoLayout = (props) => (
  <div style={MyInfolayoutStyle}>
    <MyInfoMenu></MyInfoMenu>
    {props.children}
  </div>
);

export default MyInfoLayout;
