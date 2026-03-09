interface AuthErrorMessageProps {
  message: string | null;
}

const AuthErrorMessage = ({ message }: AuthErrorMessageProps) => {
  if (!message) {
    return null;
  }

  return (
    <p 
      className="register-subtitle" 
      style={{ 
        fontSize: '1.05rem', 
        lineHeight: '1.5',
        padding: '14px 18px',
        background: 'rgba(255, 107, 107, 0.15)',
        border: '1px solid rgba(255, 107, 107, 0.4)',
        borderRadius: '8px',
        color: '#ff6b6b',
        marginBottom: '1.5rem',
        fontWeight: '500'
      }}
    >
      ⚠ {message}
    </p>
  );
};

export default AuthErrorMessage;

