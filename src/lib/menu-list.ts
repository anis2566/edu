import {
    LayoutGrid,
    LucideIcon,
    List,
    Layers3,
    MessageCircleQuestion,
    PlusCircle,
    MessageCircleWarning,
    CalendarArrowUp,
    GalleryVertical,
    Users,
    Radio,
    UserCheck,
    BookOpen,
    BookOpenCheck,
    FileText,
    MessagesSquare,
    UserCog,
    FileSpreadsheet,
} from "lucide-react";

type Submenu = {
    href: string;
    label: string;
    active: boolean;
    icon: LucideIcon;
};

type Menu = {
    href: string;
    label: string;
    active: boolean;
    icon: LucideIcon;
    submenus: Submenu[];
};

type Group = {
    groupLabel: string;
    menus: Menu[];
};

export function getAdminMenuList(pathname: string): Group[] {
    return [
        {
            groupLabel: "",
            menus: [
                {
                    href: "/dashboard",
                    label: "Dashboard",
                    active: pathname === "/dashboard",
                    icon: LayoutGrid,
                    submenus: [],
                },
            ],
        },
        {
            groupLabel: "Main",
            menus: [
                {
                    href: "",
                    label: "category",
                    active: pathname.includes("/dashboard/category"),
                    icon: Layers3,
                    submenus: [
                        {
                            href: "/dashboard/category/new",
                            label: "New",
                            active: pathname === "/dashboard/category/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/dashboard/category",
                            label: "List",
                            active: pathname === "/dashboard/category" || pathname.split("/").length > 4,
                            icon: List,
                        },
                    ],
                },
                {
                    href: "",
                    label: "Course",
                    active: pathname.includes("/dashboard/course"),
                    icon: BookOpen,
                    submenus: [
                        {
                            href: "/dashboard/course/new",
                            label: "New",
                            active: pathname === "/dashboard/course/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/dashboard/course",
                            label: "List",
                            active: pathname === "/dashboard/course",
                            icon: List,
                        },
                    ],
                },
                {
                    href: "/dashboard/assignment",
                    label: "Assignment",
                    active: pathname.includes("/dashboard/assignment"),
                    icon: FileSpreadsheet,
                    submenus: [],
                },
                {
                    href: "/dashboard/review",
                    label: "Review",
                    active: pathname.includes("/dashboard/review"),
                    icon: MessageCircleWarning,
                    submenus: [],
                },
                {
                    href: "/dashboard/question",
                    label: "Question",
                    active: pathname.includes("/dashboard/question"),
                    icon: MessageCircleQuestion,
                    submenus: [],
                },
                {
                    href: "",
                    label: "Banner",
                    active: pathname.includes("/dashboard/banner"),
                    icon: GalleryVertical,
                    submenus: [
                        {
                            href: "/dashboard/banner/new",
                            label: "New",
                            active: pathname === "/dashboard/banner/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/dashboard/banner",
                            label: "List",
                            active: pathname === "/dashboard/banner",
                            icon: List,
                        },
                    ],
                },
            ],
        },
        {
            groupLabel: "Seller",
            menus: [
                {
                    href: "",
                    label: "Seller",
                    active: pathname === "/admin/seller",
                    icon: Users,
                    submenus: [
                        {
                            href: "/dashboard/seller/new",
                            label: "New",
                            active: pathname === "/dashboard/seller/new",
                            icon: PlusCircle,
                        },
                        {
                            href: "/dashboard/seller/request",
                            label: "Request",
                            active: pathname === "/dashboard/seller/request",
                            icon: Radio,
                        },
                        {
                            href: "/dashboard/seller",
                            label: "List",
                            active: pathname === "/dashboard/seller",
                            icon: List,
                        },
                    ],
                },
            ],
        },
        {
            groupLabel: "Promotion",
            menus: [
                {
                    href: "/dashboard/subscribers",
                    label: "Subscribers",
                    active: pathname.includes("/dashboard/subscribers"),
                    icon: UserCheck,
                    submenus: [],
                },
            ],
        },
    ];
}


export function getMenuListUser(pathname: string): Group[] {
    return [
        {
            groupLabel: "",
            menus: [
                {
                    href: "/user",
                    label: "Dashboard",
                    active: pathname === "/user",
                    icon: LayoutGrid,
                    submenus: [],
                },
                {
                    href: "/user/courses",
                    label: "Courses",
                    active: pathname.includes("/user/courses"),
                    icon: BookOpen,
                    submenus: [],
                },
                {
                    href: "/user/my-courses",
                    label: "My Courses",
                    active: pathname === "/user/my-courses",
                    icon: BookOpenCheck,
                    submenus: [],
                },
                {
                    href: "/user/questions",
                    label: "Questions",
                    active: pathname.includes("/user/questions"),
                    icon: MessageCircleQuestion,
                    submenus: [],
                },
                {
                    href: "/user/assignments",
                    label: "Assignments",
                    active: pathname.includes("/user/assignments"),
                    icon: FileText,
                    submenus: [],
                },
                {
                    href: "/user/profile",
                    label: "Profile",
                    active: pathname === "/user/profile",
                    icon: UserCog,
                    submenus: [],
                },
            ],
        },
    ];
}

