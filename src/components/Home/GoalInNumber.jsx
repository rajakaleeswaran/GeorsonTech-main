import React, { useRef } from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import {
  FaProjectDiagram, FaUsers, FaBuilding, FaIndustry, FaTools
} from 'react-icons/fa';
import '../../styles/Home.css';

// Use a fallback background if no dedicated image
import GoalBg from '../../assets/Home/Hero/hero2.png';

const STATS = [
  { icon: <FaProjectDiagram />, number: 500, suffix: "+", label: "Projects Completed" },
  { icon: <FaUsers />,          number: 15,  suffix: "+", label: "Satisfied Clients" },
  { icon: <FaBuilding />,       number: 3,   suffix: "",  label: "Office Locations" },
  { icon: <FaIndustry />,       number: 10,  suffix: "+", label: "Years Experience" },
];

function GoalInNumber() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <section className="goal-section" ref={ref}>
      <img src={GoalBg} alt="Industrial background" />
      <div className="goal-overlay">
        <h2 className="goal-title">GEORSON TECH IN NUMBERS</h2>
        <div className="goal-container">
          {STATS.map((stat, i) => (
            <div key={i} className="goal-card">
              <div className="goal-icon">{stat.icon}</div>
              <h3>
                {inView
                  ? <CountUp end={stat.number} duration={2.5} suffix={stat.suffix} />
                  : `0${stat.suffix}`
                }
              </h3>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default GoalInNumber;