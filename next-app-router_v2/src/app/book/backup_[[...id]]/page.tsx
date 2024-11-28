export default async function Page({
    params,
}: {params: Promise<{id: string}>}) {               // [!] 최신 버전에서는(2024.10경) Promise 로 type이 바뀜(그 전에는 아니였음)
    const { id } = await params; 

    return <div>book/[id] 페이지 : {id}</div>
}