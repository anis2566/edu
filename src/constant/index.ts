export enum GENDER {
    MALE = "male",
    FEMALE = "female",
    OTHER = "other",
};


type NavMenu = {
    title: string;
    href: string;
};

export const navs: NavMenu[] = [
    {
        title: "Home",
        href: "/",
    },
    {
        title: "Courses",
        href: "/user/courses",
    },
    {
        title: "FAQ",
        href: "/faq",
    },
    {
        title: "Contact",
        href: "/contact",
    },
];