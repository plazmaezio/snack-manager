interface AuthButtonsProps {
  onLogin: () => void;
  onSignup: () => void;
}

const AuthButtons = ({ onLogin, onSignup }: AuthButtonsProps) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={onLogin}
        className="px-4 py-2 bg-main-bg border border-ui-border rounded-md hover:border-brand transition-colors font-medium"
      >
        Login
      </button>
      <button
        onClick={onSignup}
        className="px-4 py-2 bg-brand text-white rounded-md hover:opacity-90 transition-opacity font-medium"
      >
        Sign Up
      </button>
    </div>
  );
};

export default AuthButtons;
