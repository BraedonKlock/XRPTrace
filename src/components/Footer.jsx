import "../components/Footer.css";

export default function Footer() {
  return (
    <footer>
      <p className="footer-title">XRPTrace</p>
      <h6>Copyright {new Date().getFullYear()}</h6>
    </footer>
  );
}
