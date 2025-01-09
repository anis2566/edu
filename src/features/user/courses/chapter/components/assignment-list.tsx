import { Assignment } from "@prisma/client"

interface Props {
    assignment: Assignment | null
}

export const AssignmentList = ({ assignment }: Props) => {
    return <div>AssignmentList</div>
}
