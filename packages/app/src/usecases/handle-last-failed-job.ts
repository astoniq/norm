export type HandleLastFailedJobOptions = {
    queueNextJob: () => void
}

export const creatHandleLastFailedJobUseCase = (
    options: HandleLastFailedJobOptions
) => {

    const {queueNextJob} = options

    return () => {
        queueNextJob()
    }
}