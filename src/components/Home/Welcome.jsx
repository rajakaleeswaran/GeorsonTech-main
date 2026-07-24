import { Link } from "react-router-dom";
import homeImg from "../../assets/Home/welcome.jpg";

function Welcome() {
  return (
    <section className="home-section">
      <div className="home-container home-grid">

        <div className="home-img" data-aos="zoom-in">
          <img src={homeImg} alt="home" />
        </div>

 <div className="home-content" data-aos="fade-left">
  <h2 className="home-title">ABOUT US</h2>

  <div className="home-text">
    <p>
      Formerly known as George Associates, established in 1984 by Mr. J.C.
      George Chockiah, who is a pioneer in the field of industrial engineering,
      providing business services focused mainly on electrical, mechanical, and
      industrial automation installation and maintenance for over 30 years.
    </p>

    <p>
      After continuously partnering with various MNCs like SIEMENS, GE, ABB,
      and SCHNEIDER and executing projects worth more than ₹20 crores over the
      past 10 to 15 years, the company was restructured in 2017 into two
      organizations: GEORGE MULTITECH SYSTEMS PVT. LTD. and GEORSONTECH PVT.
      LTD.
    </p>

    <p>
      GEORGE MULTITECH SYSTEMS PVT. LTD. continues the industrial service
      business involving electrical, mechanical, and instrumentation solutions,
      whereas GEORSONTECH PVT. LTD. provides customized procurement, IoT, and
      Industry 4.0 solutions by enhancing traditional automation systems.
    </p>
  </div>

  <Link to="/about" className="home-about-but">
    Learn More
  </Link>
</div>
              

      </div>
    </section>
  );
}

export default Welcome;