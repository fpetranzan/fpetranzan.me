import { useTranslations } from "next-intl";

export default function Experience({ experience }: { experience: string }) {
    const t = useTranslations('experiences');
    const experienceData = t.raw(`${experience}`) as { 
        name: string; 
        role: string; 
        start: string; 
        end: string; 
        tecnologies: { [key: string]: string };
        description: string;
    };

    if (!experienceData) {
        return null;
    }

    const tecnologies = experienceData.tecnologies ? Object.keys(experienceData.tecnologies) : [];

    return (<>
        <div className="my-5">
            <p className="text-xl sm:text-2xl">{t(`${experience}.name`)}</p>
            <hr />
            <div className="flex mt-3 items-center">
                <p className="mr-auto text-md sm:text-lg">{t(`${experience}.role`)}</p>
                <p className="text-sm font-light sm:text-base">{t(`${experience}.start`)} - {t(`${experience}.end`)}</p>
            </div>
            <div className="flex gap-1 my-2 sm:my-3">
                {
                    tecnologies.map((tecnology) => (
                        <div key={tecnology} className="border border-slate-400 rounded w-fit px-1">
                            <span className="text-xs tracking-wide sm:text-sm">
                                {t(`${experience}.tecnologies.${tecnology}`)}
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