const Footer = () => {
  return (
    <footer className="bottom-0 py-2 text-center bg-stone-700 text-stone-200 font-PIXELIFY">
      <span className="text-lg font-MICRO">&copy;</span>
      {new Date().getFullYear()} TIC-TAC-TOE | All Rights reserved.
    </footer>
  );
};

export default Footer;
