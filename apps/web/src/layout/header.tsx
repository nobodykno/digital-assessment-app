import { useAuth } from '../hooks/useAuth';

/**
 * 
 * Business logic for header
 */
const Header = () => {
  const { token, logout } = useAuth();

  return (
    <header
      className="flex items-center justify-between border-b 
      border-[var(--color-border)] bg-[var(--color-surface)] px-6
    py-4
      "
    >
      <h1
        className=" text-[length:var(--font-size-xl)] font-[var(--font-weight-bold)] text-[var(--color-text-primary)]"
      >
        Digital Asset Management
      </h1>

      { token &&
      <button
        onClick={logout}
        className=" rounded-[var(--border-radius)] border border-[var(--color-primary)]
         bg-[var(--color-primary)] px-4  py-2 text-[length:var(--font-size-md)] 
         font-[var(--font-weight-medium)]  text-white transition hover:opacity-90
        "
      >
        Logout
      </button>
      }
    </header>
  );
};

export default Header;