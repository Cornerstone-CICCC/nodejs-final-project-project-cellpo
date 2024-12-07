const Button = ({ children }) => {
  return (
    <button className="p-3 px-10 text-3xl transition-all duration-300 bg-green-600 rounded-full font-MICRO text-slate-200 hover:bg-green-700">
      {children}
    </button>
  );
};

export default Button;
