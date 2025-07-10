import About from "./about"
import Certifications from "./certifications"
import Education from "./education"
import Experience from "./experience"
import Projects from "./projects"
import Skills from "./skills"

export default function Content() {
  return (
    <div className="space-y-8">
      <div id="about">
        <About />
      </div>
      <div id="education">
        <Education />
      </div>
      <div id="certifications">
        <Certifications />
      </div>
      <div id="experience">
        <Experience />
      </div>
      <div id="skills">
        <Skills />
      </div>
      <div id="projects">
        <Projects />
      </div>
    </div>
  )
}
