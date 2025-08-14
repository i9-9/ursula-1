export default function AboutPage() {
  return (
    <main className="min-h-screen py-6 md:py-8 px-2.5 md:px-[15px]">
      <section className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="!text-2xl md:text-2xl uppercase">Ursula Benavidez</h1>
          <h2 className="text-xl md:text-md uppercase opacity-80">Production Designer ~ Art Director</h2>
        </header>

        <article className="space-y-4 text-sm md:text-base" style={{ color: 'var(--foreground)', opacity: 0.85 }}>
          <p>
            Production designer and art director specializing in crafting visual worlds that resonate with narrative depth and emotional texture.
          </p>
          <p>
            With a background rooted in both fine arts and cinematic storytelling, her work blends conceptual precision with tactile authenticity.
          </p>
          <p>
            Whether designing immersive sets for film, television, or commercial projects, Ursula approaches each frame as a carefully composed canvas, where every detail serves the story. She thrives on collaboration, pushing the boundaries of visual language while maintaining a grounded, human-centric aesthetic.
          </p>
        </article>

        <div className="my-8 border-t border-gray-300/20 dark:border-gray-700/20" />

        <section aria-labelledby="contact-heading" className="space-y-4">
          <h3 id="contact-heading" className="h2 text-xs md:text-sm">CONTACT</h3>

          <div className="space-y-0">
            <div className="group -mx-2 px-2 py-1">
              <div className="grid grid-cols-12 items-start text-p">
                <div className="col-span-5 md:col-span-4 pr-4">Location</div>
                <div className="col-span-7 md:col-span-8">Buenos Aires, Argentina</div>
              </div>
            </div>

            <div className="group -mx-2 px-2 py-1">
              <div className="grid grid-cols-12 items-start text-p">
                <div className="col-span-5 md:col-span-4 pr-4">Email</div>
                <div className="col-span-7 md:col-span-8">
                  <a href="mailto:info@ursulabenavidez.com" className="text-foreground hover:opacity-70 transition-opacity">
                    info@ursulabenavidez.com
                  </a>
                </div>
              </div>
            </div>

            <div className="group -mx-2 px-2 py-1">
              <div className="grid grid-cols-12 items-start text-p">
                <div className="col-span-5 md:col-span-4 pr-4">Instagram</div>
                <div className="col-span-7 md:col-span-8">
                  <a href="https://instagram.com/ursulabenavidez" target="_blank" rel="noopener noreferrer" className="text-foreground hover:opacity-70 transition-opacity">
                    @ursulabenavidez
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}


