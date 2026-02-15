import Image from "next/image";
import Social from "../utils/Social";

export default function Footer() {

  return (<>
        <hr className="my-3 sm:my-0"/>
        <Social />
        <div className="flex items-end gap-4 mb-12 text-sm sm:mb-16 sm:text-base">
          <p>fpetranzan.me - My personal Portfolio © 2025-2026 Francesco Petranzan.</p>
        </div>
    </>
  );
};