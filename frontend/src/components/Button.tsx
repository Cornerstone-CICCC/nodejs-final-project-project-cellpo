const Button = ({ children }) => {
  return (
    <button className="p-2 px-8 text-3xl transition-all duration-300 bg-green-600 font-MICRO text-slate-200 hover:bg-green-700">
      {children}
    </button>
  );
};

export default Button;
