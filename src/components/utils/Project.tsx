import { useTranslations } from "next-intl";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

export default function Project({ project }: { project: string }) {
    const t = useTranslations('projects');
    const projectData = t.raw(`${project}`) as { 
        name: string; 
        year: string; 
        tecnologies: { [key: string]: string };
        description: string;
        link?: string;
        liveUrl?: string;
    };

    if (!projectData) {
        return null;
    }

    const tecnologies = projectData.tecnologies ? Object.keys(projectData.tecnologies) : [];

    return (<>
        <div className="my-5">
            <div className="flex items-end mt-3">
                <p className="text-xl mr-2 sm:text-2xl">{projectData.name}</p>
                {projectData.liveUrl && (
                    <a href={projectData.liveUrl} target="_blank" className="block w-min">
                        <div className="flex items-center gap-1 border border-slate-400 rounded w-fit px-1 py-0.5">
                            <FaExternalLinkAlt className="text-base"/>
                        </div>
                    </a>
                )}
                <p className="text-sm font-light sm:text-base ml-auto">{projectData.year}</p>
            </div>
            <hr />
            <div className="flex gap-1 my-2 sm:my-3">
                {
                    tecnologies.map((tecnology) => (
                        <div key={tecnology} className="border border-slate-400 rounded w-fit px-1">
                            <span className="text-xs tracking-wide sm:text-sm">
                                {projectData.tecnologies[tecnology]}
                            </span>
                        </div>
                    ))
                }
            </div>
            <div className="my-2 text-sm sm:my-3 sm:text-base">
                <div dangerouslySetInnerHTML={{ __html: projectData.description }} />
            </div>
            <div className="flex gap-2">
                {projectData.link && (
                    <a href={projectData.link} target="_blank" className="block w-min">
                        <div className="flex items-center gap-1 border border-slate-400 rounded w-fit px-1 py-0.5">
                            <FaGithub className="text-base"/>
                            <span className="text-xs tracking-wide sm:text-sm">Github</span>
                        </div>
                    </a>
                )}
            </div>
        </div>
    </>);
}