import React from 'react';
import logo from '../../assets/Logo.svg';
import { Avatar, Button, Tooltip } from '@fluentui/react-components';
import { Alert24Regular } from '@fluentui/react-icons';

const Header = () => {
  return (
    <header className="w-full py-2 px-20 h-14 border-b-2 border-[#f4f4f4] flex items-center box-border">
      <img src={logo} alt="Logo" className="h-10 mr-4" />

      <div className="ml-auto flex items-center gap-4">
        <Tooltip content="Notifications" relationship="label">
          <Button icon={<Alert24Regular />} appearance="subtle" />
        </Tooltip>
        <Avatar name="HS" color="colorful" />
      </div>
    </header>
  );
};

export default Header;
