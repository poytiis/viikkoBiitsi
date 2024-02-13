import './Layout.scss';
import Header from '../Header/Header';

const Layout = (props) => {
  return (
    <div className='layout'>
      <Header/>
      {props.children}
    </div>
  );
}

export default Layout;
