import { GetServerSidePropsContext, GetStaticPropsContext, InferGetServerSidePropsType, InferGetStaticPropsType } from "next";
import style from "./[id].module.css";
import fetchOneBook from "@/lib/fetch-one-book";
import { useRouter } from "next/router";

const mockData = {
  id: 1,
  title: "한 입 크기로 잘라 먹는 리액트",
  subTitle: "자바스크립트 기초부터 애플리케이션 배포까지",
  description:
    "자바스크립트 기초부터 애플리케이션 배포까지\n처음 시작하기 딱 좋은 리액트 입문서\n\n이 책은 웹 개발에서 가장 많이 사용하는 프레임워크인 리액트 사용 방법을 소개합니다. 인프런, 유데미에서 5000여 명이 수강한 베스트 강좌를 책으로 엮었습니다. 프런트엔드 개발을 희망하는 사람들을 위해 리액트의 기본을 익히고 다양한 앱을 구현하는 데 부족함이 없도록 만들었습니다. \n\n자바스크립트 기초 지식이 부족해 리액트 공부를 망설이는 분, 프런트엔드 개발을 희망하는 취준생으로 리액트가 처음인 분, 퍼블리셔나 백엔드에서 프런트엔드로 직군 전환을 꾀하거나 업무상 리액트가 필요한 분, 뷰, 스벨트 등 다른 프레임워크를 쓰고 있는데, 실용적인 리액트를 배우고 싶은 분, 신입 개발자이지만 자바스크립트나 리액트 기초가 부족한 분에게 유용할 것입니다.",
  author: "이정환",
  publisher: "프로그래밍인사이트",
  coverImgUrl:
    "https://shopping-phinf.pstatic.net/main_3888828/38888282618.20230913071643.jpg",
};


/*
  [!] SSG 페이지로 동적 라우팅( [id].tsx )을 설정 할 때에는, 반드시 사전에 어떤 페이지들(url)이 있을지 getStaticPaths에 정의하여 알려주어야 한다. (안그럼 에러남)
      그래야 사전에 빌드타임에 렌더링 할 때, 페이지를 미리 그려 놓고, 나중에 해당 url를 요청 할 때, 해당하는 페이지를 넘겨줄 수 있기 때문이다. 

      fallback
         paths로 정의 되지 않은 url이 넘어왔을 때, 어떻게 처리 할 것인가. 3가지 옵션이 있음
          - false : 존재하지 않은 경로의 요청은 무조건 Not Found 페이지 반환
          - "blocking": 즉시 생성 (Like SSR)
          - true : 즉시 생성 + 페이지만 미리 반환
*/ 
export const getStaticPaths = () => {
  return {
    paths: [
      { params: { id: "1" }},       // [!] id 뒤 값은 반드시 string 형태이어야 한다.
      { params: { id: "2" }},
      { params: { id: "3" }},
    ],
    fallback: "blocking"                 // [!] fallback 은 위에 정의 되지 않은 url이 넘어왔을 때, 어떻게 처리 할 것인가 
    // false : 404 NotFound
    // blocking : SSR 형식
    // true : SSR 방식 + 데이터가 없는 폴백 상태의 페이지부터 반환
  }
}


export const getStaticProps = async (context: GetStaticPropsContext) => {
  // [!] params!.id => 그냥 params.id 하면, params가 undefined 일수도 있기 때문에 type에러 남. 
  //                   params!.id (!)로 params는 있을 거다! 라는 것을 명시 해줌으로 에러처리 
  const id = context.params!.id;
  const book = await fetchOneBook(Number(id))   

  // [!] book을 불러오지 못 했을 때,(진짜 존재하지 않은 url(페이지)에 접속 했을 때)=> Not Found 페이지로 이동 
  //     ( getStaticPaths의 paths에 정의만 안 된 것이 아닌 )
  if(!book) { 
    return { 
      notFound: true
    }
  }

  return {
    props: { book }
  }
}

export default function Page({book}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  
  if(router.isFallback) return "로딩중 입니다."         
  /*
    [!] getStaticPaths의 fallback: true 일 때, 실행 
        getStaticPaths의 paths에 정의되지 않은 동적 라우트(url)에 접속 했을 때, fallback: true 으로 설정 되어 있으면, 
        해당 컴포넌트(브라우저)를 먼저 실행해서 화면을 일단 보여주고,데이터를 가져오는데 이때 
        if(router.isFallback) return "로딩중 입니다."         
        로 먼저 띄워줄 화면을 return 한다. 
  */


  if(!book) return "문제가 발생했습니다. 다시 시도하세요"

  const {
    id,
    title,
    subTitle,
    description,
    author,
    publisher,
    coverImgUrl,
  } = mockData;

  return (
    <div className={style.container}>
      <div
        className={style.cover_img_container}
        style={{ backgroundImage: `url('${coverImgUrl}')` }}
      >
        <img src={coverImgUrl} />
      </div>
      <div className={style.title}>{title}</div>
      <div className={style.subTitle}>{subTitle}</div>
      <div className={style.author}>
        {author} | {publisher}
      </div>
      <div className={style.description}>{description}</div>
    </div>
  );
}
