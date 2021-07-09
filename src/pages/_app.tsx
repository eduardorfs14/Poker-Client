import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/auth/AuthContext';
import ThemeContainer from '../contexts/theme/ThemeContainer';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ThemeContainer>
        <Component {...pageProps} />
      </ThemeContainer>
    </AuthProvider>
  );
};
export default MyApp;
