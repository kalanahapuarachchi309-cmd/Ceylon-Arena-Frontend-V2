interface AuthErrorMessageProps {
  message: string | null;
}

const AuthErrorMessage = ({ message }: AuthErrorMessageProps) => {
  if (!message) {
    return null;
  }

  return <p className="register-subtitle">{message}</p>;
};

export default AuthErrorMessage;

