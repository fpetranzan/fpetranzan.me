import { useTranslations } from "next-intl";

export default function Experience({ experience }: { experience: string }) {
    const t = useTranslations('experiences');
    const experienceData = t.raw(`${experience}`) as { 
        name: string; 
        role: string; 
        start: string; 
        end: string; 
        technologies: { [key: string]: string };
        description: string;
    };

    if (!experienceData) {
        return null;
    }

    const technologies = experienceData.technologies ? Object.keys(experienceData.technologies) : [];

    return (<>
        <div className="my-5">
            <p className="text-xl sm:text-2xl">{t(`${experience}.name`)}</p>
            <hr />
            <div className="flex mt-3 items-center">
                <p className="mr-auto text-md sm:text-lg">{t(`${experience}.role`)}</p>
                <p className="text-sm font-light sm:text-base">{t.rich(`${experience}.start`)} - {t.rich(`${experience}.end`)}</p>
            </div>
            <div className="flex flex-wrap gap-1.5 my-2 sm:my-3">
                {
                    technologies.map((technology) => (
                        <div key={technology} className="border border-slate-400 rounded px-1.5 py-0.5">
                            <span className="text-xs tracking-wide whitespace-nowrap sm:text-sm">
                                {t(`${experience}.technologies.${technology}`)}
                            </span>
                        </div>
                    ))
                }
            </div>
            <div className="my-2 text-sm sm:my-3 sm:text-base">
                <div dangerouslySetInnerHTML={{ __html: experienceData.description }} />
            </div>
        </div>
    </>);
}