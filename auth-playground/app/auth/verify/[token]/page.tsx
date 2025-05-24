import { VerificationContent } from "@/components/VerificationContent";
// import { use } from 'react';

export default function VerifyPage({
    params,
}: {
    params: { token: string }
}) {
    return <VerificationContent token={params.token} />
}