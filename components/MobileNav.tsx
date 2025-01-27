"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
const locations: { title: string; href: string; }[] = [
  {
    title: "OXFORD",
    href: "/location/oxford"
  },
  {
    title: "MUMBAI",
    href: "/location/mumbai"

  },
  {
    title: "LAGOS",
    href: "/location/lagos"

  },
  {
    title: "NEW YORK",
    href: "/location/new-york"

  },
  {
    title: "SAN FRANCISCO",
    href: "/location/san-francisco"
  },
  {
    title: "JAKARTA",
    href: "/location/jakarta"
  },
];

const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden sticky top-2 z-20 left-[90vw] sm:left-[96vw] mr-5">
        <HamburgerMenuIcon className="text-primary  w-5 h-5" />
      </SheetTrigger>
      <SheetContent>
        <SheetTitle className="flex flex-col mt-5 px-3">
        </SheetTitle>
        <Separator className="my-3" />
        <SheetDescription className="flex">
          <div className="flex flex-col gap-3 mt-1 text-base">
            <Link href={"/"} className="font-semibold hover:text-primary">
              Home
            </Link>
            <Link href={"/about"} className="font-semibold hover:text-primary">
              About
            </Link>
            <div className="font-semibold hover:text-primary">
              <Link href="/locations">Locations</Link>
              <ul className="ml-5">
                {locations.map((location) => (<li key={location.title}><Link href={location.href}>{location.title}</Link></li>))}
              </ul>
            </div>
            {/* <Link href={"/report"} className="font-semibold hover:text-primary">
              GENERATE REPORT
            </Link> */}
          </div>
        </SheetDescription>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
