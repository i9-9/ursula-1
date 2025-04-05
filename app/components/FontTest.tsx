'use client';

const FontTest = () => {
  return (
    <section className="py-20 px-4 md:px-8 space-y-8">
      <h2 className="text-2xl mb-12 tracking-wide">FONT TEST</h2>
      
      <div className="space-y-4">
        <p className="font-neue-montreal font-thin">Thin weight text - PP Neue Montreal Mono</p>
        <p className="font-neue-montreal font-light">Light weight text - PP Neue Montreal Mono</p>
        <p className="font-neue-montreal">Regular weight text - PP Neue Montreal Mono</p>
        <p className="font-neue-montreal font-medium">Medium weight text - PP Neue Montreal Mono</p>
        <p className="font-neue-montreal font-bold">Bold weight text - PP Neue Montreal Mono</p>
        <p className="font-neue-montreal italic">Italic text - PP Neue Montreal Mono</p>
        <p className="font-neue-montreal font-bold italic">Bold Italic text - PP Neue Montreal Mono</p>
      </div>
    </section>
  );
};

export default FontTest; 