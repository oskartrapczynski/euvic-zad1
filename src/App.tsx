import { useMediaQuery, useTheme } from '@mui/material';
import Form from './components/Form';

const App = () => {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('lg'));
  const tablet = useMediaQuery(theme.breakpoints.up('sm'));
  const mobile = useMediaQuery(theme.breakpoints.up('xs'));

  const styles = () => {
    if (desktop) return { width: 500 };
    if (tablet) return { width: 400 };
    if (mobile) return { width: '90%', maxWidth: 400 };
  };

  return <Form styles={styles()} />;
};

export default App;
