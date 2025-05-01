import * as React from 'react';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Dashboard from './Dashboard';
import Message from './Messages';
import Account from './Account';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

// Here is the export statement
export default function BasicTabs() {
  const navigate = useNavigate();
  const location = useLocation();

  // Set the active tab based on the current URL
  const getTabValue = () => {
    switch (location.pathname) {
      case '/mentor/dashboard/message':
        return 1;
      case '/mentor/dashboard/account':
        return 2;
      default:
        return 0;
    }
  };

  const [value, setValue] = React.useState(getTabValue());

  // Update tab value when URL changes
  React.useEffect(() => {
    setValue(getTabValue());
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);

    // Navigate to the appropriate route
    if (newValue === 0) {
      navigate('/mentor/dashboard/');
    } else if (newValue === 1) {
      navigate('/mentor/dashboard/message');
    } else if (newValue === 2) {
      navigate('/mentor/dashboard/account');
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider',display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Dashboard" {...a11yProps(0)} />
          <Tab label="Messages" {...a11yProps(1)} />
          <Tab label="Account" {...a11yProps(2)} />
        </Tabs>
      </Box>
    </Box>
  );
}