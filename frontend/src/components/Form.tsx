interface FormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  frag: boolean;
  errorMessage: string;
}
const Form: React.FC<FormProps> = ({ onSubmit, frag, errorMessage }) => {
  return (
    <div className="">
      <h2 className="p-10 text-5xl font-semibold font-MICRO">
        {frag ? "Sign Up" : "Log In"}
      </h2>

      <form action="" className="w-full" onSubmit={onSubmit}>
        <label htmlFor="username" className="text-3xl font-MICRO">
          Username
        </label>
        <input
          type="text"
          name="username"
          id="username"
          autoComplete="off"
          required
          className={`${
            errorMessage === "User not found" ? "border-rose-500" : ""
          } ${
            errorMessage === "The Username is already used"
              ? "border-rose-500"
              : ""
          } block w-[90%] border-2 bg-stone-700 border-none outline-none p-1`}
        />
        <label htmlFor="password" className="text-3xl font-MICRO">
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          autoComplete="off"
          required
          className={`${
            errorMessage === "Passwords do not match" ? "border-rose-500" : ""
          } block w-[90%] bg-stone-700 border-2 border-none outline-none p-1`}
        />

        <button
          type="submit"
          className="p-2 px-4 text-2xl bg-blue-700 text-stone-200 font-MICRO"
        >
          {frag ? "Sing Up" : "Log In"}
        </button>
      </form>
    </div>
  );
};

export default Form;
