export default function Hero() {
  return (
    <section
      id="home"
      className="bg-gradient-to-br from-primary-500 to-primary-600 text-white py-20 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up">
          Building the Future with Technology
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-8 opacity-95 max-w-3xl mx-auto animate-fade-in-up-delay">
          Innovative solutions that transform businesses and empower growth
        </p>
        <a
          href="#contact"
          className="btn-primary text-lg animate-fade-in-up-delay-2"
        >
          Get Started
        </a>
      </div>
    </section>
  );
}
