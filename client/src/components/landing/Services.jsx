const services = [
  {
    icon: '🌐',
    title: 'Web App Development',
    description: 'Custom web applications built with modern technologies. From responsive websites to complex enterprise solutions.',
  },
  {
    icon: '🖥️',
    title: 'Server Hosting',
    description: 'Reliable and scalable server hosting solutions. High-performance infrastructure for your applications.',
  },
  {
    icon: '📱',
    title: 'Mobile App Development',
    description: 'Native and cross-platform mobile applications for iOS and Android that deliver exceptional user experiences.',
  },
  {
    icon: '📊',
    title: 'Data Analytics',
    description: 'Transform raw data into actionable insights. Advanced analytics and visualization for informed decision-making.',
  },
  {
    icon: '⚙️',
    title: 'DevOps',
    description: 'Streamline your development process with CI/CD pipelines, containerization, and infrastructure automation.',
  },
];

export default function Services() {
  return (
    <section id="services" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-heading">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <div key={index} className="card">
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-primary-500 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
