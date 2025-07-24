import { FaWhatsapp } from "react-icons/fa";


export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/919304486229?text=Hello%20"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-16 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="text-3xl" />
    </a>
  );
}
