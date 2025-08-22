import { useMessages } from 'next-intl';
import Project from '../utils/Project';

export default function ProjectsPage() {
  const messages = useMessages();
  const projects = messages.projects ? Object.keys(messages.projects) : [];
  
  // Sort projects by order field, fallback to alphabetical if no order
  const sortedProjects = projects.sort((a, b) => {
    const projectA = (messages.projects as any)[a];
    const projectB = (messages.projects as any)[b];
    
    const orderA = projectA?.order || 999;
    const orderB = projectB?.order || 999;
    
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    
    // If orders are equal, sort alphabetically
    return a.localeCompare(b);
  });

  return (<>
    {
      sortedProjects.map((project) => (
        <Project key={project} project={project} />
      ))
    }
  </>);
}