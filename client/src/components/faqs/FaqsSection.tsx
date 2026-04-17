import { useState } from "react";
import "../../styles/faqs.css";

const FAQS = [
  {
    q: "Why is having a TIN (Tax Identification Number) important?",
    a: "Having a TIN is crucial for verifying your tax identity and ensuring you can operate legally. From 2026, it will be mandatory for most financial activities, and having a TIN ensures you won’t face penalties, account restrictions, or legal issues.",
  },
  {
    q: "Will my account be blocked if I don’t have a TIN?",
    a: "Certain financial activities may be restricted without a valid TIN once enforcement becomes mandatory.",
  },
  {
    q: "Is it legal to use this platform for my taxes?",
    a: "Yes. The platform complies with Nigerian tax regulations and supports lawful tax management.",
  },
  {
    q: "Does the platform automatically file my taxes?",
    a: "The platform assists with preparation and compliance. Automatic filing depends on tax type and regulations.",
  },
  {
    q: "How does the AI Tax Advisor work?",
    a: "It analyzes your data and provides insights, reminders, and optimization recommendations.",
  },
  {
    q: "How can I maximize my deductions?",
    a: "By tracking expenses accurately and applying eligible deductions suggested by the platform.",
  },
  {
    q: "How do I know when to file my taxes?",
    a: "You’ll receive alerts and reminders based on your tax obligations.",
  },
  {
    q: "Is my data safe and secure?",
    a: "Yes. We use encryption and security best practices to protect your data.",
  },
];

export default function FaqsSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const [search, setSearch] = useState("");

  const filteredFaqs = FAQS.filter(f =>
    f.q.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="faqs-wrapper">
      {/* HERO */}
      <div className="faqs-hero glass">
        <img src="/assets/images/faq-hero.png" alt="FAQs" />
        <h1>Frequently Asked Questions</h1>
        <p>
          Got questions? We’re here to assist. Here are answers to some of the
          most common questions about our platform and tax compliance in Nigeria.
        </p>

        <input
          type="text"
          placeholder="Search FAQs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* FAQ LIST */}
      <div className="faq-list">
        {filteredFaqs.map((item, index) => (
          <div key={index} className="faq-item glass">
            <button
              className="faq-question"
              onClick={() =>
                setOpenIndex(openIndex === index ? -1 : index)
              }
            >
              <span>{item.q}</span>
              <span className="toggle">{openIndex === index ? "−" : "+"}</span>
            </button>

            {openIndex === index && (
              <div className="faq-answer">
                <p>{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* SUPPORT CTA */}
      <div className="faq-cta glass">
        <img
          src="/assets/images/support-headset.png"
          alt="Support"
        />
        <h2>Need More Help?</h2>
        <p>
          Didn’t find the answer you were looking for? Our support team is here
          to assist you.
        </p>
        <button className="btn-primary">Contact Support</button>
      </div>

      {/* FOOTER */}
      <footer className="faq-footer">
        <div className="footer-grid">
          <div>
            <img src="/assets/images/footer-logo.png" alt="Logo" />
          </div>

          <div>
            <h4>Company</h4>
            <p>About Us</p>
            <p>Features</p>
            <p>Pricing</p>
            <p>Contact</p>
          </div>

          <div>
            <h4>Resources</h4>
            <p>FAQs</p>
            <p>Help Center</p>
            <p>Blog</p>
          </div>

          <div>
            <h4>Follow Us</h4>
            <div className="socials">
              <img src="/assets/images/facebook.png" />
              <img src="/assets/images/twitter.png" />
              <img src="/assets/images/linkedin.png" />
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
}