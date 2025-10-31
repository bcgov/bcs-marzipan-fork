import logo from '../../assets/Logo.svg';
import styles from './Header.module.css'; 
import { Avatar, Button, Tooltip } from '@fluentui/react-components';
import { Alert24Regular, QuestionCircle24Regular } from '@fluentui/react-icons';

type HeaderProps = {
  // Add props here if needed in the future
};

const Header = ({}: HeaderProps) => {
  return (
    <header className={styles.header}>
      <img
        src={logo}
        alt="Logo"
        style={{ height: '40px', marginRight: '16px' }}
      />

      <div style={{
        marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px'     
        }}>
      <Tooltip content="Notifications" relationship="label">
        <Button icon={<Alert24Regular />} appearance="subtle" />
      </Tooltip>
      <Avatar name="HS" color="colorful" />
      </div> 
    </header>
  );
};

export default Header;