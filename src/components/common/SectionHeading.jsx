import Reveal from './Reveal'
import './common.css'

/** Consistent section eyebrow + title + lead paragraph. */
export default function SectionHeading({ eyebrow, title, lead, align = 'center' }) {
  return (
    <Reveal className={`section-heading align-${align}`}>
      {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
      <h2 className="section-title">{title}</h2>
      {lead && <p className="section-lead">{lead}</p>}
    </Reveal>
  )
}
