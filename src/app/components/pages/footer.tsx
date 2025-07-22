export default function Footer() {
  return (
    <footer className="p-4 text-center text-sm text-gray-500">
      © {new Date().getFullYear()} Powered by{" "}
      <a 
        href="https://dancahtechnology.co.ke" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        Dancah Technology
      </a>
    </footer>
  );
}