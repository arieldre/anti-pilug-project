import signupBackground from '../assets/images/signupbackground.png';

interface BackgroundConfig {
  gradient: string;
  pattern: string;
}

export const backgroundStyles: BackgroundConfig = {
  gradient: 'linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.85))',
  pattern: signupBackground
};

export const getBackgroundStyle = (): React.CSSProperties => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem 1rem',
  background: `${backgroundStyles.gradient}, url(${backgroundStyles.pattern})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed'
});