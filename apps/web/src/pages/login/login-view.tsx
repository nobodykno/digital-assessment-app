
import { ILoginViewProps } from '../../props/auth-props';

const LoginView = (props: ILoginViewProps) => {
  return (
    <div className="flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h1 id="auth-title" className="mb-6 text-center text-2xl font-bold">
        Login
        </h1>

        <form className="space-y-4"   aria-labelledby="auth-title"  onSubmit={props.submitForm}>


          <div>
            <label htmlFor="email" className="mb-1 block">Email</label>
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Enter your email"
              onChange={props.handleInputChange}
              className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block">Password</label>
            <input
              type="password"
              name="password"
              autoComplete="password"
              placeholder="Enter your password"
              onChange={props.handleInputChange}
              className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center">
        Don't have an account?

          <button
            type="button"
            onClick={() => props.navigateRegister()}
            className="ml-2 text-blue-600 hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginView;