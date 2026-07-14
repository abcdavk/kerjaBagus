import "./page.css";

export default function Home() {
  return (
    <main className="flex flex-col flex-1 font-sans">
      <section className="hero-section-container">
        <div className="hero-section-content">
          <h1>Hweo section</h1>
          <p>Lorem ipsum dolor sit amet.</p>
        </div>
      </section>
      <section className="cta-container">
        <div className="cta-content">
          <h1>CTA</h1>
        </div>
      </section>
    </main>
  );
}