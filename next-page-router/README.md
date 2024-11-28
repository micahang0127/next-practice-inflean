
## Next.js

    ### build

    ```
        $ npm run build  
        빌드하면, (터미널 코드에서) 각 페이지 별 자바스크립트 번들의 용량이 출력되어 확인할 수 있다.

    ```


    ### 페이지 이동 : Link  VS  <a> tag 
    
    ```
        <a> tag는 서버에서 다시 페이지를 그리는 방식이기 때문에, 
           import Link from "next/link" 
        를 통하여 next 내장 모듈의 Link를 사용하는 것이 좋다. 
    
    ```


    ### 프리페칭 (Pre-fetching)

    ```
        모든 페이지들을 사전에 미리 다 불러와 놓는 기능.

        좀 더 상세히는 
        next는 처음 접속하는 url(요청 페이지)에 대해서만 JS Bundle 하여 구성하여 접속 속도를 높이고,
        첫 페이지에 접속하고 난 뒤, (프리패칭) 다른 모든 페이지의 JS Bundle을 모두 진행하여, 다른 페이지를 접속할 때, 더욱 빠르게 접속할 수 있도록 한다. 

        단, npm run dev 로 실행 시키면, 프리패칭 작업을 실행하지 않는다. 
        즉, npm run dev 로 실행시킬 때에는 development 에서 실행 되기 때문에 프리패칭이 실행 되지 않는다.
        따라서, 프리패칭을 화인하려면, production 모드로 실행해야 한다. 
        => 빌드 후, npm run start
            $ npm run build
            $ npm run start


        이는 Link (next/link)를 통한 라우터 이동에서 작동하고, 
        button onClick 으로 처리한 부분에서는 프리페칭이 작동하지 않는다. 

        button onClick에서 프리페칭을 진행하려면, 아래와 같이 처리 할 수 있다. (처음 페이지 마운트 시, 지정한 url에 대해서 js 파일을 프리패칭 하라고 명시)

                const onClickButton = () => {
                    router.push("/test")
                }

                useEffect(() => {
                    router.prefetch('/test')
                }, [])

                <button onClick={onClickButton}>/test 페이지로 이동</button>



        [프리패칭 해제]
            잘 접속하지 않을 거 같은 페이지 등에 대해서 아래와 같이 프리패칭을 해제할 수 있다.

            <Link  href={"/search"} prefetch={false}>search</Link>
            
        




        [확인]
        크롬 개발자모드 Network tab에서 확인해 보면,
        첫 페이지 접속 시, 다른 페이지들의 [~~.js] 도 미리 불러오고, 그 각기 페이지를 접속했을 때, Network tab 에서 아무런 요청이 없는 것을 확인할 수 있다. 
        (간혹 요청이 된다면, 세션이 만료되어 그런거임)



    
    ```
        


    ### Style - 페이지 별 css파일 import : CSS Module

    ```
        next에서는 root에 있는 <_app.tsx> 파일에서만 .css 파일을 import 할 수 있음 (css의 충돌을 막기위해 원천차단)

        페이지 별로 특정 .css 파일을 import 하여 사용 할 때에는 [CSS Module]을 사용한다. 
             [css]: 
                파일명: [search.module.css]
                사용: .divblue { color: red}

             [사용]: 
                import style from " ./index.module.css";

                <div className={style.divblue}>스타일</div>

            [확인]:
                크롬-개발자모드-Element 에서 확인해 보면, 
                해당 부분에 자동으로 유니크한 class명이 지정되어 있는 것을 확인 할 수 있음.

    ```



    ### Layout
    
    ```
        _app.tsx (root) 파일에서 전체 layout 코드(header, footer)를 넣으면 됨.

        components 파일로 빼도 됨.
    
    ```


## 실행 / 렌더링 

    ```
        * 디버그 - 개발모드 확인
            개발모드에서는 설정해둔 사전 렌더링 방식이 SSG, SSR 뭐든 간에 그냥 요청을 받을 때마다 계속해서 새롭게 페이지를 사전 렌더링 한다.     
            따라서, SSG 동작이 잘 이루어 지는지 등을 개발중에 제대로 확인하려면, 빌드 후 -> production 모드로 실행해야 한다. 
                $ npm run build
                $ npm run start
                



        * SSR (ServerSideRendering)
            : 페이지 요청시 마다 서버에서 런더링 
              장점: 항상 최신의 데이터/ui를 나타냄
              단점: 서버가 느리거나 이상이 있을 때, 화면 렌더링에도 같이 이상이 나타남.



        * SSG (StaticSiteGeneration)
            : 처음 접속 시, 첫 페이지를 렌더링하고, 곧이어 <빌드 타임>을 가져 나머지 페이지들을 렌더링 해 놓고, 이후 다른 페이지를 요청시 미리 그려둔 페이지를 보여준다. 
              장점: 빠르게 페이지를 나타낼 수 있음
              단점: 미리 렌더링(그려놓은 페이지) 한 페이지를 보여주므로, 가장 최신의 데이터/ui가 반영이 안된다. 
                   즉, 주로 바뀌지 않을 페이지를 SSG 방식으로 구현한다.  

            : SSG 페이지로 동적 라우팅( [id].tsx )을 설정 할 때에는, 반드시 사전에 어떤 페이지들(url)이 있을지 getStaticPaths에 정의하여 알려주어야 한다. (안그럼 에러남)
                그래야 사전에 빌드타임에 렌더링 할 때, 페이지를 미리 그려 놓고, 나중에 해당 url를 요청 할 때, 해당하는 페이지를 넘겨줄 수 있기 때문이다. 


        * ISR (Incremental Static Regeneration, 증분 정적 재생상)
            : SSG 방식으로 생성 된 정적 페이지를 일정 시간을 죽기로 다시 생성하는 기술
              즉, SSG와 같이 사전 빌드타임으로 진행되는데, 시간 주기 값을 설정해, 해당 시간 주기 이후부터 페이지 요청이 처음 왔을 때, 다시 모든 페이지의 빌드타임을 가져 렌더링 한다.
              코드: getStaticProps의 return값에 revalidate 설정을 추가해 시간 주기를 설정한다.

            : ISR를 적용하기 어려운 페이지도 존재함
              시간과 관계없이 사용자의 행동에 따라 데이터가 업데이트 되는 페이지

        * On-Demand ISR (온 디맨드 ISR)
            : 요청을 받을 때마다, 페이지를 다시 생성한다
              시간주기로 동작하는 ISR을 사용자의 요청이 있을 때 동작하도록 바꾼 ISR 추가 기능 방식 
              

        
    ```


## 실행 / 렌더링 추전

    ```
        next.js 프로젝트를 할 때, ISR 방식을 사용하는 것을 가장 추천함! 
    ```


### Next Props

    ```
        next에서 약손된 함수(명)들


        * getServerSideProps : getServerSideProps를 사용한 해당 페이지는 SSR로 동작하도록 자동으로 설정 된다. 
                                ex> export const getServerSideProps = () => {};
                               같이 사용되는 type은 => InferGetServerSidePropsType<typeof getServerSideProps> 


        * getStaticProps : getStaticProps를 사용한 페이지는 SSG 로 동작하도록 자동으로 설정 된다. 
                                ex> export const getStaticProps = () => {};
                                같이 사용되는 type은 => InferGetStaticPropsType<typeof getStaticProps>


        * getStaticPaths : SSG에서 동적라우팅( [id].tsx ) 할 때, 존재할 동적 url 들을 getStaticPaths에 정의 해 놓느다. (페이지 요청 전 사전 렌더링 할 수 있게)
                         : paths 에 정의하고, fallback 에 정의되지 않은 url이 넘어왔을 때 처리를 선택해준다. 
                         : fallback에는 3가지 옵션이 있다.
                            - false : 존재하지 않은 경로의 요청은 무조건 Not Found 페이지 반환
                            - "blocking": 즉시 생성 (Like SSR)
                            - true : 즉시 생성 + 페이지만 미리 반환
                            
                            컴포넌트 쪽에서 < router.isFallback > 로 fallback: true 일 때, 체크하여 처리 할 수 있다. 


                                ex> 
                                        export const getStaticPaths = () => {
                                            return {
                                                paths: [
                                                { params: { id: "1" }},         // [!] id 뒤에는 반드시 string 형태
                                                { params: { id: "2" }},
                                                { params: { id: "3" }},
                                                ]
                                            }, 
                                        fallback: false           // [!] fallback 은 위에 정의 되지 않은 url이 넘어왔을 때, 어떻게 처리 할 것인가. (3가지 옵션) 
                                        }
    
    ```