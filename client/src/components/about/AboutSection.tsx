import "../../styles/about.css";
import aboutus1 from "../../assets/images/aboutus1.jpg";
import aboutus2 from "../../assets/images/aboutus2.jpg";
import aboutus3 from "../../assets/images/aboutus3.jpg";
import transparencyicon from "../../assets/images/transparencyicon.jpg";
import integrity from "../../assets/images/integrity.jpg";
import innovate from "../../assets/images/innovate.jpg";
import aboutuspage from "../../assets/images/aboutusfrontpage.jpg"

export default function AboutSection() {
  return (
    <section className="about-wrapper">
      {/* HERO */}
      <div className="about-hero glass">
        <div className="about-hero-left">
          <h1>
            Empowering Nigerians with <br />
            Smarter Tax Solutions
          </h1>
          <p>
            Our mission is to simplify tax management and compliance, making it
            accessible and stress-free for everyone.
          </p>
        </div>

        <div className="about-hero-right">
          <img
            src={aboutuspage}
            alt="Nigeria Tax Illustration"
          />
        </div>
      </div>

      {/* CHALLENGES */}
      <div className="about-challenges">
        <h2>Addressing Nigeria’s Tax Challenges</h2>
        <p>
          As Nigeria moves towards a more digital and compulsory tax system by
          2026, we are here to help individuals and businesses navigate these
          changes confidently and effectively.
        </p>

        <div className="challenge-grid">
          <div className="challenge-card glass">
            <img src={aboutus1} alt="Problem" />
            <h3>The Problem</h3>
            <p>
              Complex tax laws and inconsistent enforcement cause confusion and
              risk for everyone.
            </p>
          </div>

          <div className="challenge-card glass">
            <img src={aboutus2} alt="Why Now" />
            <h3>Why Now?</h3>
            <p>
              By 2026, Federal Inland Revenue Service (FIRS) will enforce strict
              tax compliance, making TIN required for most financial activities.
            </p>
          </div>

          <div className="challenge-card glass">
            <img src={aboutus3} alt="Our Solution" />
            <h3>Our Solution</h3>
            <p>
              An AI-driven platform that ensures you stay compliant by
              explaining, tracking, and advising on your tax status.
            </p>
          </div>
        </div>
      </div>

      {/* MISSION */}
      <div className="about-mission">
        <h2>Simplifying Tax Chaos for a Prosperous Nigeria</h2>
        <p>
          We aim to demystify the tax process, provide actionable insights, and
          ensure that no Nigerian is left in the dark about their tax
          obligations.
        </p>

        <div className="values-grid">
          <div className="value-card glass">
            <img src={transparencyicon} alt="Transparency" />
            <h4>Transparency</h4>
            <p>Clear, honest, and understandable tax insights.</p>
          </div>

          <div className="value-card glass">
            <img src={integrity} alt="Integrity" />
            <h4>Integrity</h4>
            <p>Building trust through reliable and ethical practices.</p>
          </div>

          <div className="value-card glass">
            <img src={innovate} alt="Innovation" />
            <h4>Innovation</h4>
            <p>
              Leveraging technology to make tax management easier.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="about-cta glass">
        <img
          src="/assets/images/cta-wave.png"
          alt=""
          className="cta-bg"
        />
        <h2>Join Us in Transforming Tax Management in Nigeria</h2>
        <p>
          Be part of the change and help create a stress-free tax environment.
        </p>
        <button className="btn-primary">Get Started</button>
      </div>
    </section>
  );
}