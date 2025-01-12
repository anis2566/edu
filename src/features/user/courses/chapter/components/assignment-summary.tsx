import { RefreshCcw, Send } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AssignmentSummaryProps {
    title: string;
    status: string;
}

export const AssignmentSummary = ({ title, status }: AssignmentSummaryProps) => {
    return (
        <Card className="h-full max-h-fit overflow-y-auto">
            <CardHeader>
                <CardTitle>Assignment</CardTitle>
                <CardDescription>
                    Summary of the assignment
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center gap-x-3">
                    <Send />
                    <Badge variant="outline">Not submitted</Badge>
                </div>
                <div className="flex items-center gap-x-3">
                    <RefreshCcw />
                    <Badge variant="default" className="rounded-full">{status}</Badge>
                </div>
                <Button variant="outline" className="ml-auto flex">Submit Assignment</Button>
            </CardContent>
        </Card>
    )
}
