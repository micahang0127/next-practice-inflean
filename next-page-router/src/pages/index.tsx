// CSS Module
import SearchableLayout from "@/components/searchable-layout";
import style from "./index.module.css";
import { ReactNode } from "react";
import BookItem from "@/components/book-item";
import { InferGetStaticPropsType } from "next";
import fetchBooks from "@/lib/fetch-books";
import fetchRandomBooks from "@/lib/fetch-random-books";
// [!] next/head (O), next/document (X) -> next/document는 _document.tsx 파일에서만 사용할 수 있다.
import Head from "next/head";


// **[ SSG + SEO ]** 
export const getStaticProps = async () => {

  // [!] 병렬 호출
  const [allBooks, recoBooks] = await Promise.all([
    fetchBooks(),
    fetchRandomBooks()
  ])

  return { 
    props: {
      allBooks,
      recoBooks,
    }, 
    revalidate: 3         // [ISR] 3초 주기로 재검증, revalidate를 추가해주면 ISR 방식으로 적용된다 (SSG이지만 revalidate에 설정한 시간 주기에 때라 재 빌드타임을 가짐)
  }
}; 

export default function Home({allBooks, recoBooks}: InferGetStaticPropsType<typeof getStaticProps>) {

  return (
    <>
    {/* [!] SEO, meta tag (메타태그) 설정 */}
    <Head>
      <title>한입북스 - meta tag title</title>
      {/*  [!] content="/~"  -> 경로에  /~  (앞에 슬래시)는 public 폴더를 가리킴  */}
      <meta property="og:image" content="/thumbnail.png" />    
      <meta property="og:title" content="한입북스" />
      <meta property="og:description" content="ㅎ나입 북스에 등록된 도서들을 만나보세요" />
    </Head>

    <div className={style.container}>
      <section>
        <h3>지금 추천하는 도서</h3>
        {recoBooks && recoBooks.map((book) => (
          <BookItem key={book.id} {...book} />
        ))}
      </section>
      <section>
        <h3>등록된 모든 도서</h3>
        {allBooks && allBooks.map((book) => (
          <BookItem key={book.id} {...book} />
        ))}
      </section>
    </div>
    </>
  );
}

Home.getLayout = (page: ReactNode) => {
  return <SearchableLayout>{page}</SearchableLayout>;
};
