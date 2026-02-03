'use client'

import { useSearchParams } from 'next/navigation'
import ApplicationPreview from '@/components/application-preview'
import React, { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'

const ViewApplicationPage = () => {
    const searchParams = useSearchParams()
    const aid = searchParams.get('aid')
    const ano = searchParams.get('ano')
    const [isReady, setIsReady] = useState(false)
    const [applicationNo, setApplicationNo] = useState(null)
    const [applicationID, setApplicationID] = useState(null)

    useEffect(() => {
        if (aid && ano) {
            const decoded_aid = atob(aid)
            const decoded_ano = atob(ano)

            setApplicationNo(decoded_ano)
            setApplicationID(decoded_aid)
            setIsReady(true)
        } else {
            setIsReady(false)
        }
    }, [aid, ano])

    return (
        <div className="p-2">
            {isReady ? (
                <div>
                    <ApplicationPreview
                        applicationNo={applicationNo}
                        applicationID={applicationID}
                    />
                    <div className="flex justify-center items-center gap-2 text-xl my-5">
                        <AlertCircle className="text-violet-500" />
                        Declaration
                    </div>
                    <span className="text-black text-center mt-4 flex px-10">
                        I hereby declare that the information provided above is true and correct to the best of my knowledge and belief and based on valid documents in my possession which I shall produce any time for verification. I further understand that mere registration through this portal does not entitle me to any instant right to claim benefits.
                    </span>
                </div>
            ) : (
                <div className="space-y-4">
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-96 w-full" />
                </div>
            )}
        </div>
    )
}

export default ViewApplicationPage
