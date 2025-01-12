import { Suspense } from "react"
import { Metadata } from "next"

import { Loader } from "@/components/loader"
import { FailedCard } from "@/features/payment/components/failed-card"

export const metadata: Metadata = {
    title: "EduConnect | Payment Failed",
    description: "EduConnect",
}

const PaymentFailed = () => {
    return (
        <Suspense fallback={<Loader />}>
            <FailedCard />
        </Suspense>
    )
}

export default PaymentFailed