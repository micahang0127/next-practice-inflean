
## Next - App Router


#### 생성 

    ```
        $ npx create-next-app@latest next-app-router
    ```


#### 생성 후 초기 세팅

    ```

        1. css 코드 삭제 
            - src/app/globals.css 내용 전체 삭제 (파일은 남겨둠)
            - src/app.page.module.css 내용 전체 삭제 (파일은 남겨둠)

        2. 코드
            - src/app/page.tsx 내용삭제 
              결과> 
                    import styles from "./page.module.css";

                    export default function Home() {
                        return (
                            <div className={styles.page}>
                            인덱스 페이지
                            </div>
                        );
                    }

                

        [참고] 
        - src/app.layout.tsx 파일은 반드시 존재해야하는 파일이다.
          [!] 그래서 해당 파일명을 변경(or삭제)하면 next가 자동으로!! layout.tsx 파일을 재생성 한다.


    ```


#### 개념

    ```

        * src/app.layout.tsx 파일은 반드시 존재해야하는 파일이다.
          [!] 그래서 해당 파일명을 변경(or삭제)하면 next가 자동으로!! layout.tsx 파일을 재생성 한다.



        * 라우트 그룹 - () 소괄호 폴더
           파일명에 () 소괄호로 감싸면 해당 폴더는 라우터 경로(url접속)에 영향을 주지 않는다. 


        * Co-Location (코 로케이션)
            파일명이 page.tsx 나 layout.tsx 이 아닌 무작위의 파일명도 만들어 평범한 컴포넌트로 사용할 수 있다. 
            ex> searchbar.tsx


        * App Router (앱 라우터)

            - 앱 라우터 버전에서는 페이지의 데이터가 서버 컴포넌트는 RSC 페이로드로, 클리이언트 컴포넌트는 자바스크트 번들(JS Bundle)로 
              나뉘어서 동시에 전달이 된다.


        * generateStaticParams()
          : [앱 라우터 방식에서] 동적 라우터를 빌드타임에 정적페이지로 만듦



        * export const dynamicParams = false;
          : 아래처럼 설정하면, generateStaticParams() 에서 정의 되지 않은 파라미터의 url 접옥에서는 404 에러 띄움 
          : 반대로 위 코드가 없을 때에는, generateStaticParams() 에 정의되지 않은 Url 접속에도 해당 url에 접속이 유효하면, 빌드해서 띄워줌 



        * 라우트 세그먼트 옵션
          **  dynamic 
              1) auto
              2) force-dynamic
              3) force-static
              4) error

             [!] 특별할 때 아니면 사용 권장 되지 않음



    ```



#### React Server Component

    ```
    
        React18v 부터 새롭게 추가된, 새로운 유형의 컴포넌트
        서버측에서만 딱 한번만 실행되는 컴포넌트 (브라우저에서 실행 X)
        즉, js실행(Hydration, 하이드레이션, 상호작용)이 필요없는 페이지를 <서버 컴포넌트>라 하고, 처음에만 렌더링 한다. 
        
        (<-> 클러이언트 컴포넌트)
        js실행(Hydration, 하이드레이션, 상호작용)이 필요한 컴포넌트는 위 서버컴포넌트와 함께 처음에 렌더링 하고(FCP), 
        이후에 다시 렌더랑 한다.(TTI)

        [정리]
        * 서버 컴포넌트 
          : 서버측에서 사전 렌더링을 진행할 때 딱 한번만 실행 됨
        * 클라이언트 컴포넌트
          : 사전 렌더링 진행할 때 한번, 하이드레이션 진행할 때(js bundle(js 번들)로써 브라우저에게 후속으로 전달되어 Hydration을 위해 한 번 더 실행) 한번 총 2번 실행 


        [결론]
        페이지의 대부분을 서버 컴포넌트로 구성할 것을 권장
        클라이어트 컴포넌트는 꼭 필요한 경우에만 사용할 것



        [React Server Component 주의 사항]
        1. 서버 컴포넌트에는 브라우저에서 실행 될 코드가 포함되면 안된다. 
           (import 하는 파일 내부에서도 브라우저에서 실행 될 코드가 포함되어 있으면 해당 모듈을 import해 사용 할 수 없다)
        2. 클라이언트 컴포넌트는 클라이언트에서만 실행되지 않는다. 
        3. [!] 클라이언트 컴포넌트에서 서버 컴포넌트를 import 할 수 없다!
            : 서버 컴포넌트는 초기에 한번만 실행 되는데, 클라이언트 컴포넌트는 이후에도 실행되기 때문에, 내부의 서버 컴포넌트는 실행 할 수 없다. 
              단, 이렇게 사용할 경우 에러가 나지않고, next가 자동적으로 내부에 사용된 서버 컴포넌트를 -> 클라이언트 컴포넌트로 변환환다.
            : 이렇게 사용 권장하지 않음. 
              차라리 이럴 경우, 클라이언트 컴포넌트에서 children props로 받아 사용하길 추천 

            
            : 반대의 경우는 가능하다 - 서버 컴포넌트 내부에서 클라이언트 컴포넌트는 사용 가능




        4. 서버 컴포넌트에서 클라이언트 컴포넌트에게 직렬화 되지 않는 Props는 전달 불가하다 
    
    ```



#### 데이터 캐시(Data Cache) & 리퀘스트 메모이제이션(Request Memoization)

```

  *** 데이터 캐시 ***

  [!] 오직 fetch에서만 사용 가능

  await fetch(`~/api`,  { cache: "force-cache" });          //  요청 결과를 무조건 캐싱함 (한번 호출 된 이후에는 다시는 호출되지 않음)

                        { cache: "no-store" }               //  데이터 캐시 되지 않음 (캐싱을 아예 하지 않도록 설정)

                        { next: { revalidate: 10 } }        //  특정 시간을 주기로 캐시를 업데이트 함 (마치 Page Router의 ISR 방식과 유사함)
                        
                        { next: { tags: ['a'] }}            //  On-Demand Revalidate (요청이 들어왔을 때 데이터를 최신화 함)


  
  *** 리퀘스트 메모이제이션 ***

  [!] next에서 자동적으로 제공한다.
  [!] cache와 다른점 : 하나의 페이지를 렌더링 하는 동안에 중복된 API 요청을 캐싱한다.
                     즉, 렌더링이 종료되면 모든 캐시가 소멸된다. (즉, 새로고침 시 api 재요청됨)

```


#### 페이지 캐싱

```

  ** 풀 라우트 캐시 (Full Route Cache) ** 
    : Next 서버측에서 빌드 타임에 특정 페이지의 렌더링 결과를 캐싱하는 기능



```



#### 이미지 최적화


```
  [!] NEXT에서는 최적화된 이미지 처리 모듈을 제공함.
    - webp, AVIF 등의 차세대 형식으로 변환하기
    - 디바이스 사이즈에 맞는 이미지 불러오기
    - 레이지 로딩 적용하기
    - 블러 이미지 활용하기
    - 기타 등


  import Image from 'next/image';

  export defaultfunction Page() {
    return (
      <Image 
          src="/profile.png"
          width={500}
          height={500}
          alt="Picture of the author"
      />
    )
  }



```
