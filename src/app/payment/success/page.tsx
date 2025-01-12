import { Suspense } from "react"
import { Metadata } from "next"

import { Loader } from "@/components/loader"
import { SuccessCard } from "@/features/payment/components/success-card"

export const metadata: Metadata = {
    title: "EduConnect | Payment Success",
    description: "EduConnect",
}

const PaymentSuccess = () => {
    return (
        <Suspense fallback={<Loader />}>
            <SuccessCard />
        </Suspense>
    )
}

export default PaymentSuccess