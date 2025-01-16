"use client";

import { useRef, useState } from "react";
import { NotificationCell, NotificationFeedPopover, NotificationIconButton } from "@knocklabs/react";
import Link from "next/link";

import "@knocklabs/react/dist/index.css";

export const Notification = () => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const notifButtonRef = useRef<HTMLButtonElement | null>(null);

    return (
        <div>
            <NotificationIconButton
                ref={notifButtonRef}
                onClick={() => setIsVisible(!isVisible)}
            />
            <NotificationFeedPopover
                buttonRef={notifButtonRef as React.RefObject<HTMLElement>}
                isVisible={isVisible}
                onClose={() => setIsVisible(false)}
                renderItem={({ item, ...props }) =>
                    item?.data?.redirectUrl ? (
                        <Link href={item.data.redirectUrl} key={item.id} onClick={() => setIsVisible(false)}>
                            <NotificationCell {...props} item={item} />
                        </Link>
                    ) : (
                        <NotificationCell key={item.id} {...props} item={item} />
                    )
                }
            />
        </div>
    );
};
