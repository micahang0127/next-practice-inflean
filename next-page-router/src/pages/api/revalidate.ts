import { NextApiRequest, NextApiResponse } from "next";

/*
    [!] On-Demand ISR 방식.
        사용자의 요청 시마다 전체페이지를 렌러링(빌드타임)한다. 
        
        <domain>/revalidate/api 를 요청하면(해당 페이지 아래 함수 요청) 빌드타임을 진행한다.

        : 요즘 Next.js를 사용할 때 사람들이 많이 사용하고 있는 방식 

*/
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
){
    try {
        await res.revalidate("/");
        return res.json({ revalidate: true });
    } catch (err) {
        res.status(500).send("Revalidation Failed")
    }

}