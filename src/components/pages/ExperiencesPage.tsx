import { useMessages } from 'next-intl';
import Experience from '../utils/Experience';

export default function ExperiencesPage() {
  const messages = useMessages();
  const experiences = Object.keys(messages.experiences);

  // Sort projects by order field, fallback to alphabetical if no order
  const sortedExperiences = experiences.sort((a, b) => {
    const experienceA = (messages.experiences as any)[a];
    const experienceB = (messages.experiences as any)[b];
    
    const orderA = experienceA?.order || 999;
    const orderB = experienceB?.order || 999;
    
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    
    // If orders are equal, sort alphabetically
    return a.localeCompare(b);
  });

  return (<>
    {
      sortedExperiences.map((experience) => (
        <Experience key={experience} experience={experience} />
      ))
    }
  </>);
}