import { ResetContent } from "@/components/ResetContent"

export default function ResetPage({
    params,
}: {
    params: { token: string }
}) {
    return <ResetContent token={params.token} />
}