export default function CookiesPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Cookies Policy</h1>
            <p className="text-lg text-gray-700 max-w-2xl text-center">
                This website uses cookies to enhance the user experience. By using our site, you agree to our use of cookies.
            </p>
            <p className="text-sm text-gray-500 mt-4">
                For more information, please read our <a href="/privacy-policy" className="text-blue-500 underline">Privacy Policy</a>.
            </p>
        </div>
    );
}